'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

function DelayNode({ data, id }: NodeProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [delayType, setDelayType] = useState(data.delayType || 'relative');
  const [specificDateTime, setSpecificDateTime] = useState(data.specificDateTime || '');
  const [delayValue, setDelayValue] = useState(data.delayValue || 5);
  const [delayUnit, setDelayUnit] = useState(data.delayUnit || 'minutes');

  const handleSave = () => {
    if (delayType === 'specific') {
      if (!specificDateTime) {
        alert('Please select a date and time');
        return;
      }
      const selectedDate = new Date(specificDateTime);
      if (selectedDate < new Date()) {
        alert('Selected date/time cannot be in the past');
        return;
      }
    } else {
      if (!delayValue || delayValue <= 0) {
        alert('Please enter a valid delay value');
        return;
      }
    }

    const updateNode = (window as any).updateNodeData;
    if (updateNode) {
      updateNode(id, {
        delayType,
        specificDateTime,
        delayValue: parseInt(delayValue.toString()),
        delayUnit,
      });
    }
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this Delay node?')) {
      const deleteNode = (window as any).deleteNodeData;
      if (deleteNode) {
        deleteNode(id);
      }
    }
  };

  const getDelayLabel = () => {
    if (data.delayType === 'specific' && data.specificDateTime) {
      return new Date(data.specificDateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (data.delayType === 'relative') {
      return `${data.delayValue} ${data.delayUnit}`;
    }
    return 'Not configured';
  };

  return (
    <>
      <div className="px-4 py-3 shadow-lg rounded-md bg-yellow-50 border-2 border-yellow-400 min-w-[200px]">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-600" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="rounded-full w-10 h-10 flex justify-center items-center bg-yellow-500">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2 flex-1">
              <div className="text-sm font-bold text-gray-800">Delay</div>
              <div className="text-xs text-gray-600 mt-1">
                {getDelayLabel()}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="ml-2 p-1 text-yellow-600 hover:bg-yellow-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-yellow-600" />
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Delay Node</h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              {/* Delay Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="relative"
                      checked={delayType === 'relative'}
                      onChange={(e) => setDelayType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Relative Delay</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="specific"
                      checked={delayType === 'specific'}
                      onChange={(e) => setDelayType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Specific Date & Time</span>
                  </label>
                </div>
              </div>

              {/* Relative Delay */}
              {delayType === 'relative' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={delayValue}
                      onChange={(e) => setDelayValue(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={delayUnit}
                      onChange={(e) => setDelayUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Specific DateTime */}
              {delayType === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={specificDateTime}
                    onChange={(e) => setSpecificDateTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
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

export default memo(DelayNode);
