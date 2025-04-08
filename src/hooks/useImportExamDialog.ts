
import { useRef } from "react";

interface UseImportExamDialogProps {
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook to manage the ImportExamDialog component
 */
export const useImportExamDialog = ({ onFileImport }: UseImportExamDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return {
    refs: {
      fileInputRef
    },
    actions: {
      handleButtonClick,
      onFileImport
    }
  };
};
