import { UserAnswer, CorrectAnswer, AnswerMarkingResult, RefineData, Records, UserInfo, BookData, ReadFileParams, SaveRecordResult } from '../types.tsx';

import api from '../api.tsx';
import { AxiosError } from 'axios';

//채점
export const MarkingWorkbook = (userAnswer: UserAnswer[], correctAnswer: CorrectAnswer[]): AnswerMarkingResult[] => {
  return correctAnswer.map((correct) => {
    const user = userAnswer.find(
      (ua) => ua.questionNumber === correct.questionNumber && ua.questionType === correct.questionType
    );

    let userAns = '';

    if(!user)
    {
      return {
        questionNumber: correct.questionNumber,
        isCorrect: false,
        userAnswer: '',
        correctAnswer: correct.answer,
      };
    }

    if(correct.questionType === '#주관식')
    {
      userAns = user.textAnswer?.trim() ?? '';
    }
    else if(correct.questionType === '#객관식')
    {
      userAns = user.choiceAnswer?.trim() ?? '';
    }

    return {
      questionNumber: correct.questionNumber,
      isCorrect: userAns === correct.answer,
      userAnswer: userAns,
      correctAnswer: correct.answer,
    };
  });
};
//시험기록 저장
export const saveExamResult = async (userInfo: UserInfo, examResult: SaveRecordResult[], correctCount: number, ExamBook: BookData) => {
  const aId = userInfo.hashedAcademyId;
  const uId = userInfo.hashedUserId;
  const resultData = {
    academy: aId,
    user: uId,
    workbook: ExamBook.workbookId,
    correctCount,
    submitDate: new Date().toISOString(),
    answer: examResult,
  };
  try
  {
    await api.post('/records/createrecord', resultData);
  }
  catch(error)
  {
    const axiosError = error as AxiosError;
    console.log(axiosError, 'iii');
  }
};
//책마다 회원개인의 시험기록 가져오기
export const loadExamRecord = async (refineData: RefineData): Promise<Records[] | null> => {
  try
  {
    const rawExamRecord = await api.post('/records/oneonerecord', {refineData});
    const examRecord: Records[] = rawExamRecord.data;

    return examRecord;
  }
  catch(error)
  {
    const axiosError = error as AxiosError;
    console.log(axiosError, 'iii');

    return null;
  }
};

//시험기록 json파일 읽기
export const readExamRecord = async (readFileParams: ReadFileParams): Promise<any | null> => {
  console.log('a', readFileParams);
  try
  {
    const response = await api.post('/records/readFile', { readFileParams });
    const data = await response.data;
    console.log('a');
    return data;
  }
  catch(error)
  {
    console.error('Error fetching result: ', error);

    return null;
  }
};
