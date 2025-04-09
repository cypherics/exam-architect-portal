
import { useState, useEffect } from "react";
import { useExamManager } from "@/hooks/use-exam-manager";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to manage the Index page state and handlers
 * Provides state, actions, and dialogue management for the landing page
 */
export const useIndexPage = () => {
  const { toast } = useToast();

  const {
    state: { savedExams, examDetails, sections, importError },
    actions: { createExam, handleExamUpdate, handleFileChange },
    setters: { setSections, setExamDetails, },
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
      showImportExamDialog
    },
    actions: {
      createExam,
      handleExamUpdate,
      handleFileChange
    },
    setters: {
      setSections,
      setExamDetails,
      setShowNewExamDialog,
      setShowImportExamDialog
    }
  };
};
