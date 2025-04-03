
import React from "react";
import { Question } from "./ExamBuilder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onDelete: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onDelete }) => {
  return (
    <div className={`question-container ${question.language === "arabic" ? "font-noto" : ""} fade-in`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.marks} marks</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-medium text-base">
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
            className={`p-2 border rounded-md flex items-start gap-2 ${option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
          >
            <div className={`rounded-full h-5 w-5 flex items-center justify-center text-xs ${option.isCorrect
              ? "bg-green-500 text-white"
              : "bg-muted text-muted-foreground"
              }`}>
              {String.fromCharCode(65 + index)}
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
