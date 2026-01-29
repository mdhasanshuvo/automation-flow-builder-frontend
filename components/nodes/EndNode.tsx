'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function EndNode() {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-red-500 border-2 border-red-600 min-w-[120px]">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-red-600">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-white">End</div>
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-700" />
    </div>
  );
}

export default memo(EndNode);
