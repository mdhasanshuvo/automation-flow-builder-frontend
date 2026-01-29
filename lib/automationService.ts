import apiClient from './api';

export interface FlowData {
  nodes: any[];
  edges: any[];
}

export interface Automation {
  _id: string;
  name: string;
  flowData: FlowData;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationInput {
  name: string;
  flowData: FlowData;
}

// Get all automations
export const getAllAutomations = async (): Promise<Automation[]> => {
  const response = await apiClient.get('/automations');
  return response.data.data;
};

// Get automation by ID
export const getAutomationById = async (id: string): Promise<Automation> => {
  const response = await apiClient.get(`/automations/${id}`);
  return response.data.data;
};

// Create automation
export const createAutomation = async (data: AutomationInput): Promise<Automation> => {
  const response = await apiClient.post('/automations', data);
  return response.data.data;
};

// Update automation
export const updateAutomation = async (id: string, data: Partial<AutomationInput>): Promise<Automation> => {
  const response = await apiClient.put(`/automations/${id}`, data);
  return response.data.data;
};

// Delete automation
export const deleteAutomation = async (id: string): Promise<void> => {
  await apiClient.delete(`/automations/${id}`);
};

// Test run automation
export const testRunAutomation = async (id: string, email: string): Promise<any> => {
  const response = await apiClient.post(`/execute/${id}/test`, { email });
  return response.data;
};

// Get test run logs
export const getTestRunLogs = async (automationId: string): Promise<any[]> => {
  const response = await apiClient.get(`/execute/${automationId}/logs`);
  return response.data.data;
};
