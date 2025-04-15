interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}
interface BookData {
  Difficulty: string;
  storageLink: string;
  workbookIdL: string;
  workbookName: string;
}
export type StackParamList = {
  Main: any;
  Login: undefined;
  Home: undefined;
  Record: { RecordList: Records[] };
  Exam: { ExamBook: BookData };
};
