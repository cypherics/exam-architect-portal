import { useState } from "react";
import { ExamDescription, Section } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";
import { convertImportedExamToAppFormat, validateExamData } from "@/utils/examConverter";
import { useNavigate } from "react-router-dom";

export const useExamManager = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [savedExams, setSavedExams] = useState<ExamDescription[]>([]);
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

    const createExam = (newExam: ExamDescription) => {
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

        navigate(`/exam/${exam.id}`, { state: { examDetails, sections } });
    };

    const handleExamUpdate = (updatedExam: ExamDescription) => {
        setSavedExams((prev) =>
            prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
        );
        if (examDetails?.id === updatedExam.id) {
            setExamDetails(updatedExam);
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
                    return;
                }

                const { exam: importedExam, sections: importedSections } =
                    convertImportedExamToAppFormat(jsonData);

                if (!savedExams.some((exam) => exam.title === importedExam.title)) {
                    setSavedExams((prev) => [...prev, importedExam]);
                }

                setExamDetails(importedExam);
                setSections(importedSections);

                toast({
                    title: "Exam Imported",
                    description: `Successfully imported ${importedExam.title}`,
                });
            } catch (error) {
                setImportError("Failed to parse the JSON file. Please check the file format.");
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
        },
        setters: {
            setExamDetails,
            setSections,
            setImportError,
        },
        actions: {
            createExam,
            handleExamUpdate,
            handleFileChange,
        },
    };
};
