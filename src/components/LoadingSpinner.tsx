
import React from 'react';
import { BotIcon } from './icons/BotIcon';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-start gap-3 self-start max-w-xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
            <BotIcon className="w-5 h-5 text-white" />
        </div>
        <div className="px-4 py-3 rounded-2xl shadow-sm bg-gray-100 text-gray-800 rounded-tl-none flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
  );
};

export default LoadingSpinner;
