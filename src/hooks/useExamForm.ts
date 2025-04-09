
import { useCallback } from "react";
import { ExamDescription } from "@/types/exam";

interface UseExamFormProps {
  exam: ExamDescription;
  onChange: (exam: ExamDescription) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Custom hook to manage the ExamForm component
 * Handles form field changes and submission
 */
export const useExamForm = ({ exam, onChange, onSubmit, onCancel }: UseExamFormProps) => {
  // Handle form field changes with memoized callbacks
  const handleTitleChange = useCallback((value: string) => {
    onChange({ ...exam, title: value });
  }, [exam, onChange]);

  const handleDescriptionChange = useCallback((value: string) => {
    onChange({ ...exam, description: value });
  }, [exam, onChange]);

  const handleDurationChange = useCallback((value: string) => {
    // Ensure value is a valid number or empty string
    const numericValue = value === '' ? '' : value.replace(/[^\d]/g, '');
    onChange({ ...exam, duration: numericValue });
  }, [exam, onChange]);

  const handlePassingScoreChange = useCallback((value: string) => {
    // Ensure value is a valid number between 0-100 or empty string
    let numericValue = value === '' ? '' : value.replace(/[^\d]/g, '');
    
    // Cap passing score at 100
    if (numericValue !== '' && parseInt(numericValue) > 100) {
      numericValue = '100';
    }
    
    onChange({ ...exam, passingScore: numericValue });
  }, [exam, onChange]);

  // Validate form before submission
  const validateForm = useCallback(() => {
    return Boolean(
      exam.title &&
      exam.description &&
      exam.duration &&
      exam.passingScore
    );
  }, [exam]);

  // Handle form submission with validation
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit();
    }
  }, [validateForm, onSubmit]);

  return {
    actions: {
      handleTitleChange,
      handleDescriptionChange,
      handleDurationChange,
      handlePassingScoreChange,
      onSubmit: handleSubmit,
      onCancel,
      validateForm
    }
  };
};
