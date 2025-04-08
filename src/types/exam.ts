export interface ExamDescription {
    id: string;
    title: string;
    description: string;
    duration: string;
    passingScore: string;
}

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    language: "english" | "arabic";
    text: string;
    description: string;
    options: Option[];
    marks: number;
}

export interface Section {
    id: string;
    title: string;
    questions: Question[];
    isExpanded: boolean;
}
