
import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import LearningReport from './components/LearningReport';
import MistakeCollection from './components/MistakeCollection';
import UploadTestPaper from './components/UploadTestPaper';
import MobileMenu from './components/MobileMenu';
import { BotIcon } from './components/icons/BotIcon';

type ViewType = 'menu' | 'chat' | 'report' | 'mistakes' | 'upload';

const viewTitles: { [key in ViewType]: string } = {
  menu: '功能导航',
  chat: 'AI 辅导',
  report: '学习报告',
  mistakes: '错题本',
  upload: '上传试卷分析'
};

const App: React.FC = () => {
  // Default to 'menu' so mobile users see the function showcase first
  const [currentView, setCurrentView] = useState<ViewType>('menu');

  const handleBack = () => {
    setCurrentView('menu');
  };

  const handleNavigate = (view: 'chat' | 'report' | 'mistakes' | 'upload') => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'menu':
        return <MobileMenu onNavigate={handleNavigate} />;
      case 'chat':
        // Pass onBack to allow returning to menu on mobile
        return <ChatWindow onBack={handleBack} />;
      case 'report':
        return <LearningReport onBack={handleBack} />;
      case 'mistakes':
        return <MistakeCollection onBack={handleBack} />;
      case 'upload':
        return <UploadTestPaper onBack={handleBack} />;
      default:
        return <MobileMenu onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-blue-50/50">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('menu')}>
            <BotIcon className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              小桃子专用私教
            </h1>
          </div>
           <div className="text-lg font-semibold text-gray-600">
            {viewTitles[currentView]}
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto flex pt-6 px-4 md:px-6 space-x-6">
        <aside className="w-1/5 hidden md:block">
          <Sidebar currentView={currentView === 'menu' ? undefined : currentView} setCurrentView={(view) => setCurrentView(view as ViewType)} />
        </aside>
        
        <main className="flex-grow w-full md:w-4/5 pb-6">
          {renderContent()}
        </main>
      </div>

      <footer className="text-center p-4 text-gray-500 text-sm mt-6">
        <p>&copy; {new Date().getFullYear()} KidTutor. 小桃子版权所有。仅用于教育目的。</p>
      </footer>
    </div>
  );
};

export default App;
