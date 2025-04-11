import { Question, Section, ExamDescription } from "@/types/exam";

import { convertAppDataToExportFormat, convertAppDataToExportEditFormat } from "@/utils/examConverter";
import { useExamPageProps } from "@/hooks/useExamPage";

export interface PublishExamData {
    exam: ExamDescription;
    sections: Section[];
    state: useExamPageProps["state"];
    isExamNew: boolean;
}

export const publishExam = async (data: PublishExamData): Promise<boolean> => {
    const { exam, sections } = data;
    const exportData = data.isExamNew
        ? convertAppDataToExportFormat(exam, sections)
        : convertAppDataToExportEditFormat(exam, sections, data.state);

    try {
        const response = await fetch('https://localhost/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        return true; // Success
    } catch (error: unknown) {
        console.error('Error publishing exam:', error instanceof Error ? error.message : 'Unknown error');
        return false; // Failure
    }
};
