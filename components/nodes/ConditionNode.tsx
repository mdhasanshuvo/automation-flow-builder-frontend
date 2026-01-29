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

    // Dispatch event to update node data
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('updateNode', { 
        detail: { nodeId: id, data: { rules, operator } } 
      });
      window.dispatchEvent(event);
    }
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this Condition node?')) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('deleteNode', { detail: { nodeId: id } });
        window.dispatchEvent(event);
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowEdit(false)}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Edit Condition Node</h3>
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
            <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
              {/* Rules Operator */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rules Operator
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                    <input
                      type="radio"
                      value="AND"
                      checked={operator === 'AND'}
                      onChange={(e) => setOperator(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Match ALL rules (AND)</span>
                  </label>
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                    <input
                      type="radio"
                      value="OR"
                      checked={operator === 'OR'}
                      onChange={(e) => setOperator(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Match ANY rule (OR)</span>
                  </label>
                </div>
              </div>

              {/* Rules List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Rules
                  </label>
                  <button
                    onClick={addRule}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    + Add Rule
                  </button>
                </div>

                {rules.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>No rules added yet.</p>
                    <p className="mt-1">Click "Add Rule" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rules.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <select
                          value={rule.field}
                          onChange={(e) => updateRule(index, 'field', e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="email">Email</option>
                        </select>

                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(index, 'operator', e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                          onMouseDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Enter value..."
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />

                        <button
                          onClick={() => removeRule(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove rule"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="font-semibold text-blue-900 mb-1">How it works:</p>
                <p>The condition evaluates the recipient email against your rules. If the condition is TRUE, the flow follows the <span className="font-semibold text-green-600">green TRUE path</span>. Otherwise, it follows the <span className="font-semibold text-red-600">red FALSE path</span>.</p>
              </div>
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

export default memo(ConditionNode);
