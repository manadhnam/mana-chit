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

interface AgentPerformance {
  id: string;
  name: string;
  email: string;
  metrics: {
    customer_acquisition: number;
    transaction_volume: number;
    revenue: number;
    customer_satisfaction: number;
    attendance: number;
  };
  commissions: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  goals: {
    total: number;
    completed: number;
    atRisk: number;
  };
  status: 'active' | 'inactive';
  lastActive: string;
}

const AgentPerformanceOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchAgentPerformance = async () => {
      if (!user?.id) return;

      try {
        // Fetch agents in the branch
        const { data: agentsData, error: agentsError } = await supabase
          .from('users')
          .select('id, name, email, status, last_active')
          .eq('role', 'agent')
          .eq('branch_id', user.branch_id);

        if (agentsError) throw agentsError;

        // Fetch performance metrics for each agent
        const agentsWithMetrics = await Promise.all(
          agentsData.map(async (agent) => {
            const [metricsData, commissionsData, goalsData] = await Promise.all([
              supabase
                .from('agent_metrics')
                .select('*')
                .eq('agent_id', agent.id)
                .single(),
              supabase
                .from('agent_commissions')
                .select('*')
                .eq('agent_id', agent.id),
              supabase
                .from('agent_goals')
                .select('*')
                .eq('agent_id', agent.id),
            ]);

            return {
              id: agent.id,
              name: agent.name,
              email: agent.email,
              metrics: metricsData.data || {
                customer_acquisition: 0,
                transaction_volume: 0,
                revenue: 0,
                customer_satisfaction: 0,
                attendance: 0,
              },
              commissions: {
                total: commissionsData.data?.reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0) || 0,
                thisMonth: commissionsData.data
                  ?.filter((c) => new Date(c.date).getMonth() === new Date().getMonth())
                  .reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0) || 0,
                pending: commissionsData.data?.reduce((sum, c) => sum + (c.status === 'pending' ? c.amount : 0), 0) || 0,
              },
              goals: {
                total: goalsData.data?.length || 0,
                completed: goalsData.data?.filter((g) => g.status === 'completed').length || 0,
                atRisk: goalsData.data?.filter((g) => g.status === 'at_risk').length || 0,
              },
              status: agent.status,
              lastActive: agent.last_active,
            };
          })
        );

        setAgents(agentsWithMetrics);
      } catch (error) {
        console.error('Error fetching agent performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentPerformance();
  }, [user?.id, timeRange]);

  const filteredAgents = agents
    .filter((agent) => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.metrics.revenue - a.metrics.revenue;
        case 'customers':
          return b.metrics.customer_acquisition - a.metrics.customer_acquisition;
        case 'satisfaction':
          return b.metrics.customer_satisfaction - a.metrics.customer_satisfaction;
        case 'attendance':
          return b.metrics.attendance - a.metrics.attendance;
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Performance Overview</h1>
        <p className="text-gray-600">Monitor and manage your agents' performance metrics</p>
      </div>

      {/* Filters and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search agents..."
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
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="satisfaction">Satisfaction</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{agents.reduce((sum, agent) => sum + agent.metrics.revenue, 0).toLocaleString()}
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
              {agents.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((agents.filter(a => a.status === 'active').length / agents.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agents.reduce((sum, agent) => sum + agent.metrics.customer_satisfaction, 0) / agents.length).toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Based on customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{agents.reduce((sum, agent) => sum + agent.commissions.total, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₹{agents.reduce((sum, agent) => sum + agent.commissions.pending, 0).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-500">{agent.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      ₹{agent.metrics.revenue.toLocaleString()}
                      {getTrendIcon(agent.metrics.revenue, 100000)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {agent.metrics.customer_acquisition}
                      {getTrendIcon(agent.metrics.customer_acquisition, 20)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {agent.metrics.customer_satisfaction.toFixed(1)}/5
                      {getTrendIcon(agent.metrics.customer_satisfaction, 4.0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {agent.metrics.attendance}%
                      {getTrendIcon(agent.metrics.attendance, 90)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-green-600">{agent.goals.completed}</span>
                      {' / '}
                      <span className="text-yellow-600">{agent.goals.atRisk}</span>
                      {' / '}
                      <span>{agent.goals.total}</span>
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

export default AgentPerformanceOverview; 