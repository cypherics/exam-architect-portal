import { ExamDescription, Option, Section, Question } from '@/types/exam';
import { useExamPageContext } from "@/context/ExamPageContext";
import { useIsExamNew } from "@/context/IsExamNewContext";
import { useExamPageProps } from "@/hooks/useExamPage";

// Interfaces for raw input data and exportable format
interface RawExamData {
  exam_description: {
    title: string;
    description: string;
    duration: number;
    passing_score: number;
  };
  sections: { id: number; title: string }[];
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
  deletedSectionsIds?: string[];
  deletedQuestionsIds?: string[];
  deletedOptionsIds?: string[];
}

// Conversion functions
const mapQuestionOptions = (questionId: number, options: RawExamData['options']): Option[] => {
  return options
    .filter(option => option.question_id === questionId)
    .map(option => ({
      id: option.id.toString(),
      question_id: option.question_id.toString(),
      text: option.text,
      isCorrect: option.is_correct,
      isOptionEdited: false, // Default value
      isOptionNew: false,    // Default value
    }));
};

const mapQuestion = (q: RawExamData['questions'][0], options: Option[]): Question => {
  return {
    id: q.id.toString(),
    section_id: q.section_id.toString(),
    text: q.text,
    description: q.description,
    marks: q.marks,
    options,
    language: q.language || "english",
    isQuestionEdited: false, // Default value
    isQuestionNew: false,    // Default value
  };
};

const mapSection = (section: RawExamData['sections'][0], questions: Question[]): Section => {
  return {
    id: section.id.toString(),
    title: section.title,
    questions,
    isExpanded: true, // Default value
    isSectionEdited: false, // Default value
    isSectionNew: false,    // Default value
  };
};

// Main converter: Convert raw exam data to the app format
export const convertImportedExamToAppFormat = (data: RawExamData): { exam: ExamDescription; sections: Section[] } => {
  const exam: ExamDescription = {
    id: Date.now().toString(),
    title: data.exam_description.title,
    description: data.exam_description.description,
    duration: data.exam_description.duration.toString(),
    passingScore: data.exam_description.passing_score.toString(),
  };

  const questionsBySection: Record<string, Question[]> = {};

  data.questions.forEach(q => {
    const questionOptions = mapQuestionOptions(q.id, data.options);
    const question = mapQuestion(q, questionOptions);

    if (!questionsBySection[q.section_id]) {
      questionsBySection[q.section_id] = [];
    }
    questionsBySection[q.section_id].push(question);
  });

  const sections: Section[] = data.sections.map(s => mapSection(s, questionsBySection[s.id] || []));

  return { exam, sections };
};

// Main converter: Convert app data back to export format
export const convertAppDataToExportFormat = (exam: ExamDescription, sections: Section[]): RawExamData => {
  const exportData: RawExamData = {
    exam_description: {
      title: exam.title,
      description: exam.description,
      duration: parseInt(exam.duration),
      passing_score: parseInt(exam.passingScore),
    },
    sections: [],
    questions: [],
    options: [],
  };

  sections.forEach(section => {
    exportData.sections.push({
      id: parseInt(section.id),
      title: section.title,
    });

    section.questions.forEach(question => {
      exportData.questions.push({
        id: parseInt(question.id),
        section_id: parseInt(section.id),
        text: question.text,
        description: question.description,
        marks: question.marks,
        language: question.language,
      });

      question.options.forEach(option => {
        exportData.options.push({
          id: parseInt(option.id),
          question_id: parseInt(question.id),
          text: option.text,
          is_correct: option.isCorrect,
        });
      });
    });
  });

  return exportData;
};

// Main converter: Convert app data back to export format (for edits and deletes)
export const convertAppDataToExportEditFormat = (exam: ExamDescription, sections: Section[], state: useExamPageProps["state"]): RawExamData => {

  const exportData: RawExamData = {
    exam_description: {
      title: exam.title,
      description: exam.description,
      duration: parseInt(exam.duration),
      passing_score: parseInt(exam.passingScore),
    },
    sections: [],
    questions: [],
    options: [],
    deletedSectionsIds: state.sectionStates.deletedSectionId,
    deletedQuestionsIds: state.questionStates.deletedQuestionId,
    deletedOptionsIds: state.optionStates.deletedOptionId,
  };




  sections.forEach(section => {
    // Only include sections that have been edited
    if (section.isSectionEdited || section.isSectionNew) {
      exportData.sections.push({
        id: parseInt(section.id),
        title: section.title,
      });
    }
    section.questions.forEach(question => {
      // Only include questions that have been edited
      if (question.isQuestionEdited || question.isQuestionNew) {
        exportData.questions.push({
          id: parseInt(question.id),
          section_id: parseInt(section.id),
          text: question.text,
          description: question.description,
          marks: question.marks,
          language: question.language,
        });
      }
      question.options.forEach(option => {
        // Only include options that have been edited
        if (option.isOptionEdited || option.isOptionNew) {
          exportData.options.push({
            id: parseInt(option.id),
            question_id: parseInt(question.id),
            text: option.text,
            is_correct: option.isCorrect,
          });
        }
      });

    });

  });

  return exportData;
};


// Validate the exam data with better error reporting
export const validateExamData = (data: any): boolean => {
  if (!data || !data.exam_description || !data.sections || !data.questions || !data.options) {
    console.error('Missing required fields in the input data.');
    return false;
  }

  const examDesc = data.exam_description;
  if (!examDesc.title || typeof examDesc.duration !== 'number' || typeof examDesc.passing_score !== 'number') {
    console.error('Invalid exam description fields.');
    return false;
  }

  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    console.error('Sections array is invalid or empty.');
    return false;
  }

  if (!Array.isArray(data.questions)) {
    console.error('Questions array is invalid.');
    return false;
  }

  if (!Array.isArray(data.options)) {
    console.error('Options array is invalid.');
    return false;
  }

  return true;
};
