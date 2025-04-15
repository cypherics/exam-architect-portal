
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Label } from 'src/components/ui/label';
import { Input } from "@/components/ui/input";
import { Section } from "@/types/exam";
import { PlusCircle, Edit, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { QuestionCard } from "@/components/Question";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useExamPageContext } from "@/context/ExamPageContext";
import { useSectionValues } from "@/hooks/useSectionDerivedValues";
import { varAlpha } from 'minimal-shared/utils';


interface SectionComponentProps {
  section: Section;
}

export const SectionComponent: React.FC<SectionComponentProps> = (props) => {
  const { section } = props;
  const { state, actions, setters } = useExamPageContext();
  const { computedValues } = useSectionValues({ section: section });
  const { totalMarks, totalQuestions } = computedValues;

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'banned', label: 'Banned' },
  ];

  const [currentFilters, setCurrentFilters] = useState({ status: 'all' });

  const handleFilterStatus = (event: React.SyntheticEvent, newValue: string) => {
  setCurrentFilters((prev) => ({ ...prev, status: newValue }));
};

const tableData = [
  { id: 1, name: 'Alice', status: 'active' },
  { id: 2, name: 'Bob', status: 'pending' },
];

  return (
    <div className="section-container bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-elevation hover:shadow-lg transition-all duration-300 transform ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {state.sectionStates.isEditing ? (
            <div className="flex items-center gap-2 scale-in">
              <Input
                value={state.sectionStates.editedTitle}
                onChange={(e) => actions.sectionActions.handleTitleChange(e.target.value)}
                className="h-9 py-1 border-b-2 border-primary bg-blue-50/50 rounded-md focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={() => actions.sectionActions.handleSaveTitle(section)} className="transition-all duration-200 hover:bg-green-100 hover:text-green-700">
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save changes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={() => actions.sectionActions.handleCancelEdit(section)} className="transition-all duration-200 hover:bg-red-100 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel editing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <h3 className="font-semibold text-lg text-gradient-primary">{section.title}</h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2 bg-blue-50/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} • {totalMarks} marks
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full transition-colors hover:bg-blue-100 hover:text-blue-700 active:scale-95"
                  onClick={() => actions.sectionActions.handleStartEditing()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit section title</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full transition-colors hover:bg-red-100 hover:text-red-700 active:scale-95"
                  onClick={() => actions.sectionActions.deleteSection(section)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete section</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${section.isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        {section.questions.length > 0 ? (
          <ScrollArea className="pr-4 ml-4 pt-2">
            <div className="space-y-4">
              {section.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <QuestionCard
                    question={question}
                    onDelete={() => actions.questionActions.handleDeleteQuestion(question, section)}
                    onEdit={() => actions.questionActions.handleEditQuestion(section, question, setters.optionSetters.setOptions)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-6 px-4 text-center text-muted-foreground bg-blue-50/30 rounded-lg ml-4 mb-4">
            No questions added yet
          </div>
        )}

        <Button
          onClick={() => actions.questionActions.handleAddQuestion(section)}
          variant="outline"
          className="flex items-center gap-2 w-full mt-4 transition-all duration-300 bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 hover:border-blue-300 shadow-sm active:scale-[0.99]"
        >
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
  );
};

export default SectionComponent;
