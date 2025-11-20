import React from 'react';
import { BotIcon } from './icons/BotIcon';
import { ChartIcon } from './icons/ChartIcon';
import { BookIcon } from './icons/BookIcon';
import { UploadIcon } from './icons/UploadIcon';

type ViewType = 'chat' | 'report' | 'mistakes' | 'upload';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navItems = [
  { id: 'chat', icon: BotIcon, label: 'AI 辅导' },
  { id: 'report', icon: ChartIcon, label: '学习报告' },
  { id: 'mistakes', icon: BookIcon, label: '错题本' },
  { id: 'upload', icon: UploadIcon, label: '上传试卷' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 h-full">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`w-full flex items-center p-3 rounded-lg text-left text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mr-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
