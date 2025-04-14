// src/services/examService.ts

import { convertAppDataToExportFormat, convertAppDataToExportEditFormat } from "@/utils/examConverter";
import { useExamPageProps } from "@/hooks/useExamPage";

export interface PublishExamData {
    state: useExamPageProps["state"];
    isExamNew: boolean;
}

const API_BASE_URL = "https://localhost";

/**
 * Sends a POST request to create a new exam.
 */
const createExam = async (state: useExamPageProps["state"]): Promise<boolean> => {
    const payload = convertAppDataToExportFormat(state);

    try {
        const response = await fetch(`${API_BASE_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`[CreateExam] Failed: ${response.status} ${response.statusText}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("[CreateExam] Error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
};

/**
 * Sends a PUT request to update an existing exam.
 */
const updateExam = async (state: useExamPageProps["state"]): Promise<boolean> => {
    const payload = convertAppDataToExportEditFormat(state);

    try {
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`[UpdateExam] Failed: ${response.status} ${response.statusText}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("[UpdateExam] Error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
};

/**
 * Publishes an exam by creating or updating based on `isExamNew`.
 */
export const publishExam = async ({ state, isExamNew }: PublishExamData): Promise<boolean> => {
    return isExamNew ? await createExam(state) : await updateExam(state);
};
