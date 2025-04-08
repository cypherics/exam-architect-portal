
import { useState, useCallback } from "react";
import { ExamDescription, Section } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";
import { convertImportedExamToAppFormat, validateExamData } from "@/utils/examConverter";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";
import { useWindowEvents } from "./use-window-events";

export const useExamManager = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    // Use localStorage for saved exams and window closed state
    const [savedExams, setSavedExams] = useLocalStorage<ExamDescription[]>("savedExams", []);
    const [windowWasClosed, setWindowWasClosed] = useLocalStorage<boolean>("windowWasClosed", false);

    // Regular state for current exam session
    const [sections, setSections] = useState<Section[]>([
        {
            id: `${Math.floor(1000 + Math.random() * 9000)}`,
            title: "Section 1",
            questions: [],
            isExpanded: true,
        },
    ]);
    const [importError, setImportError] = useState<string | null>(null);
    const [examDetails, setExamDetails] = useState<ExamDescription>({
        id: "",
        title: "",
        description: "",
        duration: "",
        passingScore: "",
    });

    // Handle window unload events
    useWindowEvents({
        onBeforeUnload: () => {
            console.log("Window is closing, setting window closed flag");
            setWindowWasClosed(true);
        }
    });

    // Check if window was previously closed
    const checkWindowClosedState = useCallback(() => {
        console.log("Window was previously closed:", windowWasClosed);
        if (windowWasClosed) {
            console.log("Window was closed and reopened - showing landing page and clearing state");
            // No need to do anything special here - we'll use this flag
            // in the Index component to determine what to display
            return true;
        }
        return false;
    }, [windowWasClosed]);

    const createExam = (newExam: ExamDescription) => {
        try {
            if (!newExam.title || !newExam.description || !newExam.duration || !newExam.passingScore) {
                toast({
                    title: "Missing Fields",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }

            const exam: ExamDescription = {
                id: `${Math.floor(1000 + Math.random() * 9000)}`,
                title: newExam.title,
                description: newExam.description,
                duration: newExam.duration,
                passingScore: newExam.passingScore,
            };

            setSavedExams((prev) => [...prev, exam]);
            setExamDetails(exam);
            setSections([
                {
                    id: `${Math.floor(1000 + Math.random() * 9000)}`,
                    title: "Section 1",
                    questions: [],
                    isExpanded: true,
                },
            ]);

            toast({
                title: "Exam Created",
                description: "Your exam has been created successfully.",
            });

            navigate(`/exam/${exam.id}`, { state: { examDetails: exam, sections: sections } });
        } catch (error) {
            console.error("Error creating exam:", error);
            toast({
                title: "Error",
                description: "Failed to create exam. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleExamUpdate = (updatedExam: ExamDescription) => {
        try {
            setSavedExams((prev) =>
                prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
            );
            if (examDetails?.id === updatedExam.id) {
                setExamDetails(updatedExam);
            }
        } catch (error) {
            console.error("Error updating exam:", error);
            toast({
                title: "Error",
                description: "Failed to update exam. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target?.result as string);
                if (!validateExamData(jsonData)) {
                    setImportError("Invalid exam format. Please check your JSON file structure.");
                    toast({
                        title: "Invalid Format",
                        description: "The imported JSON file has an invalid format.",
                        variant: "destructive",
                    });
                    return;
                }

                const { exam: importedExam, sections: importedSections } =
                    convertImportedExamToAppFormat(jsonData);

                if (!savedExams.some((exam) => exam.title === importedExam.title)) {
                    setSavedExams((prev) => [...prev, importedExam]);
                }

                setExamDetails(importedExam);
                setSections(importedSections);

                navigate(`/exam/${importedExam.id}`, { state: { examDetails: importedExam, sections: importedSections } });
                toast({
                    title: "Exam Imported",
                    description: `Successfully imported ${importedExam.title}`,
                });
            } catch (error) {
                console.error("Error importing exam:", error);
                setImportError("Failed to parse the JSON file. Please check the file format.");
                toast({
                    title: "Import Error",
                    description: "Failed to parse the JSON file. Please check the format.",
                    variant: "destructive",
                });
            }
        };
        reader.readAsText(file);
    };

    return {
        state: {
            savedExams,
            examDetails,
            sections,
            importError,
            windowWasClosed,
        },
        setters: {
            setExamDetails,
            setSections,
            setImportError,
            setWindowWasClosed,
        },
        actions: {
            createExam,
            handleExamUpdate,
            handleFileChange,
            checkWindowClosedState,
        },
    };
};
