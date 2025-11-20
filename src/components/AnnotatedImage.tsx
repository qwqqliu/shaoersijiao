import React, { useState, useRef, useEffect } from 'react';
import type { AnnotationData, Annotation } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoIcon } from './icons/InfoIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { QuoteIcon } from './icons/QuoteIcon';

interface AnnotatedImageProps {
  data: AnnotationData;
  imageUrl: string;
}

const getAnnotationBorderColor = (type: Annotation['type']) => {
    switch (type) {
        case 'correct': return 'border-green-500 ring-green-500';
        case 'incorrect': return 'border-red-500 ring-red-500';
        case 'info': return 'border-blue-500 ring-blue-500';
        default: return 'border-gray-500 ring-gray-500';
    }
};

const getAnnotationBgColor = (type: Annotation['type'], isActive: boolean) => {
    const opacity = isActive ? 'bg-opacity-30' : 'bg-opacity-10 hover:bg-opacity-20';
    switch (type) {
        case 'correct': return `bg-green-500 ${opacity}`;
        case 'incorrect': return `bg-red-500 ${opacity}`;
        case 'info': return `bg-blue-500 ${opacity}`;
        default: return `bg-gray-500 ${opacity}`;
    }
}

const formatComment = (text: string) => {
    if (!text) return { __html: '' };
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
        
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');
    return { __html: html };
};

const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ data, imageUrl }) => {
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(data.annotations[0] || null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    
    const handleLoad = () => {
      setImageLoaded(true);
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [imageUrl]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 w-full">
      <header className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">AI 试卷分析报告</h3>
        {data.overallScore && <p className="text-lg font-semibold text-blue-600">总分：{data.overallScore}</p>}
        <p className="text-gray-700 mt-2" dangerouslySetInnerHTML={formatComment(data.summary)}></p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative w-full select-none">
          <img ref={imageRef} src={imageUrl} alt="待分析的试卷" className="w-full h-auto rounded-md shadow-md" onLoad={() => setImageLoaded(true)} />
          {imageLoaded && imageRef.current && (
            <div className="absolute top-0 left-0 w-full h-full">
              {data.annotations.map((anno, index) => (
                <div
                  key={index}
                  className={`absolute border-2 rounded-md transition-all duration-200 cursor-pointer ${getAnnotationBorderColor(anno.type)} ${getAnnotationBgColor(anno.type, activeAnnotation === anno)} ${activeAnnotation === anno ? 'ring-2' : ''}`}
                  style={{
                    left: `${anno.box.x * 100}%`,
                    top: `${anno.box.y * 100}%`,
                    width: `${anno.box.width * 100}%`,
                    height: `${anno.box.height * 100}%`,
                  }}
                  onClick={() => setActiveAnnotation(anno === activeAnnotation ? null : anno)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <h4 className="font-bold text-lg mb-3 text-gray-800">批注详情:</h4>
          <div className="h-96 lg:h-[calc(100%-40px)] overflow-y-auto pr-2 space-y-3">
            {activeAnnotation ? (
                <div className="space-y-4">
                    {/* Recognized Text */}
                    {activeAnnotation.recognizedText && (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center text-gray-600 mb-2 font-semibold">
                        <QuoteIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        题目原文
                        </div>
                        <p className="text-gray-800 pl-7">{activeAnnotation.recognizedText}</p>
                    </div>
                    )}

                    {/* AI Comment */}
                    <div className={`p-4 rounded-lg border-l-4 ${getAnnotationBorderColor(activeAnnotation.type)} bg-white shadow-sm`}>
                        <div className="flex items-center font-semibold mb-2">
                            {activeAnnotation.type === 'correct' && <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />}
                            {activeAnnotation.type === 'incorrect' && <XCircleIcon className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />}
                            {activeAnnotation.type === 'info' && <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />}
                            <span className={
                                activeAnnotation.type === 'correct' ? 'text-green-700' :
                                activeAnnotation.type === 'incorrect' ? 'text-red-700' : 'text-blue-700'
                            }>
                                AI 老师点评
                            </span>
                        </div>
                        <div className="text-gray-800 pl-7" dangerouslySetInnerHTML={formatComment(activeAnnotation.comment)}></div>
                    </div>

                    {/* Common Mistakes */}
                    {activeAnnotation.commonMistakes && (
                    <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                        <div className="flex items-center text-yellow-800 mb-2 font-semibold">
                        <LightbulbIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        易错点提示
                        </div>
                        <p className="text-yellow-900 pl-7">{activeAnnotation.commonMistakes}</p>
                    </div>
                    )}
                </div>
            ) : (
                <div className="p-4 rounded-lg bg-gray-100 text-gray-500 text-center flex items-center justify-center h-full">
                    <p>点击图片上的高亮区域<br/>查看详细讲解。</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotatedImage;