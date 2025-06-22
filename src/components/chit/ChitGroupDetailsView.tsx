
import { CheckCircleIcon, ClockIcon, BanknotesIcon, UsersIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface Member {
  id: string;
  name: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface Auction {
  id: string;
  date: string;
  winner?: string;
  amount: number;
  status: 'completed' | 'upcoming';
}

interface ChitGroup {
  id: string;
  name: string;
  amount: number;
  duration: number;
  members: Member[];
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  auctions: Auction[];
  rules: string[];
}

const ChitGroupDetailsView: React.FC<{ group: ChitGroup }> = ({ group }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{group.name}</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <BanknotesIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" aria-hidden="true" />
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Chit Amount</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">₹{group.amount.toLocaleString()}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <ClockIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" aria-hidden="true" />
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{group.duration} months</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Members</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{group.members.length}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Start - End</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date(group.startDate).toLocaleDateString()} - {new Date(group.endDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
    {/* Timeline / Auctions */}
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auction Timeline</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Winner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {group.auctions.map((a, idx) => (
              <tr key={a.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
                  {new Date(a.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{a.winner || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{a.amount ? `₹${a.amount.toLocaleString()}` : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {a.status === 'completed' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Upcoming
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {/* Members */}
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {group.members.map((m, idx) => (
              <tr key={m.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-primary-500" />
                  {m.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(m.joinedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {m.status === 'active' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-400">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {/* Rules */}
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Rules</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200">
        {group.rules.map((rule, idx) => (
          <li key={idx} className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 mr-2 text-primary-500 mt-0.5" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ChitGroupDetailsView; 