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
  academyId: string;
  workbookId: string;
}
export type BookData =
{
  Difficulty: string;
  workbookId: string;
  workbookName: string;
  storageLink?: string;
}
export type UserInfo =
{
  hashedAcademyId: string;
  hashedUserId: string;
  ok: string;
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
export type SaveRecordResult = AnswerMarkingResult &
{
  question: string;
}
export type StackParamList = {
  Main: any;
  Login: undefined;
  Home: undefined;
  Record: { RecordList: Records[], bookInfo: BookData };
  Exam: { ExamBook: BookData };
  Result: { ExamResult: AnswerMarkingResult[], ExamBook: BookData, fileNames: string[] };
}
export type ReadFileParams = {
  uid: string;
  aid: string;
  recordLink: string;
}
