
import React from 'react';
import { BotIcon } from './icons/BotIcon';
import { ChartIcon } from './icons/ChartIcon';
import { BookIcon } from './icons/BookIcon';
import { UploadIcon } from './icons/UploadIcon';

interface MobileMenuProps {
  onNavigate: (view: 'chat' | 'report' | 'mistakes' | 'upload') => void;
}

const menuItems = [
  { 
    id: 'chat', 
    label: 'AI 智能辅导', 
    description: '随时随地，有问必答',
    icon: BotIcon, 
    color: 'bg-blue-500',
    textColor: 'text-blue-500' 
  },
  { 
    id: 'report', 
    label: '学习报告', 
    description: '掌握进度，查漏补缺',
    icon: ChartIcon, 
    color: 'bg-green-500',
    textColor: 'text-green-500' 
  },
  { 
    id: 'mistakes', 
    label: '错题本', 
    description: '智能归纳，高效复习',
    icon: BookIcon, 
    color: 'bg-orange-500',
    textColor: 'text-orange-500' 
  },
  { 
    id: 'upload', 
    label: '上传试卷', 
    description: '拍照上传，AI 分析',
    icon: UploadIcon, 
    color: 'bg-purple-500',
    textColor: 'text-purple-500' 
  },
] as const;

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center text-left hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
              <Icon className={`w-8 h-8 ${item.textColor}`} />
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MobileMenu;
