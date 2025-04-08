
import { useState, useEffect } from "react";

interface UseQuestionCardProps {
  autoSaved?: boolean;
  onEdit?: () => void;
  onDelete: () => void;
}

/**
 * Custom hook to manage QuestionCard component state and effects
 */
export const useQuestionCard = ({ autoSaved = false, onEdit, onDelete }: UseQuestionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Show saved indicator when autoSaved prop changes to true
  useEffect(() => {
    if (autoSaved) {
      console.log("Auto-saved indicator triggered");
      setShowSavedIndicator(true);
      const timer = setTimeout(() => {
        setShowSavedIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSaved]);

  return {
    isHovered,
    showSavedIndicator,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    onEdit,
    onDelete
  };
};
