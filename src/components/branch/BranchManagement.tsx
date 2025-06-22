import { useEffect, useState } from 'react';
import { useBranchStore } from '@/store/branchStore';
import toast from 'react-hot-toast';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import BranchForm from './BranchForm';
import { Branch } from '@/types/database';

const BranchManagement = () => {
  const { branches, fetchBranches, createBranch, updateBranch, deleteBranch, isLoading, error } = useBranchStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    if(error) {
        toast.error(error);
    }
  }, [error]);

  const handleOpenForm = (branch: Branch | null = null) => {
    setSelectedBranch(branch);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBranch(null);
  };

  const handleConfirmDelete = (id: string) => {
    setBranchToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (branchToDelete) {
      const promise = deleteBranch(branchToDelete);
      toast.promise(promise, {
        loading: 'Deleting branch...',
        success: 'Branch deleted successfully!',
        error: 'Failed to delete branch.',
      });
      setIsConfirmOpen(false);
      setBranchToDelete(null);
    }
  };

  const handleSubmit = async (formData: any) => {
    const promise = (selectedBranch
      ? updateBranch(selectedBranch.id, formData)
      : createBranch(formData)) as Promise<void | null>;

    toast.promise(promise, {
      loading: selectedBranch ? 'Updating branch...' : 'Creating branch...',
      success: `Branch ${selectedBranch ? 'updated' : 'created'} successfully!`,
      error: `Failed to ${selectedBranch ? 'update' : 'create'} branch.`,
    });

    promise.then((result) => {
        if (result) {
            handleCloseForm();
        }
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Branches</h2>
        <Button onClick={() => handleOpenForm()}>
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create Branch
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && branches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading branches...
                </TableCell>
              </TableRow>
            ) : (
              branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{branch.code}</TableCell>
                  <TableCell>
                    <Badge variant={branch.status === 'active' ? 'default' : 'destructive'}>
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{branch.manager_id || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(branch)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleConfirmDelete(branch.id)}>
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <BranchForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        branch={selectedBranch}
        isLoading={isLoading}
      />

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchManagement; 