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

    // Update node data through global context
    const updateNode = (window as any).updateNodeData;
    if (updateNode) {
      updateNode(id, { message: message.trim() });
    }
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this Action node?')) {
      const deleteNode = (window as any).deleteNodeData;
      if (deleteNode) {
        deleteNode(id);
      }
    }
  };

  // Make updateNodeData and deleteNodeData available globally for this node
  if (typeof window !== 'undefined') {
    (window as any).updateNodeData = (nodeId: string, newData: any) => {
      const event = new CustomEvent('updateNode', { detail: { nodeId, data: newData } });
      window.dispatchEvent(event);
    };
    (window as any).deleteNodeData = (nodeId: string) => {
      const event = new CustomEvent('deleteNode', { detail: { nodeId } });
      window.dispatchEvent(event);
    };
  }

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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Action Node</h3>
            </div>
            
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the email message to send..."
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-lg">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                Delete Node
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
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
