import React from 'react';
import type { Message as MessageType } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import AnnotatedImage from './AnnotatedImage';

interface MessageProps {
  message: MessageType;
}

const formatText = (text: string): string => {
  if (!text) return '';
  // Basic HTML escaping
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Markdown-like replacements
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded text-sm font-mono">$1</code>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
    .replace(/\n/g, '<br />');
    
  return html;
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  // Render AnnotatedImage component for AI messages with annotation data
  if (isAI && message.annotationData && message.imageUrl) {
    return (
      <div className="flex items-start gap-3 self-start w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 mt-1">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-grow min-w-0">
          <AnnotatedImage data={message.annotationData} imageUrl={message.imageUrl} />
        </div>
      </div>
    );
  }

  // Render regular messages
  const messageContainerClasses = `flex items-start gap-3 max-w-2xl ${
    isAI ? 'self-start' : 'self-end flex-row-reverse'
  }`;

  const bubbleClasses = `px-4 py-3 rounded-2xl shadow-sm flex flex-col ${
    isAI
      ? 'bg-gray-100 text-gray-800 rounded-tl-none'
      : 'bg-blue-500 text-white rounded-tr-none'
  }`;

  return (
    <div className={messageContainerClasses}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-blue-500' : 'bg-gray-300'}`}>
        {isAI ? <BotIcon className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-gray-700"/>}
      </div>
      <div className={bubbleClasses}>
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="User upload"
            className="rounded-lg mb-2 max-w-xs h-auto"
          />
        )}
        {message.text && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatText(message.text) }}></div>
        )}
      </div>
    </div>
  );
};

export default Message;