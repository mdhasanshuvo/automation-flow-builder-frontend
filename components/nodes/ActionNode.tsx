'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

function ActionNode({ data, id }: NodeProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [message, setMessage] = useState(data.message || '');

  const handleSave = () => {
    if (!message.trim()) {
      alert('Message cannot be empty');
      return;
    }

    // Dispatch event to update node data
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('updateNode', { 
        detail: { nodeId: id, data: { message: message.trim() } } 
      });
      window.dispatchEvent(event);
    }
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this Action node?')) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('deleteNode', { detail: { nodeId: id } });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <>
      <div className="px-4 py-3 shadow-lg rounded-md bg-blue-50 border-2 border-blue-400 min-w-[200px]">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-600" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="rounded-full w-10 h-10 flex justify-center items-center bg-blue-500">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-2 flex-1">
              <div className="text-sm font-bold text-gray-800">Send Email</div>
              <div className="text-xs text-gray-600 mt-1 break-words max-w-[180px]">
                {data.message ? data.message.substring(0, 50) + (data.message.length > 50 ? '...' : '') : 'No message set'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-600" />
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowEdit(false)}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Edit Action Node</h3>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                placeholder="Enter the email message to send...\n\nYou can write multiple lines here."
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500">This message will be sent when this node executes in the automation flow.</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-medium text-red-700 bg-white border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete Node
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ActionNode);
