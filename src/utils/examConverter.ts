import { ExamDescription, Option, Question, Section } from '@/types/exam';
import { useExamPageProps } from '@/hooks/useExamPage';

/* ---------------------------------------------
 * Interfaces for importing and exporting exam data
 * --------------------------------------------- */

export interface BaseExamData {
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
    language?: 'english' | 'arabic';
  }[];
  options: {
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export interface EditExamData extends BaseExamData {
  deletedSectionsIds?: string[];
  deletedQuestionsIds?: string[];
  deletedOptionsIds?: string[];
}

/* ---------------------------------------------
 * Mapping Utilities
 * --------------------------------------------- */

const mapQuestionOptions = (
  questionId: number,
  options: BaseExamData['options']
): Option[] => {
  return options
    .filter(option => option.question_id === questionId)
    .map(option => ({
      id: option.id.toString(),
      question_id: option.question_id.toString(),
      text: option.text,
      isCorrect: option.is_correct,
      isOptionEdited: false,
      isOptionNew: false,
    }));
};

const mapQuestion = (
  q: BaseExamData['questions'][0],
  options: Option[]
): Question => ({
  id: q.id.toString(),
  section_id: q.section_id.toString(),
  text: q.text,
  description: q.description,
  marks: q.marks,
  options,
  language: q.language ?? 'english',
  isQuestionEdited: false,
  isQuestionNew: false,
});

const mapSection = (
  section: BaseExamData['sections'][0],
  questions: Question[]
): Section => ({
  id: section.id.toString(),
  title: section.title,
  questions,
  isExpanded: true,
  isSectionEdited: false,
  isSectionNew: false,
});

/* ---------------------------------------------
 * Converters
 * --------------------------------------------- */

/**
 * Converts raw imported exam data into the internal app format
 */
export const convertImportedExamToAppFormat = (
  data: BaseExamData
): { exam: ExamDescription; sections: Section[] } => {
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

    const sectionKey = q.section_id.toString();
    if (!questionsBySection[sectionKey]) {
      questionsBySection[sectionKey] = [];
    }
    questionsBySection[sectionKey].push(question);
  });

  const sections: Section[] = data.sections.map(section =>
    mapSection(section, questionsBySection[section.id.toString()] || [])
  );

  return { exam, sections };
};

/**
 * Converts the app state to export format for creating new exams
 */
export const convertAppDataToExportFormat = (
  state: useExamPageProps['state']
): BaseExamData => {
  const result: BaseExamData = {
    exam_description: {
      title: state.currentExam.title,
      description: state.currentExam.description,
      duration: parseInt(state.currentExam.duration, 10),
      passing_score: parseInt(state.currentExam.passingScore, 10),
    },
    sections: [],
    questions: [],
    options: [],
  };

  state.sectionStates.sections.forEach(section => {
    result.sections.push({
      id: parseInt(section.id, 10),
      title: section.title,
    });

    section.questions.forEach(question => {
      result.questions.push({
        id: parseInt(question.id, 10),
        section_id: parseInt(section.id, 10),
        text: question.text,
        description: question.description,
        marks: question.marks,
        language: question.language,
      });

      question.options.forEach(option => {
        result.options.push({
          id: parseInt(option.id, 10),
          question_id: parseInt(question.id, 10),
          text: option.text,
          is_correct: option.isCorrect,
        });
      });
    });
  });

  return result;
};

/**
 * Converts the app state to export format including edits and deletions
 */
export const convertAppDataToExportEditFormat = (
  state: useExamPageProps['state']
): EditExamData => {
  const result: EditExamData = {
    exam_description: {
      title: state.currentExam.title,
      description: state.currentExam.description,
      duration: parseInt(state.currentExam.duration, 10),
      passing_score: parseInt(state.currentExam.passingScore, 10),
    },
    sections: [],
    questions: [],
    options: [],
    deletedSectionsIds: state.sectionStates.deletedSectionId,
    deletedQuestionsIds: state.questionStates.deletedQuestionId,
    deletedOptionsIds: state.optionStates.deletedOptionId,
  };

  state.sectionStates.sections.forEach(section => {
    if (section.isSectionEdited || section.isSectionNew) {
      result.sections.push({
        id: parseInt(section.id, 10),
        title: section.title,
      });
    }

    section.questions.forEach(question => {
      if (question.isQuestionEdited || question.isQuestionNew) {
        result.questions.push({
          id: parseInt(question.id, 10),
          section_id: parseInt(section.id, 10),
          text: question.text,
          description: question.description,
          marks: question.marks,
          language: question.language,
        });
      }

      question.options.forEach(option => {
        if (option.isOptionEdited || option.isOptionNew) {
          result.options.push({
            id: parseInt(option.id, 10),
            question_id: parseInt(question.id, 10),
            text: option.text,
            is_correct: option.isCorrect,
          });
        }
      });
    });
  });

  return result;
};

/**
 * Validates imported exam data for essential structure
 */
export const validateExamData = (data: any): boolean => {
  if (
    !data ||
    !data.exam_description ||
    !data.sections ||
    !data.questions ||
    !data.options
  ) {
    console.error('Missing required fields in the input data.');
    return false;
  }

  const { exam_description } = data;

  if (
    typeof exam_description.title !== 'string' ||
    typeof exam_description.duration !== 'number' ||
    typeof exam_description.passing_score !== 'number'
  ) {
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
