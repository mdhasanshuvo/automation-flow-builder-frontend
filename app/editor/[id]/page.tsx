'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { getAutomationById, createAutomation, updateAutomation } from '@/lib/automationService';
import StartNode from '@/components/nodes/StartNode';
import EndNode from '@/components/nodes/EndNode';
import ActionNode from '@/components/nodes/ActionNode';
import DelayNode from '@/components/nodes/DelayNode';
import ConditionNode from '@/components/nodes/ConditionNode';
import Toolbar from '@/components/Toolbar';
import SaveDialog from '@/components/SaveDialog';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  delay: DelayNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Start' },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 250, y: 400 },
    data: { label: 'End' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-start-end',
    source: 'start-1',
    target: 'end-1',
  },
];

export default function FlowEditor() {
  const router = useRouter();
  const params = useParams();
  const automationId = params?.id as string;
  const isNewAutomation = automationId === 'new';

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [automationName, setAutomationName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load existing automation
  useEffect(() => {
    if (!isNewAutomation) {
      loadAutomation();
    }
  }, [automationId]);

  const loadAutomation = async () => {
    try {
      setLoading(true);
      const automation = await getAutomationById(automationId);
      setAutomationName(automation.name);
      setNodes(automation.flowData.nodes || initialNodes);
      setEdges(automation.flowData.edges || initialEdges);
    } catch (error) {
      console.error('Failed to load automation:', error);
      alert('Failed to load automation');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Add new node
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 150 },
      data: getDefaultNodeData(type),
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const getDefaultNodeData = (type: string) => {
    switch (type) {
      case 'action':
        return { message: '' };
      case 'delay':
        return { delayType: 'relative', delayValue: 5, delayUnit: 'minutes' };
      case 'condition':
        return { rules: [], operator: 'AND' };
      default:
        return {};
    }
  };

  // Update node data
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Delete node
  const deleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (nodeToDelete && (nodeToDelete.type === 'start' || nodeToDelete.type === 'end')) {
      alert('Cannot delete Start or End nodes');
      return;
    }

    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [nodes, setNodes, setEdges]);

  // Listen to custom events from nodes
  useEffect(() => {
    const handleUpdateNode = (e: any) => {
      updateNodeData(e.detail.nodeId, e.detail.data);
    };

    const handleDeleteNode = (e: any) => {
      deleteNode(e.detail.nodeId);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('updateNode', handleUpdateNode);
      window.addEventListener('deleteNode', handleDeleteNode);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('updateNode', handleUpdateNode);
        window.removeEventListener('deleteNode', handleDeleteNode);
      }
    };
  }, [updateNodeData, deleteNode]);

  // Save automation
  const handleSave = async (name: string) => {
    try {
      setLoading(true);

      const flowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        })),
      };

      if (isNewAutomation) {
        await createAutomation({ name, flowData });
        alert('Automation created successfully!');
      } else {
        await updateAutomation(automationId, { name, flowData });
        alert('Automation updated successfully!');
      }

      router.push('/');
    } catch (error: any) {
      console.error('Failed to save automation:', error);
      alert(error.response?.data?.message || 'Failed to save automation');
    } finally {
      setLoading(false);
      setShowSaveDialog(false);
    }
  };

  if (loading && !isNewAutomation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {isNewAutomation ? 'New Automation' : automationName || 'Edit Automation'}
          </h1>
        </div>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isNewAutomation ? 'Save' : 'Update'}
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar onAddNode={addNode} />

      {/* Flow Editor */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <SaveDialog
          initialName={automationName}
          onSave={handleSave}
          onClose={() => setShowSaveDialog(false)}
          isUpdate={!isNewAutomation}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onSave={() => setShowSaveDialog(true)} />
    </div>
  );
}
