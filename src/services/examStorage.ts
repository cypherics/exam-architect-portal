
import { ExamDescription, Section, ExamSessionState } from "@/types/exam";

/**
 * Service for managing exam data persistence in localStorage
 */
class ExamStorageService {
  private readonly EXAMS_KEY = 'savedExams';
  private readonly WINDOW_CLOSED_KEY = 'windowWasClosed';
  
  /**
   * Saves an exam's session state
   * @param examId - The ID of the exam
   * @param examDetails - The exam details
   * @param sections - The exam sections
   */
  saveExamSession(examId: string, examDetails: ExamDescription, sections: Section[]): void {
    const sessionState: ExamSessionState = {
      examDetails,
      sections,
      lastEdited: new Date().toISOString()
    };
    
    localStorage.setItem(`examSession_${examId}`, JSON.stringify(sessionState));
  }
  
  /**
   * Retrieves an exam's session state
   * @param examId - The ID of the exam
   * @returns The exam session state or null if not found
   */
  getExamSession(examId: string): ExamSessionState | null {
    const sessionData = localStorage.getItem(`examSession_${examId}`);
    if (!sessionData) return null;
    
    try {
      return JSON.parse(sessionData) as ExamSessionState;
    } catch (error) {
      console.error("Error parsing exam session:", error);
      return null;
    }
  }
  
  /**
   * Clears an exam's session state
   * @param examId - The ID of the exam
   */
  clearExamSession(examId: string): void {
    localStorage.removeItem(`examSession_${examId}`);
  }
  
  /**
   * Saves all exams
   * @param exams - The list of exams to save
   */
  saveExams(exams: ExamDescription[]): void {
    localStorage.setItem(this.EXAMS_KEY, JSON.stringify(exams));
  }
  
  /**
   * Retrieves all saved exams
   * @returns The list of saved exams or an empty array if none found
   */
  getExams(): ExamDescription[] {
    const examsData = localStorage.getItem(this.EXAMS_KEY);
    if (!examsData) return [];
    
    try {
      return JSON.parse(examsData) as ExamDescription[];
    } catch (error) {
      console.error("Error parsing saved exams:", error);
      return [];
    }
  }
  
  /**
   * Sets the window closed flag
   * @param closed - Whether the window was closed
   */
  setWindowClosed(closed: boolean): void {
    localStorage.setItem(this.WINDOW_CLOSED_KEY, JSON.stringify(closed));
  }
  
  /**
   * Checks if the window was previously closed
   * @returns Whether the window was previously closed
   */
  wasWindowClosed(): boolean {
    const closedData = localStorage.getItem(this.WINDOW_CLOSED_KEY);
    if (!closedData) return false;
    
    try {
      return JSON.parse(closedData) as boolean;
    } catch (error) {
      console.error("Error parsing window closed state:", error);
      return false;
    }
  }
}

// Export as a singleton
export const examStorage = new ExamStorageService();
