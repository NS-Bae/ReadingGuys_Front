export type Records =
{
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}
export type RefineData =
{
  userId: string;
  userName: string;
  academyId: string;
  workbookId: string;
}
export type BookData =
{
  Difficulty: string;
  storageLink: string;
  workbookId: string;
  workbookName: string;
}
export type UserInfo =
{
  AcademyID: string;
  id: string;
  ok: string;
  userName: string;
  UserType: string;
}
export type UserAnswer =
{
  questionType: '#주관식' | '#객관식';
  questionNumber: number;
  textAnswer?: string;
  choiceAnswer?: string;
}
export type CorrectAnswer =
{
  questionType: '#주관식' | '#객관식';
  questionNumber: number;
  answer: string;
}
export type AnswerMarkingResult = {
  questionNumber: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}
export type StackParamList = {
  Main: any;
  Login: undefined;
  Home: undefined;
  Record: { RecordList: Records[] };
  Exam: { ExamBook: BookData };
  Result: { ExamResult: AnswerMarkingResult[], ExamBook: BookData, fileNames: string[] };
}
export type ReadFileParams = {
  uid: string;
  aid: string;
  recordLink: string;
}
