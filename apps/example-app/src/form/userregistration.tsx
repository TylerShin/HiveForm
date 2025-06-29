import { z } from 'zod';

export type UserRegistrationForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age?: string;
};

export const userRegistrationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  age: z.string().optional()
});

export const userRegistrationDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: ''
};

export const userRegistrationConfig = {
  type: {} as UserRegistrationForm,
  schema: userRegistrationSchema,
  defaultValues: userRegistrationDefaultValues,
  fields: [
  {
    "name": "firstName",
    "optional": false
  },
  {
    "name": "lastName",
    "optional": false
  },
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
    "name": "age",
    "optional": true
  }
]
};