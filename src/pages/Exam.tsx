import { ExamHeader, ExamMain } from "@/components/Exam";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";

import { useExamPageContext } from "@/context/ExamPageContext";

/**
 * Exam page component for creating and editing exams
 * Handles state preservation, dialogs, and question/section operations
 */
const Exam: React.FC = () => {
    const { state, actions, setters } = useExamPageContext();

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
                <ExamHeader />
            </header>
            <ExamMain />
            <LanguageSelectionDialog />
            <QuestionDialog />



        </div>
    );
};

export default Exam;
