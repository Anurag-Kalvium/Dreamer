import { motion } from 'framer-motion';
import { FiBarChart2, FiCalendar, FiImage, FiClock, FiMoon } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const stats = {
  totalDreams: 24,
  dreamsThisMonth: 8,
  averagePerWeek: 2.5,
  mostCommonMood: 'Adventurous',
  averageSleepDuration: '7.2 hrs',
  lastDream: 'Flying over mountains',
  lastDreamDate: 'June 10, 2023',
};

// Chart data
const moodData = {
  labels: ['Happy', 'Sad', 'Adventurous', 'Scary', 'Neutral'],
  datasets: [
    {
      data: [12, 19, 8, 5, 3],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(192, 132, 252, 0.8)',
        'rgba(217, 70, 239, 0.8)',
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(192, 132, 252, 1)',
        'rgba(217, 70, 239, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const sleepData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Hours Slept',
      data: [7, 6.5, 7.5, 8, 7, 8.5, 9],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
};

const StatCard = ({ title, value, icon, color = 'indigo' }: { title: string; value: string | number; icon: React.ReactNode; color?: string }) => (
  <motion.div 
    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-${color}-500/30 transition-all duration-300`}
    whileHover={{ y: -4, boxShadow: `0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)` }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const DreamCard = () => (
  <motion.div 
    className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20 relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-300">Latest Dream</p>
          <h3 className="mt-1 text-xl font-bold text-white">{stats.lastDream}</h3>
          <div className="flex items-center mt-2 text-sm text-indigo-200">
            <FiCalendar className="mr-1.5 h-4 w-4" />
            <span>{stats.lastDreamDate}</span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-300">
          <FiMoon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-sm text-gray-300 line-clamp-3">
          I was flying over majestic mountains, feeling the cool breeze on my face as I soared through the clouds. The view was breathtaking with snow-capped peaks stretching as far as I could see.
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300">
            <span className="w-2 h-2 mr-1.5 rounded-full bg-indigo-400"></span>
            {stats.mostCommonMood}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300">
            <FiClock className="w-3 h-3 mr-1" />
            {stats.averageSleepDuration}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function DashboardCards() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Dreams" 
          value={stats.totalDreams} 
          icon={<FiMoon className="h-6 w-6" />} 
          color="indigo"
        />
        <StatCard 
          title="This Month" 
          value={stats.dreamsThisMonth} 
          icon={<FiCalendar className="h-6 w-6" />} 
          color="purple"
        />
        <StatCard 
          title="Avg. per Week" 
          value={stats.averagePerWeek} 
          icon={<FiBarChart2 className="h-6 w-6" />} 
          color="pink"
        />
        <StatCard 
          title="Common Mood" 
          value={stats.mostCommonMood} 
          icon={<FiImage className="h-6 w-6" />} 
          color="blue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Dream */}
        <div className="lg:col-span-2">
          <DreamCard />
        </div>

        {/* Mood Distribution */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Mood Distribution</h3>
          <div className="h-48">
            <Doughnut 
              data={moodData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      padding: 20,
                    }
                  },
                },
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Sleep Patterns */}
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Sleep Patterns</h3>
        <div className="h-64">
          <Bar data={sleepData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
}
