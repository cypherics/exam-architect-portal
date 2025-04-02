
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section, Question } from "./ExamBuilder";
import { PlusCircle, Edit, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import QuestionCard from "./QuestionCard";

interface SectionComponentProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onDelete: (id: string) => void;
  onAddQuestion: () => void;
  onToggleExpand: () => void;
}

const SectionComponent: React.FC<SectionComponentProps> = ({
  section,
  onUpdate,
  onDelete,
  onAddQuestion,
  onToggleExpand,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.title);
  
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
  
  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    onUpdate({ ...section, questions: updatedQuestions });
  };
  
  const totalMarks = section.questions.reduce((sum, q) => sum + q.marks, 0);
  const questionCount = section.questions.length;

  return (
    <div className="section-container fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-6 w-6" 
            onClick={onToggleExpand}
          >
            {section.isExpanded ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />}
          </Button>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-8 py-1"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h3 className="font-semibold text-lg">{section.title}</h3>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {questionCount} question{questionCount !== 1 ? 's' : ''} • {totalMarks} marks
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {section.isExpanded && (
        <div className="space-y-3 ml-4">
          {section.questions.map(question => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}
          
          <Button
            onClick={onAddQuestion}
            variant="outline"
            className="flex items-center gap-2 w-full mt-4"
          >
            <PlusCircle className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionComponent;
