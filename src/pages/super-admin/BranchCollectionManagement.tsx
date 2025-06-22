import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CollectionList from '@/components/branch/CollectionList';
import { branchService } from '@/services/branchService';
import type { Collection } from '@/types/branch';

const BranchCollectionManagement: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (!branchId) return;
        const data = await branchService.getBranchCollections(branchId);
        setCollections(data);
      } catch (err) {
        setError('Failed to fetch collection data');
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [branchId]);

  const handleEditCollection = (collection: Collection) => {
    // Implement edit collection functionality
    console.log('Edit collection:', collection);
  };

  const handleDeleteCollection = (collection: Collection) => {
    // Implement delete collection functionality
    console.log('Delete collection:', collection);
  };

  const handleViewDocuments = (collection: Collection) => {
    // Implement view documents functionality
    console.log('View documents for collection:', collection);
  };

  const handleViewCustomer = (collection: Collection) => {
    // Implement view customer functionality
    console.log('View customer for collection:', collection);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Branch Collection Management</h1>
        <CollectionList
          collections={collections}
          loading={loading}
          onEdit={handleEditCollection}
          onDelete={handleDeleteCollection}
          onViewDocuments={handleViewDocuments}
          onViewCustomer={handleViewCustomer}
        />
      </motion.div>
    </div>
  );
};

export default BranchCollectionManagement; 