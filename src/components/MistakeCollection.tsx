
import React from 'react';
import { mockMistakes } from '../mockData';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface MistakeCollectionProps {
  onBack?: () => void;
}

const getSubjectColor = (subject: '数学' | '语文' | '英语') => {
  switch (subject) {
    case '数学': return 'bg-blue-100 text-blue-800';
    case '语文': return 'bg-green-100 text-green-800';
    case '英语': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MistakeCollection: React.FC<MistakeCollectionProps> = ({ onBack }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
           {onBack && (
              <button 
                onClick={onBack}
                className="mr-2 md:hidden text-gray-600 hover:text-blue-500 transition-colors flex items-center"
                aria-label="返回"
              >
                <ArrowLeftIcon className="w-6 h-6" />
                <span className="text-sm font-medium ml-1">返回</span>
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-800">我的错题本</h2>
        </div>
      </div>

      <div className="space-y-6">
        {mockMistakes.map((mistake) => (
          <div key={mistake.id} className="border border-gray-200 rounded-lg p-5 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSubjectColor(mistake.subject)}`}>
                {mistake.subject}
              </span>
              <span className="text-sm text-gray-500">{mistake.date}</span>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">题目：{mistake.question}</p>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <p className="font-semibold text-red-800">我的答案：</p>
                <p className="text-red-700">{mistake.studentAnswer}</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                 <p className="font-semibold text-green-800">正确答案：</p>
                 <p className="text-green-700">{mistake.correctAnswer}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-semibold text-gray-800">💡 AI 解析：</p>
                <p className="text-gray-600">{mistake.analysis}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MistakeCollection;
