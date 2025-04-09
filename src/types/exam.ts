
/**
 * Description of an exam including metadata
 */
export interface ExamDescription {
    id: string;
    title: string;
    description: string;
    duration: string;
    passingScore: string;
}

/**
 * A single option within a question
 */
export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

/**
 * Supported languages for questions
 */
export type QuestionLanguage = "english" | "arabic";

/**
 * A single exam question with options
 */
export interface Question {
    id: string;
    language: QuestionLanguage;
    text: string;
    description: string;
    options: Option[];
    marks: number;
}

/**
 * A section within an exam containing questions
 */
export interface Section {
    id: string;
    title: string;
    questions: Question[];
    isExpanded: boolean;
}

/**
 * Exam session state for persistence
 */
export interface ExamSessionState {
    examDetails: ExamDescription | null;
    sections: Section[];
    lastEdited: string; // ISO date string
}
