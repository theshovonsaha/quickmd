// src/app/utils/storage.ts

export interface SavedDocument {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export const StorageKeys = {
    DOCUMENTS: 'md-viewer-documents',
    CURRENT_DOC: 'md-viewer-current-doc'
  };
  
  export const saveDocument = (title: string, content: string): SavedDocument => {
    const documents = getAllDocuments();
    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    documents.push(newDoc);
    localStorage.setItem(StorageKeys.DOCUMENTS, JSON.stringify(documents));
    return newDoc;
  };
  
  export const updateDocument = (id: string, title: string, content: string): SavedDocument | null => {
    const documents = getAllDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) return null;
    
    const updatedDoc: SavedDocument = {
      ...documents[index],
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    documents[index] = updatedDoc;
    localStorage.setItem(StorageKeys.DOCUMENTS, JSON.stringify(documents));
    return updatedDoc;
  };
  
  export const deleteDocument = (id: string): void => {
    const documents = getAllDocuments().filter(doc => doc.id !== id);
    localStorage.setItem(StorageKeys.DOCUMENTS, JSON.stringify(documents));
  };
  
  export const getAllDocuments = (): SavedDocument[] => {
    const docs = localStorage.getItem(StorageKeys.DOCUMENTS);
    return docs ? JSON.parse(docs) : [];
  };
  
  export const getDocument = (id: string): SavedDocument | null => {
    const documents = getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  };