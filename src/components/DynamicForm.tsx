import { useMemo, useState, type FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './FormField';
import { useFormDefinition } from '../hooks/useFormQuery';
import { createFormSchema } from '../utils/validation';
import { formApi } from '../services/api';
import { type FormData } from '../types/form';


export const DynamicForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    data: formFields,
    isLoading,
    error,
    refetch,
  } = useFormDefinition();

  const formSchema = useMemo(() => {
    return formFields ? createFormSchema(formFields) : null;
  }, [formFields]);

  const methods = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    mode: 'onChange',
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      console.log('Submitting form data:', data);
      const response = await formApi.submitForm(data as FormData);
      
      setSubmitMessage({
        type: 'success',
        text: response.message || 'Form submitted successfully!',
      });

      methods.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Unable to load form
            </h2>
            <p className="text-gray-600 mb-6">
              There was an error loading the form definition. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formFields || formFields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              No form fields available
            </h2>
            <p className="text-gray-600">
              The form definition is empty. Please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 form-container">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 form-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 form-title">
              Dynamic Form
            </h1>
            <p className="text-gray-600 form-subtitle">
              Please fill out all the required fields below
            </p>
            <div className="text-center mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> Field types are randomly assigned by the API. 
                Please follow the field type indicators and validation messages.
              </p>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map((field) => (
                <FormField key={field.id} field={field} />
              ))}

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'message-success bg-green-50 text-green-800 border border-green-200'
                      : 'message-error bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {submitMessage.type === 'success' ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{submitMessage.text}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`form-submit w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Form'
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
