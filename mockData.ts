import type { Mistake, ReportData } from './types';

export const mockMistakes: Mistake[] = [
  {
    id: '1',
    subject: '数学',
    question: '一个长方形花坛，长20米，宽15米。它的面积和周长分别是多少？',
    studentAnswer: '面积是300米，周长是70平方米。',
    correctAnswer: '面积是300平方米，周长是70米。',
    analysis: '同学，你算对了数值，非常棒！👍 但是单位弄反了哦。面积的单位是【平方米】，周长的单位是【米】。下次注意单位就好了！',
    date: '2024-05-20',
  },
  {
    id: '2',
    subject: '语文',
    question: '请填空：白日依山尽，黄河入海（  ）。',
    studentAnswer: '白日依山尽，黄河入海（去）。',
    correctAnswer: '白日依山尽，黄河入海（流）。',
    analysis: '这个字是“流”哦！“流”更能体现出黄河奔腾不息的气势。你已经很接近正确答案了，加油！💡',
    date: '2024-05-19',
  },
  {
    id: '3',
    subject: '英语',
    question: 'Fill in the blank: I ___ to the park yesterday.',
    studentAnswer: 'I go to the park yesterday.',
    correctAnswer: 'I went to the park yesterday.',
    analysis: 'Almost there! "yesterday" means this happened in the past, so we need the past tense of "go", which is "went". Good try! 💪',
    date: '2024-05-18',
  },
];

export const mockReportData: ReportData = {
  summary: {
    totalQuestions: 152,
    correctRate: 88,
    studyTime: 420,
  },
  mastery: [
    { knowledgePoint: '长方形面积计算', score: 95 },
    { knowledgePoint: '动词过去式', score: 80 },
    { knowledgePoint: '古诗词填空', score: 85 },
    { knowledgePoint: '小数加减法', score: 92 },
    { knowledgePoint: '阅读理解', score: 78 },
  ],
  strengths: [
    '长方形面积和周长计算掌握牢固，计算准确。',
    '小数加减法运算熟练，正确率高。',
    '能够理解基本的英语句子结构。',
  ],
  weaknesses: [
    '英语动词时态掌握不牢固，特别是过去式的变化。',
    '古诗词的个别字记忆不准确。',
    '对单位的理解和使用需要加强。',
  ],
  recommendations: [
    '建议多做一些英语时态专项练习题。',
    '每天朗读并背诵一首古诗，加深记忆。',
    '做数学题时，最后要检查一遍单位是否正确。',
  ],
};