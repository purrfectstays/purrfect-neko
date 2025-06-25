import React from 'react';

const ChatbotSupport: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
        💬
      </div>
    </div>
  );
};

export default ChatbotSupport;