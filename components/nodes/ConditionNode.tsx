'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface Rule {
  field: string;
  operator: string;
  value: string;
}

function ConditionNode({ data, id }: NodeProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [rules, setRules] = useState<Rule[]>(data.rules || []);
  const [operator, setOperator] = useState(data.operator || 'AND');

  const addRule = () => {
    setRules([...rules, { field: 'email', operator: 'equals', value: '' }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof Rule, value: string) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const handleSave = () => {
    if (rules.length === 0) {
      alert('Please add at least one rule');
      return;
    }

    for (const rule of rules) {
      if (!rule.value.trim()) {
        alert('All rules must have a value');
        return;
      }
    }

    const updateNode = (window as any).updateNodeData;
    if (updateNode) {
      updateNode(id, { rules, operator });
    }
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this Condition node?')) {
      const deleteNode = (window as any).deleteNodeData;
      if (deleteNode) {
        deleteNode(id);
      }
    }
  };

  const getConditionLabel = () => {
    if (!data.rules || data.rules.length === 0) {
      return 'No rules';
    }
    return `${data.rules.length} rule${data.rules.length > 1 ? 's' : ''} (${data.operator})`;
  };

  return (
    <>
      <div className="px-4 py-3 shadow-lg rounded-md bg-purple-50 border-2 border-purple-400 min-w-[200px]">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-600" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="rounded-full w-10 h-10 flex justify-center items-center bg-purple-500">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="ml-2 flex-1">
              <div className="text-sm font-bold text-gray-800">Condition</div>
              <div className="text-xs text-gray-600 mt-1">
                {getConditionLabel()}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="ml-2 p-1 text-purple-600 hover:bg-purple-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        {/* TRUE branch */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          style={{ left: '30%' }}
          className="w-3 h-3 bg-green-600"
        />
        <div className="absolute bottom-[-20px] left-[25%] text-xs font-semibold text-green-600">
          TRUE
        </div>

        {/* FALSE branch */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          style={{ left: '70%' }}
          className="w-3 h-3 bg-red-600"
        />
        <div className="absolute bottom-[-20px] right-[25%] text-xs font-semibold text-red-600">
          FALSE
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Condition Node</h3>
            </div>
            
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Rules Operator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rules Operator
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="AND"
                      checked={operator === 'AND'}
                      onChange={(e) => setOperator(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Match ALL rules (AND)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="OR"
                      checked={operator === 'OR'}
                      onChange={(e) => setOperator(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Match ANY rule (OR)</span>
                  </label>
                </div>
              </div>

              {/* Rules List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rules
                  </label>
                  <button
                    onClick={addRule}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Rule
                  </button>
                </div>

                {rules.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-md">
                    No rules added. Click "Add Rule" to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rules.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                        <select
                          value={rule.field}
                          onChange={(e) => updateRule(index, 'field', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="email">Email</option>
                        </select>

                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(index, 'operator', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">not equals</option>
                          <option value="includes">includes</option>
                          <option value="starts_with">starts with</option>
                          <option value="ends_with">ends with</option>
                        </select>

                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />

                        <button
                          onClick={() => removeRule(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                <strong>How it works:</strong> The condition evaluates the recipient email against your rules.
                If the condition is TRUE, the flow follows the green TRUE path. Otherwise, it follows the red FALSE path.
              </div>
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

export default memo(ConditionNode);
