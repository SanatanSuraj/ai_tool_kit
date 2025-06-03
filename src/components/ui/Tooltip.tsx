import React from 'react';

interface TooltipProps {
    content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div className={`absolute ${positionClasses[position]} hidden group-hover:block z-50`}>
        <div className="bg-gray-800 text-white text-sm rounded py-1 px-2 min-w-max">
          {content}
        </div>
      </div>
    </div>
  );
} 