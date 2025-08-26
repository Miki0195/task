
import { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { type FormField as FormFieldType } from '../types/form';
import { useChoiceOptions } from '../hooks/useFormQuery';

interface FormFieldProps {
  field: FormFieldType;
}

export const FormField: FC<FormFieldProps> = ({ field }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const {
    data: choiceOptions,
    isLoading: choiceLoading,
    error: choiceError,
  } = useChoiceOptions(field.id, field.widget === 'choice');

  const error = errors[field.id];
  const errorMessage = error?.message as string;

  const baseInputClasses = `
    form-input w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error 
      ? 'border-red-300 bg-red-50 error' 
      : 'border-gray-300 bg-white hover:border-gray-400'
    }
  `;

  const renderInput = () => {
    switch (field.widget) {
      case 'integer':
        return (
          <input
            {...register(field.id)}
            type="text"
            inputMode="numeric"
            placeholder={`Enter a number for ${field.label.toLowerCase()}`}
            className={baseInputClasses}
          />
        );

      case 'text':
        return (
          <input
            {...register(field.id)}
            type="text"
            placeholder={`Enter text for ${field.label.toLowerCase()}`}
            className={baseInputClasses}
          />
        );

      case 'choice':
        if (choiceLoading) {
          return (
            <div className={`${baseInputClasses} flex items-center justify-center`}>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">Loading options...</span>
            </div>
          );
        }

        if (choiceError) {
          return (
            <div className="px-4 py-3 rounded-lg border-2 border-red-300 bg-red-50 text-red-600">
              Error loading options. Please try again.
            </div>
          );
        }

        return (
          <select
            {...register(field.id)}
            className={`form-select ${baseInputClasses}`}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {choiceOptions?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6 form-field">
      <label
        htmlFor={field.id}
        className="form-label block text-sm font-semibold text-gray-700 mb-2"
      >
        {field.label}
        <span className="text-red-500 ml-1">*</span>
        <span className={`ml-2 text-xs px-2 py-1 rounded ${
          field.widget === 'integer' ? 'bg-blue-100 text-blue-700' :
          field.widget === 'text' ? 'bg-green-100 text-green-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {field.widget === 'integer' ? 'Numbers only' : 
           field.widget === 'text' ? 'Text' : 
           'Select option'}
        </span>
      </label>
      
      {renderInput()}
      
      {errorMessage && (
        <p className="form-error mt-2 text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
