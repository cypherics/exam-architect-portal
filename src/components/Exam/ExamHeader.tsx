
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { ExamDescription, Section } from "@/types/exam";
import { useExamHeaderData } from "@/hooks/useExamHeaderData";
import PublishButton from "@/components/PublishButton";
import { useExamPageContext } from "@/context/ExamPageContext";

interface ExamHeaderProps { }

/**
 * Header component for the exam editor
 * Displays exam metadata and actions
 */
const ExamHeader: React.FC<ExamHeaderProps> = ({ }) => {
    const { state, actions, setters } = useExamPageContext();
    const { examData } = useExamHeaderData({ exam: state.currentExam });

    return (
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{examData.title}</h1>
                        <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" aria-hidden="true" />
                                <span>{examData.formattedDuration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                <span>Passing score: {examData.formattedPassingScore}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <PublishButton />
                </div>
            </div>
        </div>
    );
};

export default ExamHeader;
