import {z} from 'zod';

export const TagSchema = z.object({
  tag_name : z.string().optional(),
  description : z.string().optional(),
  color_code : z.string().startsWith("#", {
    message : "Color should start with #"
  }).optional()
})

export type TagType = z.infer<typeof TagSchema>