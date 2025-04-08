
import React from "react";
import { ExamHeader, ExamMain } from "@/components/Exam";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";
import { useExamPage } from "@/hooks/useExamPage";

const Exam = () => {
    const {
        state: {
            sections,
            currentExam,
            showLanguageDialog,
            showQuestionDialog,
            selectedLanguage
        },
        actions: {
            addSection,
            deleteSection,
            updateSection,
            toggleSectionExpand,
            handleAddQuestion,
            handleLanguageSelected,
            handleQuestionAdded
        },
        setters: {
            setShowLanguageDialog,
            setShowQuestionDialog
        }
    } = useExamPage();

    if (!currentExam) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Exam Not Found</h2>
                    <p className="text-muted-foreground mb-6">The exam you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="bg-white shadow-sm sticky top-0 z-10 transition-all duration-300">
                <ExamHeader exam={currentExam} />
            </header>

            <ExamMain
                exam={currentExam}
                sections={sections}
                addSection={addSection}
                deleteSection={deleteSection}
                updateSection={updateSection}
                toggleSectionExpand={toggleSectionExpand}
                handleAddQuestion={handleAddQuestion}
            />

            <LanguageSelectionDialog
                open={showLanguageDialog}
                onOpenChange={setShowLanguageDialog}
                onLanguageSelect={handleLanguageSelected}
            />

            <QuestionDialog
                open={showQuestionDialog}
                onOpenChange={setShowQuestionDialog}
                onAddQuestion={handleQuestionAdded}
                language={selectedLanguage || "english"}
            />
        </div>
    );
};

export default Exam;
