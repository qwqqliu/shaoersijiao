
import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { XIcon } from './icons/XIcon';
import { MicIcon } from './icons/MicIcon';

interface ChatInputProps {
  onSendMessage: (text: string, image?: File) => void;
  onStartVoice?: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onStartVoice, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || imageFile) && !isLoading) {
      onSendMessage(text, imageFile ?? undefined);
      setText('');
      handleRemoveImage();
    }
  };

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200">
      {imagePreviewUrl && (
        <div className="relative w-20 h-20 mb-2 p-1 border rounded-md bg-white">
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="移除图片"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          capture="environment"
        />
        <button
          type="button"
          onClick={handleAttachClick}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 text-gray-500 hover:text-blue-500 focus:outline-none disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="上传图片"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="问一个关于图片的问题，或输入你的问题..."
          className="flex-grow w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          disabled={isLoading}
        />

        {/* Voice Button */}
        {onStartVoice && (
             <button
             type="button"
             onClick={onStartVoice}
             disabled={isLoading}
             className="flex-shrink-0 w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
             aria-label="语音互动"
           >
             <MicIcon className="w-5 h-5" />
           </button>
        )}

        <button
          type="submit"
          disabled={isLoading || (!text.trim() && !imageFile)}
          className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="发送消息"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
