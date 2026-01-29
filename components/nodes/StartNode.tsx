'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function StartNode() {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-green-500 border-2 border-green-600 min-w-[120px]">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-green-600">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-white">Start</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-700" />
    </div>
  );
}

export default memo(StartNode);
