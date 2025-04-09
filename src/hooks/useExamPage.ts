import { useState, useCallback, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Section, Question, ExamDescription } from "@/types/exam";

export const useExamPage = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};
  const { toast } = useToast();

  // Initialize with either location state or saved state
  const initialExamDetails = locationExamDetails;
  const initialSections = locationSections;

  // State management
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamDescription | null>(initialExamDetails);
  const [showLanguageDialog, setShowLanguageDialog] = useState<boolean>(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);

  // Action Handlers
  const addSection = () => {
    const newSection: Section = {
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Section ${sections.length + 1}`,
      questions: [],
      isExpanded: true,
    };
    setSections((prev) => [...prev, newSection]);
    setPendingChanges(true);
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
    setPendingChanges(true);
  };

  const updateSection = (updatedSection: Section) => {
    setSections((prev) =>
      prev.map((section) => (section.id === updatedSection.id ? updatedSection : section))
    );
    setPendingChanges(true);
  };

  const toggleSectionExpand = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  // Question Handlers
  const handleAddQuestion = useCallback((sectionId: string) => {
    try {
      setSelectedSection(sectionId);
      setShowLanguageDialog(true);
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleLanguageSelected = useCallback((language: "english" | "arabic") => {
    setSelectedLanguage(language);
    setShowLanguageDialog(false);
    setShowQuestionDialog(true);
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string, section: Section) => {
    try {
      const updatedQuestions = section.questions.filter(q => q.id !== questionId);
      updateSection({ ...section, questions: updatedQuestions });

      toast({
        title: "Question Deleted",
        description: "The question has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, updateSection]);

  const handleQuestionAdded = useCallback((question: Question) => {
    if (!selectedSection) return;

    try {
      const updatedSections = sections.map((section) =>
        section.id === selectedSection
          ? { ...section, questions: [...section.questions, question] }
          : section
      );

      setSections(updatedSections);
      setPendingChanges(true);
      setShowQuestionDialog(false);
      setSelectedSection(null);
      setSelectedLanguage(null);

      toast({
        title: "Question Added",
        description: "Your question has been successfully added to the section.",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedSection, sections, toast]);

  // Return combined state, actions, and setters
  return {
    state: {
      sections,
      currentExam,
      showLanguageDialog,
      showQuestionDialog,
      selectedLanguage,
      pendingChanges,
    },
    actions: {
      addSection,
      deleteSection,
      updateSection,
      toggleSectionExpand,
      handleAddQuestion,
      handleLanguageSelected,
      handleDeleteQuestion,
      handleQuestionAdded,
    },
    setters: {
      setShowLanguageDialog,
      setShowQuestionDialog,
      setCurrentExam,
      setPendingChanges,
    },
  };
};
