export {};

declare global {
  namespace Express {
    interface Request {
      // Populated by verifyToken from the verified JWT cookie.
      user?: {
        userId: string;
      };
    }
  }
}
