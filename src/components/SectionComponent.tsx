
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
            className="p-0 h-8 w-8 rounded-full transition-all duration-300" 
            onClick={onToggleExpand}
          >
            {section.isExpanded ? 
              <ChevronDown className="h-5 w-5 transition-transform duration-300" /> : 
              <ChevronRight className="h-5 w-5 transition-transform duration-300" />}
          </Button>
          
          {isEditing ? (
            <div className="flex items-center gap-2 scale-in">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-9 py-1 border-b-2 border-primary bg-blue-50/50 rounded-md focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveTitle} className="transition-all duration-200 hover:bg-green-100 hover:text-green-700">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="transition-all duration-200 hover:bg-red-100 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h3 className="font-semibold text-lg">{section.title}</h3>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2 bg-muted/50 px-3 py-1 rounded-full">
            {questionCount} question{questionCount !== 1 ? 's' : ''} • {totalMarks} marks
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full transition-colors hover:bg-blue-100 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full transition-colors hover:bg-red-100 hover:text-red-700"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ${section.isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="space-y-3 ml-4 pt-2">
          {section.questions.map((question, index) => (
            <div 
              key={question.id} 
              className="fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuestionCard 
                question={question} 
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            </div>
          ))}
          
          <Button
            onClick={onAddQuestion}
            variant="outline"
            className="flex items-center gap-2 w-full mt-4 transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 btn-hover"
          >
            <PlusCircle className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionComponent;
