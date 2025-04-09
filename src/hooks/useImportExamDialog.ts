
import { useRef, useCallback } from "react";

interface UseImportExamDialogProps {
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook to manage the ImportExamDialog component
 * Handles file input references and click handlers
 */
export const useImportExamDialog = ({ onFileImport }: UseImportExamDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers click on hidden file input when button is clicked
   */
  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

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
