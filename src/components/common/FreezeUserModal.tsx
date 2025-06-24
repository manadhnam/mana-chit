import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { FreezeService } from '@/services/freezeService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FreezeUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  action: 'freeze' | 'unfreeze';
  onSuccess: () => void;
}

export const FreezeUserModal: React.FC<FreezeUserModalProps> = ({
  isOpen,
  onClose,
  user,
  action,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      if (action === 'freeze') {
        await FreezeService.freezeUser({
          userId: user.id,
          reason: reason.trim() || undefined,
        });
      } else {
        await FreezeService.unfreezeUser({
          userId: user.id,
          reason: reason.trim() || undefined,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const actionText = action === 'freeze' ? 'Freeze' : 'Unfreeze';
  const actionColor = action === 'freeze' ? 'destructive' : 'default';

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'freeze' ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {actionText} User Account
          </DialogTitle>
          <DialogDescription>
            {action === 'freeze' 
              ? `Are you sure you want to freeze ${user.name}'s account? This will prevent them from accessing the system.`
              : `Are you sure you want to unfreeze ${user.name}'s account? This will restore their access to the system.`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason ({action === 'freeze' ? 'required' : 'optional'})
            </Label>
            <Textarea
              id="reason"
              placeholder={`Enter reason for ${action}ing this account...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required={action === 'freeze'}
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                User account successfully {action}d!
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionColor as any}
              disabled={isLoading || (action === 'freeze' && !reason.trim())}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {actionText}ing...
                </>
              ) : (
                actionText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 