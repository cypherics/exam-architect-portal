
import React, { useState } from "react";
import { Question } from "./ExamBuilder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuestionCardProps {
  question: Question;
  onDelete: () => void;
  onEdit?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div 
      className={cn(
        "question-container transition-all duration-300",
        question.language === "arabic" ? "font-noto rtl" : "",
        "hover:shadow-elevation border border-blue-100 hover:border-blue-200 bg-gradient-to-b from-white to-blue-50/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={`Question: ${question.text}`}
      role="region"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 transition-colors duration-300"
          >
            {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                  onClick={onEdit}
                  onKeyDown={(e) => onEdit && handleKeyDown(e, onEdit)}
                  aria-label="Edit question"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit question</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-red-50 transition-colors duration-200"
                  onClick={onDelete}
                  onKeyDown={(e) => handleKeyDown(e, onDelete)}
                  aria-label="Delete question"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete question</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-medium text-base text-gray-800">
          {question.text}
        </h4>
        {question.description && (
          <p className="text-muted-foreground text-sm mt-1">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-2 mt-4">
        {question.options.map((option, index) => (
          <div
            key={option.id}
            className={cn(
              "p-2 rounded-md flex items-start gap-2 transition-all duration-300",
              option.isCorrect 
                ? "border-green-300 bg-green-50 hover:bg-green-100" 
                : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
            tabIndex={0}
          >
            <div 
              className={cn(
                "rounded-full h-5 w-5 flex items-center justify-center text-xs transition-colors duration-300",
                option.isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {option.isCorrect ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + index)}
            </div>
            <span className={option.isCorrect ? "text-green-700" : ""}>
              {option.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
