import { Section, Question } from '@/types/exam';

interface RawExamData {
  exam_description: {
    title: string;
    description: string;
    duration: number;
    passing_score: number;
  };
  sections: {
    id: number;
    title: string;
  }[];
  questions: {
    id: number;
    section_id: number;
    text: string;
    description: string;
    marks: number;
    language?: "english" | "arabic";
  }[];
  options: {
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export interface ExportableExam {
  exam_description: {
    title: string;
    description: string;
    duration: number;
    passing_score: number;
  };
  sections: {
    id: number;
    title: string;
  }[];
  questions: {
    id: number;
    section_id: number;
    text: string;
    description: string;
    marks: number;
    language: "english" | "arabic";
  }[];
  options: {
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export const convertImportedExamToAppFormat = (data: RawExamData): {
  exam: {
    id: string;
    title: string; 
    description: string;
    duration: string;
    passingScore: string;
  },
  sections: Section[]
} => {
  const exam = {
    id: Date.now().toString(),
    title: data.exam_description.title,
    description: data.exam_description.description,
    duration: data.exam_description.duration.toString(),
    passingScore: data.exam_description.passing_score.toString()
  };

  const questionsBySection: Record<number, Question[]> = {};
  
  data.questions.forEach(q => {
    if (!questionsBySection[q.section_id]) {
      questionsBySection[q.section_id] = [];
    }
    
    const questionOptions = data.options
      .filter(o => o.question_id === q.id)
      .map(o => ({
        id: o.id.toString(),
        text: o.text,
        isCorrect: o.is_correct
      }));
    
    questionsBySection[q.section_id].push({
      id: q.id.toString(),
      text: q.text,
      description: q.description,
      marks: q.marks,
      options: questionOptions,
      language: q.language || "english"
    });
  });
  
  const sections: Section[] = data.sections.map(s => ({
    id: s.id.toString(),
    title: s.title,
    questions: questionsBySection[s.id] || [],
    isExpanded: true
  }));
  
  return { exam, sections };
};

export const convertAppDataToExportFormat = (
  exam: {
    id: string;
    title: string; 
    description: string;
    duration: string;
    passingScore: string;
  },
  sections: Section[]
): ExportableExam => {
  const exportData: ExportableExam = {
    exam_description: {
      title: exam.title,
      description: exam.description,
      duration: parseInt(exam.duration),
      passing_score: parseInt(exam.passingScore)
    },
    sections: [],
    questions: [],
    options: []
  };
  
  sections.forEach(section => {
    const sectionId = parseInt(section.id);
    
    exportData.sections.push({
      id: sectionId,
      title: section.title
    });
    
    section.questions.forEach(question => {
      const questionId = parseInt(question.id);
      
      exportData.questions.push({
        id: questionId,
        section_id: sectionId,
        text: question.text,
        description: question.description,
        marks: question.marks,
        language: question.language
      });
      
      question.options.forEach(option => {
        exportData.options.push({
          id: parseInt(option.id),
          question_id: questionId,
          text: option.text,
          is_correct: option.isCorrect
        });
      });
    });
  });
  
  return exportData;
};

export const validateExamData = (data: any): boolean => {
  if (!data) return false;
  
  if (!data.exam_description || !data.sections || !data.questions || !data.options) {
    return false;
  }
  
  const examDesc = data.exam_description;
  if (!examDesc.title || typeof examDesc.duration !== 'number' || typeof examDesc.passing_score !== 'number') {
    return false;
  }
  
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return false;
  }
  
  if (!Array.isArray(data.questions)) {
    return false;
  }
  
  if (!Array.isArray(data.options)) {
    return false;
  }
  
  return true;
};
