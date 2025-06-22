import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';

interface Account {
  id: string;
  name: string;
  number: string;
  status: 'Frozen' | 'Active';
  reason: string;
  date: string;
}

const initialAccounts: Account[] = [
  { id: '1', name: 'John Doe', number: '1234567890', status: 'Frozen', reason: 'Suspicious Activity', date: '2024-06-01' },
  { id: '2', name: 'Jane Smith', number: '9876543210', status: 'Frozen', reason: 'KYC Pending', date: '2024-06-03' },
  { id: '3', name: 'Alice Johnson', number: '1122334455', status: 'Frozen', reason: 'Fraud Alert', date: '2024-06-05' },
];

const FreezeAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [newAccount, setNewAccount] = useState({ name: '', number: '', reason: '' });

  const handleToggleFreeze = (id: string) => {
    setAccounts(currentAccounts =>
      currentAccounts.map(acc => {
        if (acc.id === id) {
          const newStatus = acc.status === 'Frozen' ? 'Active' : 'Frozen';
          toast.success(`Account for ${acc.name} has been ${newStatus}.`);
          return { ...acc, status: newStatus };
        }
        return acc;
      })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFreezeNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.number || !newAccount.reason) {
      toast.error('Please fill out all fields to freeze an account.');
      return;
    }
    
    const newFrozenAccount: Account = {
      id: String(Date.now()),
      ...newAccount,
      status: 'Frozen',
      date: new Date().toISOString().split('T')[0]
    };

    setAccounts(prev => [newFrozenAccount, ...prev]);
    toast.success(`Account for ${newAccount.name} has been frozen.`);
    setNewAccount({ name: '', number: '', reason: '' });
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Freeze a New Account</CardTitle>
          <CardDescription>Enter account details to manually freeze an account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFreezeNewAccount} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input id="name" name="name" value={newAccount.name} onChange={handleInputChange} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Account Number</Label>
              <Input id="number" name="number" value={newAccount.number} onChange={handleInputChange} placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Freeze</Label>
              <Input id="reason" name="reason" value={newAccount.reason} onChange={handleInputChange} placeholder="e.g., Suspicious Activity" />
            </div>
            <Button type="submit">Freeze Account</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Frozen Accounts</CardTitle>
          <CardDescription>View and manage all accounts that are currently frozen or active.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((acc) => (
                <TableRow key={acc.id}>
                  <TableCell>{acc.name}</TableCell>
                  <TableCell>{acc.number}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        acc.status === 'Frozen' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {acc.status}
                      </span>
                  </TableCell>
                  <TableCell>{acc.reason}</TableCell>
                  <TableCell>{acc.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={acc.status === 'Frozen' ? 'default' : 'destructive'}
                      size="sm"
                      onClick={() => handleToggleFreeze(acc.id)}
                    >
                      {acc.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreezeAccounts; 