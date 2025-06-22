import { create } from 'zustand';
import { DOCUMENT_ENDPOINTS } from '@/api/endpoints';

export interface Document {
  id: string;
  userId: string;
  type: 'ID_PROOF' | 'ADDRESS_PROOF' | 'INCOME_PROOF' | 'BANK_STATEMENT' | 'OTHER';
  name: string;
  fileUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verifiedBy?: string;
  verifiedAt?: string;
  expiryDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserDocuments: (userId: string) => Promise<void>;
  uploadDocument: (file: File, type: Document['type']) => Promise<void>;
  verifyDocument: (documentId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => Promise<void>;
  getExpiringDocuments: () => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,

  fetchUserDocuments: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(DOCUMENT_ENDPOINTS.GET_USER_DOCUMENTS(userId));
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      set({ documents: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  uploadDocument: async (file: File, type: Document['type']) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(DOCUMENT_ENDPOINTS.UPLOAD_DOCUMENT, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload document');
      const newDocument = await response.json();
      set(state => ({
        documents: [...state.documents, newDocument],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  verifyDocument: async (documentId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(DOCUMENT_ENDPOINTS.VERIFY_DOCUMENT(documentId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      
      if (!response.ok) throw new Error('Failed to verify document');
      const updatedDocument = await response.json();
      set(state => ({
        documents: state.documents.map(d => 
          d.id === documentId ? updatedDocument : d
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getExpiringDocuments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(DOCUMENT_ENDPOINTS.GET_EXPIRING_DOCUMENTS);
      if (!response.ok) throw new Error('Failed to fetch expiring documents');
      const data = await response.json();
      set({ documents: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentDocument: (document: Document | null) => {
    set({ currentDocument: document });
  },

  clearError: () => {
    set({ error: null });
  },
})); 