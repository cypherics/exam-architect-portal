
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import SectionComponent from "./SectionComponent";
import { Section, ExamDescription } from "@/types/exam";
import { useExamMain } from "@/hooks/useExamMain";

interface ExamMainProps {
    exam: ExamDescription;
    sections: Section[];
    addSection?: () => void;
    updateSection?: (section: Section) => void;
    deleteSection?: (sectionId: string) => void;
    handleAddQuestion?: (sectionId: string) => void;
    toggleSectionExpand?: (sectionId: string) => void;
}

const ExamMain: React.FC<ExamMainProps> = ({
    exam,
    sections,
    addSection,
    updateSection,
    deleteSection,
    handleAddQuestion,
    toggleSectionExpand
}) => {
    const { computedValues } = useExamMain({ exam, sections, addSection });
    const { totalQuestions, sectionCount } = computedValues;

    return (
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white/50 backdrop-blur-sm border border-blue-100 rounded-xl p-6 mb-8 fade-in shadow-sm">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Exam Description</h2>
                <p className="text-muted-foreground">{exam.description}</p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Exam Sections</h2>
                    <p className="text-sm text-muted-foreground">
                        {sectionCount} section{sectionCount !== 1 ? 's' : ''} •
                        {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    onClick={addSection}
                    variant="outline"
                    className="flex items-center gap-2 btn-hover"
                >
                    <PlusCircle className="h-4 w-4" />
                    Add Section
                </Button>
            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <SectionComponent
                        key={section.id}
                        section={section}
                        onUpdate={updateSection}
                        onDelete={deleteSection}
                        onAddQuestion={() => handleAddQuestion(section.id)}
                        onToggleExpand={() => toggleSectionExpand(section.id)}
                    />
                ))}
            </div>

            {sections.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-muted rounded-xl">
                    <p className="text-muted-foreground mb-4">No sections added yet.</p>
                    <Button
                        onClick={addSection}
                        variant="outline"
                        className="flex items-center gap-2 mx-auto btn-hover"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add First Section
                    </Button>
                </div>
            )}
        </main>
    );
};

export default ExamMain;
