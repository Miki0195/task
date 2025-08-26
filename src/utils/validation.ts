import { z } from 'zod';
import { type FormField } from '../types/form';

export const createFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodType> = {};

  fields.forEach((field) => {
    switch (field.widget) {
      case 'integer':
        shape[field.id] = z
          .string()
          .min(1, `${field.label} is required`)
          .regex(/^-?\d+$/, `${field.label} must be a valid number (integer only)`)
          .transform((val) => parseInt(val, 10));
        break;
      case 'text':
        shape[field.id] = z
          .string()
          .min(1, `${field.label} is required`)
          .min(2, `${field.label} must be at least 2 characters`);
        break;
      case 'choice':
        shape[field.id] = z
          .string()
          .min(1, `${field.label} is required`);
        break;
      default:
        shape[field.id] = z.string().min(1, `${field.label} is required`);
    }
  });

  return z.object(shape);
};
