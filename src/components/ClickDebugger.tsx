import React, { useEffect, useState } from 'react';

const ClickDebugger: React.FC = () => {
  const [clickInfo, setClickInfo] = useState<string>('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const info = `
        Clicked: ${target.tagName}
        Class: ${target.className}
        ID: ${target.id || 'none'}
        Text: ${target.textContent?.substring(0, 50)}
        Z-Index: ${window.getComputedStyle(target).zIndex}
        Pointer Events: ${window.getComputedStyle(target).pointerEvents}
      `;
      console.log('Click Debug:', info);
      setClickInfo(info);
      
      // Find what's at this position
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      console.log('Elements at click position:', elements);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isActive]);

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg max-w-sm">
      <button
        onClick={() => setIsActive(!isActive)}
        className="bg-red-500 px-4 py-2 rounded mb-2 w-full"
      >
        {isActive ? 'Disable' : 'Enable'} Click Debugger
      </button>
      {isActive && clickInfo && (
        <pre className="text-xs whitespace-pre-wrap">{clickInfo}</pre>
      )}
    </div>
  );
};

export default ClickDebugger;