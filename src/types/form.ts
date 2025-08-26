export interface FormField {
  id: string;
  label: string;
  widget: 'integer' | 'text' | 'choice';
  originalWidget?: 'integer' | 'text' | 'choice'; // Track original API widget type
}

export type ChoiceOption = string;

export interface FormData {
  [key: string]: string | number;
}

export interface FormSubmissionResponse {
  success: boolean;
  message?: string;
}
