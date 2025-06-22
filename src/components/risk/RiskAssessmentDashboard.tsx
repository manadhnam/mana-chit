import { useEffect } from 'react';
import { useRiskStore } from '@/store/riskStore';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RiskAssessmentDashboardProps {
  userId: string;
}

const RiskAssessmentDashboard = ({ userId }: RiskAssessmentDashboardProps) => {
  const { assessments, currentAssessment, fetchRiskHistory, fetchRiskScore, isLoading, error } = useRiskStore();

  useEffect(() => {
    fetchRiskHistory(userId);
    fetchRiskScore(userId);
  }, [userId, fetchRiskHistory, fetchRiskScore]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="flex">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for risk score trend chart
  const riskScoreData = {
    labels: assessments.map(a => new Date(a.assessedAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Risk Score',
        data: assessments.map(a => a.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Prepare data for risk factors distribution
  const riskFactorsData = {
    labels: currentAssessment?.factors.map(f => f.name) || [],
    datasets: [
      {
        data: currentAssessment?.factors.map(f => f.value * f.weight) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(20, 184, 166)',
          'rgb(249, 115, 22)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Current Risk Assessment */}
      {currentAssessment && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Risk Score</p>
              <p className={`text-2xl font-bold ${
                currentAssessment.category === 'LOW' ? 'text-green-600' :
                currentAssessment.category === 'MEDIUM' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentAssessment.score}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category: {currentAssessment.category}
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Assessed By</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {currentAssessment.assessedBy}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(currentAssessment.assessedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(currentAssessment.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Score Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Risk Score Trend</h3>
        <div className="h-64">
          <Line
            data={riskScoreData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Risk Factors Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Risk Factors Distribution</h3>
        <div className="h-64">
          <Doughnut
            data={riskFactorsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                  },
                },
              },
              cutout: '70%',
            }}
          />
        </div>
      </div>

      {/* Recommendations */}
      {currentAssessment && currentAssessment.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {currentAssessment.recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start"
              >
                <span className="flex-shrink-0 h-5 w-5 text-primary-600">•</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentDashboard; 