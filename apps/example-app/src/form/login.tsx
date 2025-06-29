import { z } from 'zod';

export type LoginForm = {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe?: string;
};

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  rememberMe: z.string().optional()
});

export const loginDefaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: ''
};

export const loginConfig = {
  type: {} as LoginForm,
  schema: loginSchema,
  defaultValues: loginDefaultValues,
  fields: [
  {
    "name": "email",
    "optional": false
  },
  {
    "name": "password",
    "optional": false
  },
  {
    "name": "confirmPassword",
    "optional": false
  },
  {
    "name": "rememberMe",
    "optional": true
  }
]
};