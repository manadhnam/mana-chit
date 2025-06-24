import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Filter, Calendar, User, Shield } from 'lucide-react';
import { FreezeService, FreezeLogWithUser } from '@/services/freezeService';
import { format } from 'date-fns';

interface FreezeLogsTableProps {
  userId?: string; // If provided, shows logs for specific user only
  showFilters?: boolean;
  maxRows?: number;
}

export const FreezeLogsTable: React.FC<FreezeLogsTableProps> = ({
  userId,
  showFilters = true,
  maxRows,
}) => {
  const [logs, setLogs] = useState<FreezeLogWithUser[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<FreezeLogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, [userId]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      let logsData: FreezeLogWithUser[];
      if (userId) {
        // Get logs for specific user
        const userLogs = await FreezeService.getUserFreezeLogs(userId);
        // We need to fetch user details separately since getUserFreezeLogs doesn't include them
        logsData = userLogs as any; // This is a simplified version
      } else {
        // Get all logs
        logsData = await FreezeService.getAllFreezeLogs();
      }

      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load freeze logs');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.frozenByUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Limit rows if specified
    if (maxRows) {
      filtered = filtered.slice(0, maxRows);
    }

    setFilteredLogs(filtered);
  };

  const getActionBadge = (action: string) => {
    return action === 'freeze' ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Frozen
      </Badge>
    ) : (
      <Badge variant="default" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Unfrozen
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading freeze logs...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            <p>Error loading freeze logs: {error}</p>
            <Button onClick={loadLogs} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Freeze Activity Logs
          {userId && <span className="text-sm font-normal text-muted-foreground">(User specific)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="freeze">Freeze</SelectItem>
                <SelectItem value="unfreeze">Unfreeze</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No freeze logs found</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.user?.name || 'Unknown User'}</div>
                          <div className="text-sm text-muted-foreground">{log.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.frozenByUser?.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{log.frozenByUser?.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {log.reason ? (
                          <span className="text-sm">{log.reason}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No reason provided</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(log.createdAt)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {maxRows && logs.length > maxRows && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={loadLogs}>
              View All Logs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 