
import { ExamDescription } from "@/types/exam";

interface UseExamFormProps {
  exam: ExamDescription;
  onChange: (exam: ExamDescription) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Custom hook to manage the ExamForm component
 */
export const useExamForm = ({ exam, onChange, onSubmit, onCancel }: UseExamFormProps) => {
  // Handle form field changes
  const handleTitleChange = (value: string) => {
    onChange({ ...exam, title: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...exam, description: value });
  };

  const handleDurationChange = (value: string) => {
    onChange({ ...exam, duration: value });
  };

  const handlePassingScoreChange = (value: string) => {
    onChange({ ...exam, passingScore: value });
  };

  return {
    actions: {
      handleTitleChange,
      handleDescriptionChange,
      handleDurationChange,
      handlePassingScoreChange,
      onSubmit,
      onCancel
    }
  };
};
