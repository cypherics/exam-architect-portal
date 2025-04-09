import React, { useState } from "react";

import { ExamHeader, ExamMain } from "@/components/Exam";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";
import { useExamPage } from "@/hooks/useExamPage";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

import NavigationDialog from "@/dialogs/NavigationDialog";

/**
 * Exam page component for creating and editing exams
 * Handles state preservation, dialogs, and question/section operations
 */
const Exam: React.FC = () => {
    const { state, actions, setters } = useExamPage();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // Callback that is triggered when the unsaved changes state is updated
    const handleUnsavedChanges = (hasChanges: boolean) => {
        setUnsavedChanges(hasChanges);
    };

    // Confirm leaving the page
    const handleConfirm = () => {
        setDialogOpen(false);
        // Perform cleanup or other operations as needed (e.g., saving data)
    };

    // Cancel leaving the page
    const handleCancel = () => {
        setDialogOpen(false);
    };

    if (!state.currentExam) {
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
                <ExamHeader exam={state.currentExam} sections={state.sections} />
            </header>

            <ExamMain
                exam={state.currentExam}
                sections={state.sections}
                addSection={actions.addSection}
                deleteSection={actions.deleteSection}
                updateSection={actions.updateSection}
                toggleSectionExpand={actions.toggleSectionExpand}
                handleAddQuestion={actions.handleAddQuestion}
            />

            <LanguageSelectionDialog open={state.showLanguageDialog} onOpenChange={setDialogOpen} onLanguageSelect={actions.handleLanguageSelected} />
            <QuestionDialog open={state.showQuestionDialog} onOpenChange={setDialogOpen} onAddQuestion={actions.handleQuestionAdded} language={state.selectedLanguage || "english"} />

            {/* <NavigationDialog open={dialogOpen} onConfirm={handleConfirm} onCancel={handleCancel} /> */}

        </div>
    );
};

export default Exam;
