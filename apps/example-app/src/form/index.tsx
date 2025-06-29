import { z } from 'zod';

export type HiveForm1Form = {
  message: string;
  category?: string;
};

export const hiveForm1Schema = z.object({
  message: z.string(),
  category: z.string().optional()
});

export const hiveForm1DefaultValues = {
  message: '',
  category: ''
};

export const hiveForm1Config = {
  type: {} as HiveForm1Form,
  schema: hiveForm1Schema,
  defaultValues: hiveForm1DefaultValues,
  fields: [
  {
    "name": "message",
    "optional": false
  },
  {
    "name": "category",
    "optional": true
  }
]
};