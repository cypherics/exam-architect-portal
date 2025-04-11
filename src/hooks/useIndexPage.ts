import { useState, useCallback, useEffect } from "react";
import { ExamDescription, Section } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";
import { convertImportedExamToAppFormat, validateExamData } from "@/utils/examConverter";
import { useNavigate } from "react-router-dom";
import { useIsExamNew } from "@/context/IsExamNewContext";
import { defaultSection } from "@/hooks/useSections";
export interface useIndexPageProps {
  state: {
    savedExams: any[];
    examDetails: any;
    sections: any[];
    importError: string | null;
    showNewExamDialog: boolean;
    showImportExamDialog: boolean;
  };
  actions: {
    createExam: (newExam: ExamDescription) => void;
    handleExamUpdate: (updatedExam: any) => void;
    EditExam: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setters: {
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
    setExamDetails: React.Dispatch<React.SetStateAction<any>>;
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
  const { isExamNew: isExamNew, setIsNewExam: setIsNewExam } = useIsExamNew();

  // UI state for dialogs
  const [showNewExamDialog, setShowNewExamDialog] = useState<boolean>(false);
  const [showImportExamDialog, setShowImportExamDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  // Use localStorage for saved exams and window closed state
  const [savedExams, setSavedExams] = useState<ExamDescription[]>([]);

  // Regular state for current exam session
  const [sections, setSections] = useState<Section[]>([
    defaultSection(),
  ]);
  const [importError, setImportError] = useState<string | null>(null);
  const [examDetails, setExamDetails] = useState<ExamDescription>({
    id: "",
    title: "",
    description: "",
    duration: "",
    passingScore: "",
  });

  /**
     * Creates a new exam and navigates to the exam editor
     * @param newExam - The exam details to create
     */
  const createExam = (newExam: ExamDescription) => {
    try {
      if (!newExam.title || !newExam.description || !newExam.duration || !newExam.passingScore) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const exam: ExamDescription = {
        id: `${Math.floor(1000 + Math.random() * 9000)}`,
        title: newExam.title,
        description: newExam.description,
        duration: newExam.duration,
        passingScore: newExam.passingScore,
      };

      setSavedExams((prev) => [...prev, exam]);
      setExamDetails(exam);
      setSections([
        defaultSection(),
      ]);

      toast({
        title: "Exam Created",
        description: "Your exam has been created successfully.",
      });
      setIsNewExam(true);
      navigate(`/exam/${exam.id}`, { state: { examDetails: exam, sections: sections } });
    } catch (error) {
      console.error("Error creating exam:", error);
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Updates an existing exam's details
   * @param updatedExam - The updated exam details
   */
  const handleExamUpdate = (updatedExam: ExamDescription) => {
    try {
      setSavedExams((prev) =>
        prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
      );
      if (examDetails?.id === updatedExam.id) {
        setExamDetails(updatedExam);
      }
    } catch (error) {
      console.error("Error updating exam:", error);
      toast({
        title: "Error",
        description: "Failed to update exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles file import for exams
   * @param e - The file input change event
   */
  const EditExam = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (!validateExamData(jsonData)) {
          setImportError("Invalid exam format. Please check your JSON file structure.");
          toast({
            title: "Invalid Format",
            description: "The imported JSON file has an invalid format.",
            variant: "destructive",
          });
          return;
        }

        const { exam: importedExam, sections: importedSections } =
          convertImportedExamToAppFormat(jsonData);

        if (!savedExams.some((exam) => exam.title === importedExam.title)) {
          setSavedExams((prev) => [...prev, importedExam]);
        }

        setExamDetails(importedExam);
        setSections(importedSections);
        setIsNewExam(false);

        navigate(`/exam/${importedExam.id}`, { state: { examDetails: importedExam, sections: importedSections } });
        toast({
          title: "Exam Imported",
          description: `Successfully imported ${importedExam.title}`,
        });
      } catch (error) {
        console.error("Error importing exam:", error);
        setImportError("Failed to parse the JSON file. Please check the file format.");
        toast({
          title: "Import Error",
          description: "Failed to parse the JSON file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Reset window closed state when component unmounts or when explicitly called
  useEffect(() => {
    return () => {
      // Clean up function - not strictly necessary here but follows best practices
      console.log("useExamManager unmounting");
    };
  }, []);

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
      EditExam,
    },
    setters: {
      setSections,
      setExamDetails,
      setShowNewExamDialog,
      setShowImportExamDialog,
    },
  };
};
