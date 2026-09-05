/**
 * Helpers for the "does this record belong to the requesting user" check
 * that every route needs before reading/updating/deleting a record.
 *
 * The previous pattern in every route was two round trips:
 *   1. findUnique({ where: { id } })
 *   2. compare record.user_id === userId in JS, then update/delete separately
 *
 * That's both slower (2 queries instead of 1) and, in several routes, the
 * ownership check was skipped entirely - meaning any authenticated user
 * could read/update/delete another user's record just by knowing its id
 * (an IDOR vulnerability). Filtering by (id, user_id) in a single query
 * fixes both problems at once: Prisma delegates all take the same shape of
 * `{ where, data? }` args, so these helpers work across every model.
 */

type FindFirstDelegate<T> = {
  findFirst: (args: { where: Record<string, any> }) => Promise<T | null>;
};

type MutateManyDelegate = {
  updateMany?: (args: { where: Record<string, any>; data: Record<string, any> }) => Promise<{ count: number }>;
  deleteMany?: (args: { where: Record<string, any> }) => Promise<{ count: number }>;
};

export function findOwned<T>(
  delegate: FindFirstDelegate<T>,
  id: string,
  userId: string,
  extraWhere: Record<string, any> = {}
): Promise<T | null> {
  return delegate.findFirst({ where: { id, user_id: userId, ...extraWhere } });
}

export function updateOwned(
  delegate: Required<Pick<MutateManyDelegate, "updateMany">>,
  id: string,
  userId: string,
  data: Record<string, any>
): Promise<{ count: number }> {
  return delegate.updateMany({ where: { id, user_id: userId }, data });
}

export function deleteOwned(
  delegate: Required<Pick<MutateManyDelegate, "deleteMany">>,
  id: string,
  userId: string
): Promise<{ count: number }> {
  return delegate.deleteMany({ where: { id, user_id: userId } });
}
