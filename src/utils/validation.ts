import { z } from 'zod';
import { type FormField } from '../types/form';

const detectFieldType = (field: FormField): FormField['widget'] => {
  const fieldName = field.id.toLowerCase();
  const fieldLabel = field.label.toLowerCase();
  
  const textPatterns = [
    'name', 'company', 
    'email', 'phone', 'notes',  'department', 'region', 'city', 'type'
  ];
  
  const integerPatterns = [
    'age', 'year', 'month', 'day', 'quantity', 'rating', 'height', 'sku',
    'width', 'version', 'discount', 'price', 'priority'
  ];
  
  const isTextual = textPatterns.some(pattern => 
    fieldName.includes(pattern) || fieldLabel.includes(pattern)
  );
  
  const isNumeric = integerPatterns.some(pattern => 
    fieldName.includes(pattern) || fieldLabel.includes(pattern)
  );
  
  // Override API widget type if we detect a mismatch
  if (isTextual && field.widget === 'integer') {
    return 'text';
  }
  
  if (isNumeric && field.widget === 'text') {
    return 'integer';
  }

  return field.widget;
};


export const processFormFields = (fields: FormField[]): FormField[] => {
  return fields.map(field => ({
    ...field,
    widget: detectFieldType(field),
    originalWidget: field.widget 
  }));
};

export const createFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodType> = {};
  
  
  const processedFields = processFormFields(fields);

  processedFields.forEach((field) => {
    switch (field.widget) {
      case 'integer':
        shape[field.id] = z
          .string()
          .min(1, `${field.label} is required`)
          .refine(
            (val) => {
              const trimmed = val.trim();
              if (trimmed === '') return false;
              
              const isValid = /^-?\d+$/.test(trimmed);
              if (!isValid) {
                const hasLetters = /[a-zA-Z]/.test(trimmed);
                if (hasLetters) {
                  console.warn(`Integer field "${field.label}" contains letters. This might be incorrectly configured as numeric.`);
                }
              }
              return isValid;
            },
            { message: `${field.label} must be a valid whole number (e.g., 123, -45)` }
          )
          .transform((val) => parseInt(val.trim(), 10));
        break;
      case 'text':
        shape[field.id] = z
          .string()
          .min(1, `${field.label} is required`)
          .min(2, `${field.label} must be at least 2 characters`)
          .refine(
            (val) => {
              const isOnlyNumbers = /^\d+$/.test(val);
              if (isOnlyNumbers && val.length > 5) {
                console.warn(`Text field "${field.label}" contains only numbers. Consider if this should be a numeric field.`);
              }
              return true; 
            },
            { message: `${field.label} validation failed` }
          );
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
