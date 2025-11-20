
import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface UploadTestPaperProps {
  onBack?: () => void;
}

const UploadTestPaper: React.FC<UploadTestPaperProps> = ({ onBack }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUpload = () => {
    if (!fileName) {
      alert('请先选择一个文件！');
      return;
    }
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert(`"${fileName}" 上传成功！AI 正在快马加鞭分析中...`);
      setFileName(null);
    }, 2000);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center relative">
      
      <div className="w-full flex justify-start mb-4 md:hidden">
        {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="返回"
            >
              <ArrowLeftIcon className="w-6 h-6" />
              <span className="ml-1 font-medium">返回功能导航</span>
            </button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-2 md:mt-0">上传试卷进行整体分析</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        将你的考试试卷或模拟试卷拍照或扫描后上传，AI 将会为你进行全面的分析，找出知识薄弱点，并提供个性化学习建议。
      </p>

      <div className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center transition-colors hover:border-blue-400">
        <UploadIcon className="w-16 h-16 text-gray-400 mb-4" />
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          选择文件
        </label>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
        <p className="mt-4 text-sm text-gray-500">
          {fileName ? `已选择: ${fileName}` : '支持 PNG, JPG, PDF 文件'}
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || !fileName}
        className="mt-8 w-full max-w-lg bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            分析中...
          </>
        ) : (
          '开始分析'
        )}
      </button>
    </div>
  );
};

export default UploadTestPaper;
