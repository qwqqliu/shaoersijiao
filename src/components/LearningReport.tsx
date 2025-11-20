
import React from 'react';
import { mockReportData } from '../mockData';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface LearningReportProps {
  onBack?: () => void;
}

const LearningReport: React.FC<LearningReportProps> = ({ onBack }) => {
  const { summary, mastery, strengths, weaknesses, recommendations } = mockReportData;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-4 md:hidden">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 mr-1" />
            <span className="font-medium">返回功能导航</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-500">总练习次数</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">{summary.totalQuestions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-500">平均正确率</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{summary.correctRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-500">总学习时长 (分钟)</h3>
          <p className="text-4xl font-bold text-orange-500 mt-2">{summary.studyTime}</p>
        </div>
      </div>

      {/* Mastery Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">知识点掌握度</h3>
        <div className="space-y-4">
          {mastery.map((item) => (
            <div key={item.knowledgePoint}>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-700">{item.knowledgePoint}</span>
                <span className="text-sm font-medium text-blue-600">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">👍 强项分析</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {strengths.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💪 薄弱环节</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {weaknesses.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>
       <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 学习建议</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {recommendations.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
    </div>
  );
};

export default LearningReport;
