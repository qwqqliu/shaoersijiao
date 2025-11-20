
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { Message as MessageType, AnnotationData } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import LoadingSpinner from './LoadingSpinner';
import LiveVoiceModal from './LiveVoiceModal';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const imageFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

interface ChatWindowProps {
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: crypto.randomUUID(),
      text: "你好！👋 我是你的 AI 私教 Kid。今天想学习些什么呢？你可以问我任何问题，或者给我看看你的作业哦！",
      sender: 'ai',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string, image?: File) => {
    if ((!text.trim() && !image) || isLoading) return;
    
    let imageUrlForRender: string | undefined = undefined;
    if (image) {
        imageUrlForRender = await imageFileToDataUrl(image);
    }

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      imageUrl: imageUrlForRender,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("聊天会话尚未初始化。");
      }
      
      let response;
      if (image) {
        const imagePart = await fileToGenerativePart(image);
        const promptParts = [
          { text: text || "请帮我分析这张试卷图片，并根据你的系统指令返回JSON。" },
          imagePart
        ];
        response = await chatRef.current.sendMessage({ message: promptParts });
      } else {
        response = await chatRef.current.sendMessage({ message: text });
      }
      
      const responseText = response.text;
      let annotationData: AnnotationData | undefined = undefined;

      if (image) {
          try {
              // Extract JSON from the response, even if it's wrapped in markdown
              const jsonMatch = responseText.match(/\{[\s\S]*\}/);
              const cleanedJsonString = jsonMatch ? jsonMatch[0] : responseText;
              const parsedJson = JSON.parse(cleanedJsonString);
              if (parsedJson.summary && Array.isArray(parsedJson.annotations)) {
                  annotationData = parsedJson;
              }
          } catch (e) {
              console.warn("AI response was not a valid Annotation JSON.", e);
          }
      }

      const aiMessage: MessageType = {
        id: crypto.randomUUID(),
        text: annotationData ? annotationData.summary : responseText,
        sender: 'ai',
        imageUrl: annotationData ? imageUrlForRender : undefined,
        annotationData: annotationData,
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("发送消息到 Gemini API 时出错:", error);
      const errorMessage: MessageType = {
        id: crypto.randomUUID(),
        text: "哎呀！好像出了一点小问题。请稍后再试一次吧。🤖",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
      {/* Mobile Header with Back Button */}
      {onBack && (
        <div className="bg-white border-b border-gray-100 p-3 flex items-center md:hidden sticky top-0 z-10">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span className="font-medium text-sm">返回功能导航</span>
          </button>
        </div>
      )}

      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {isLoading && <LoadingSpinner />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onStartVoice={toggleVoiceMode}
      />
      {isVoiceMode && <LiveVoiceModal onClose={() => setIsVoiceMode(false)} />}
    </div>
  );
};

export default ChatWindow;
