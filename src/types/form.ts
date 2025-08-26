export interface FormField {
  id: string;
  label: string;
  widget: 'integer' | 'text' | 'choice';
}

export type ChoiceOption = string;

export interface FormData {
  [key: string]: string | number;
}

export interface FormSubmissionResponse {
  success: boolean;
  message?: string;
}
