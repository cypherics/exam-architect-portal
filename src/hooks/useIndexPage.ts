
import { useState, useEffect } from "react";
import { useExamManager } from "@/hooks/use-exam-manager";
import { ExamDescription } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to manage the Index page state and handlers
 * Provides state, actions, and dialogue management for the landing page
 */
export const useIndexPage = () => {
  const { toast } = useToast();
  
  const {
    state: { savedExams, examDetails, sections, importError, windowWasClosed },
    actions: { createExam, handleExamUpdate, handleFileChange, checkWindowClosedState },
    setters: { setSections, setExamDetails, setWindowWasClosed },
  } = useExamManager();

  // UI state for dialogs
  const [showNewExamDialog, setShowNewExamDialog] = useState<boolean>(false);
  const [showImportExamDialog, setShowImportExamDialog] = useState<boolean>(false);

  // Check if window was previously closed on component mount
  useEffect(() => {
    console.log("Index component mounted, checking localStorage");
    const wasWindowClosed = checkWindowClosedState();
    
    if (wasWindowClosed) {
      // Reset the window closed flag for future sessions
      setWindowWasClosed(false);
      
      // Notify user that their session was restored after window closure
      toast({
        title: "Session Reset",
        description: "Your previous session was closed, starting fresh."
      });
    }
  }, [checkWindowClosedState, setWindowWasClosed, toast]);

  return {
    state: {
      savedExams,
      examDetails,
      sections,
      importError,
      windowWasClosed,
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
