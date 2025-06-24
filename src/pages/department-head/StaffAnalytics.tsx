import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChartBarIcon,
  BanknotesIcon,
  StarIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, UserWithCamelCase, hasDepartmentAccess } from '@/types/database';

interface AgentMetrics {
  id: string;
  agent_id: string;
  branch_id: string;
  revenue: number;
  customer_satisfaction: number;
  attendance: number;
  performance_score: number;
  period: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseBranchResponse {
  id: string;
  name: string;
  manager: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: string;
}

interface BranchPerformance {
  id: string;
  name: string;
  manager: {
    id: string;
    name: string;
    email: string;
  };
  metrics: {
    totalAgents: number;
    activeAgents: number;
    totalRevenue: number;
    averagePerformance: number;
  };
  agentMetrics: {
    topPerformers: number;
    atRisk: number;
    averageAttendance: number;
  };
  status: 'active' | 'inactive';
}

const StaffAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [branches, setBranches] = useState<BranchPerformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();

  const getTimeRangeDate = (range: string): string => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  useEffect(() => {
    const fetchBranchPerformance = async () => {
      if (!user || !hasDepartmentAccess(user)) return;

      try {
        // Fetch branches in the department
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select(`
            id,
            name,
            manager:users!branch_manager_id(id, name, email),
            status
          `)
          .eq('department_id', user.department_id);

        if (branchesError) throw branchesError;

        // Type assertion and filtering for valid branches with managers
        const validBranches = ((branchesData as unknown) as SupabaseBranchResponse[])
          ?.filter((branch): branch is SupabaseBranchResponse & { manager: NonNullable<SupabaseBranchResponse['manager']> } => 
            branch.manager !== null
          ) ?? [];

        // Fetch performance metrics for each branch
        const branchesWithMetrics = await Promise.all(
          validBranches.map(async (branch) => {
            const [agentsData, metricsData] = await Promise.all([
              supabase
                .from('users')
                .select('id, status')
                .eq('branch_id', branch.id)
                .eq('role', 'agent'),
              supabase
                .from('agent_metrics')
                .select('*')
                .eq('branch_id', branch.id)
                .gte('created_at', getTimeRangeDate(timeRange))
            ]);

            const agents = agentsData.data || [];
            const metrics = (metricsData.data || []) as AgentMetrics[];

            const performance: BranchPerformance = {
              id: branch.id,
              name: branch.name,
              manager: branch.manager,
              metrics: {
                totalAgents: agents.length,
                activeAgents: agents.filter(a => a.status === 'active').length,
                totalRevenue: metrics.reduce((sum, m) => sum + (m.revenue || 0), 0),
                averagePerformance: metrics.reduce((sum, m) => sum + (m.performance_score || 0), 0) / (metrics.length || 1),
              },
              agentMetrics: {
                topPerformers: metrics.filter(m => m.customer_satisfaction >= 4.5).length,
                atRisk: metrics.filter(m => m.customer_satisfaction < 3.0).length,
                averageAttendance: metrics.reduce((sum, m) => sum + (m.attendance || 0), 0) / (metrics.length || 1),
              },
              status: branch.status as 'active' | 'inactive',
            };

            return performance;
          })
        );

        setBranches(branchesWithMetrics);
      } catch (error) {
        console.error('Error fetching branch performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchPerformance();
  }, [user?.id, timeRange]);

  const filteredBranches = branches
    .filter((branch) => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.metrics.totalRevenue - a.metrics.totalRevenue;
        case 'agents':
          return b.metrics.totalAgents - a.metrics.totalAgents;
        case 'performance':
          return b.metrics.averagePerformance - a.metrics.averagePerformance;
        case 'attendance':
          return b.agentMetrics.averageAttendance - a.agentMetrics.averageAttendance;
        default:
          return 0;
      }
    });

  const getTrendIcon = (value: number, threshold: number) => {
    return value >= threshold ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Branch Performance Overview</h1>
        <p className="text-gray-600">Monitor and analyze branch and agent performance metrics</p>
      </div>

      {/* Filters and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search branches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="agents">Agents</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{branches.reduce((sum, branch) => sum + branch.metrics.totalRevenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20% from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.reduce((sum, branch) => sum + branch.metrics.activeAgents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((branches.reduce((sum, branch) => sum + branch.metrics.activeAgents, 0) / 
                branches.reduce((sum, branch) => sum + branch.metrics.totalAgents, 0)) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.reduce((sum, branch) => sum + branch.agentMetrics.topPerformers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Agents with 4.5+ rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.reduce((sum, branch) => sum + branch.agentMetrics.atRisk, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Agents below 3.0 rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div className="font-medium">{branch.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{branch.manager.name}</div>
                      <div className="text-sm text-gray-500">{branch.manager.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(branch.status)}>
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      ₹{branch.metrics.totalRevenue.toLocaleString()}
                      {getTrendIcon(branch.metrics.totalRevenue, 1000000)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {branch.metrics.activeAgents}/{branch.metrics.totalAgents}
                      {getTrendIcon(branch.metrics.activeAgents / branch.metrics.totalAgents, 0.9)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {branch.metrics.averagePerformance.toFixed(1)}/5
                      {getTrendIcon(branch.metrics.averagePerformance, 4.0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {branch.agentMetrics.averageAttendance.toFixed(1)}%
                      {getTrendIcon(branch.agentMetrics.averageAttendance, 90)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* TODO: Navigate to detailed view */}}
                    >
                      View Details
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

export default StaffAnalytics; 