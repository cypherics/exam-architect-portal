import { useState } from "react";
import { useExamManager } from "@/hooks/use-exam-manager";
import { useToast } from "@/components/ui/use-toast";
import { ExamDescription } from "@/types/exam";

export interface useIndexPageProps {
  state: {
    savedExams: any[];  // Replace `any` with a specific type if known
    examDetails: any;   // Replace `any` with a specific type if known
    sections: any[];    // Replace `any` with a specific type if known
    importError: string | null;
    showNewExamDialog: boolean;
    showImportExamDialog: boolean;
  };
  actions: {
    createExam: (newExam: ExamDescription) => void;
    handleExamUpdate: (updatedExam: any) => void;  // Replace `any` with a specific type if known
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setters: {
    setSections: React.Dispatch<React.SetStateAction<any[]>>;  // Replace `any[]` with the specific section type
    setExamDetails: React.Dispatch<React.SetStateAction<any>>; // Replace `any` with the specific exam detail type
    setShowNewExamDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setShowImportExamDialog: React.Dispatch<React.SetStateAction<boolean>>;
  };
}


/**
 * Custom hook to manage the Index page state and handlers.
 * Provides state, actions, and dialogue management for the landing page.
 * 
 * @returns An object containing the state, actions, and setters for managing the index page.
 */
export const useIndexPage = (): useIndexPageProps => {
  const { toast } = useToast();

  const {
    state: { savedExams, examDetails, sections, importError },
    actions: { createExam, handleExamUpdate, handleFileChange },
    setters: { setSections, setExamDetails },
  } = useExamManager();

  // UI state for dialogs
  const [showNewExamDialog, setShowNewExamDialog] = useState<boolean>(false);
  const [showImportExamDialog, setShowImportExamDialog] = useState<boolean>(false);

  return {
    state: {
      savedExams,
      examDetails,
      sections,
      importError,
      showNewExamDialog,
      showImportExamDialog,
    },
    actions: {
      createExam,
      handleExamUpdate,
      handleFileChange,
    },
    setters: {
      setSections,
      setExamDetails,
      setShowNewExamDialog,
      setShowImportExamDialog,
    },
  };
};
