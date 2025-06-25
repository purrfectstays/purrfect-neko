import React from 'react';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Success!</h2>
        <p>Thank you for joining our early access waitlist.</p>
      </div>
    </div>
  );
};

export default SuccessPage;