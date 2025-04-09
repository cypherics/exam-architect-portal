
import { useState } from "react";
import { Section } from "@/types/exam";

interface UseSectionComponentProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onDelete: (id: string) => void;
  onAddQuestion: () => void;
  onToggleExpand: () => void;
}

/**
 * Custom hook to manage SectionComponent state and handlers
 */
export const useSectionComponent = ({
  section,
  onUpdate,
  onDelete,
  onAddQuestion,
  onToggleExpand
}: UseSectionComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.title);

  // Title editing handlers
  const handleStartEditing = () => setIsEditing(true);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdate({ ...section, title: editedTitle });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(section.title);
    setIsEditing(false);
  };

  const handleTitleChange = (value: string) => setEditedTitle(value);

  // Question management
  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    onUpdate({ ...section, questions: updatedQuestions });
  };

  // Computed values
  const totalMarks = section.questions.reduce((sum, q) => sum + q.marks, 0);
  const questionCount = section.questions.length;

  return {
    state: {
      isEditing,
      editedTitle,
      totalMarks,
      questionCount
    },
    actions: {
      handleStartEditing,
      handleSaveTitle,
      handleCancelEdit,
      handleTitleChange,
      handleDeleteQuestion,
      onDelete,
      onAddQuestion,
      onToggleExpand
    }
  };
};
