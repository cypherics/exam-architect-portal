
import React, { useEffect } from "react";
import { ExamHeader, ExamMain } from "@/components/Exam";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";
import { useExamPage } from "@/hooks/useExamPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Exam page component for creating and editing exams
 * Handles state preservation, dialogs, and question/section operations
 */
const Exam: React.FC = () => {
    const {
        state: {
            sections,
            currentExam,
            showLanguageDialog,
            showQuestionDialog,
            selectedLanguage,
            stateRestored
        },
        actions: {
            addSection,
            deleteSection,
            updateSection,
            toggleSectionExpand,
            handleAddQuestion,
            handleLanguageSelected,
            handleQuestionAdded,
            dismissStateRestoredNotification
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
            {stateRestored && (
                <Alert className="max-w-4xl mx-auto mt-4 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <AlertTitle className="text-blue-800">Session Restored</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Your previous unsaved work has been restored after the page was refreshed.
                    </AlertDescription>
                    <Button 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-6 w-6 p-0" 
                        onClick={dismissStateRestoredNotification}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}
            
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
