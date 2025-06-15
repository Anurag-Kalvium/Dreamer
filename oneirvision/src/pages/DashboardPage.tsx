import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  TrendingUp, 
  Download, 
  Play, 
  Pause, 
  Star,
  Moon,
  Zap,
  Heart,
  Clock,
  BarChart3,
  Calendar
} from 'lucide-react';

// Register ChartJS components
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

interface DreamStats {
  totalDreams: number;
  streakDays: number;
  mostCommonMood: string;
  averagePerWeek: number;
  moodDistribution: { [key: string]: number };
  weeklyActivity: number[];
  recentDreams: any[];
  dreamSymbols: { symbol: string; count: number }[];
}

const DashboardPage: React.FC = () => {
  const { dreamJournal, fetchDreamJournal } = useDreamContext();
  const { user } = useAuth();
  const [stats, setStats] = useState<DreamStats>({
    totalDreams: 0,
    streakDays: 0,
    mostCommonMood: 'peaceful',
    averagePerWeek: 0,
    moodDistribution: {},
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    recentDreams: [],
    dreamSymbols: []
  });
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  const moodColors = {
    peaceful: '#60A5FA',
    adventurous: '#F59E0B',
    mysterious: '#A855F7',
    scary: '#EF4444',
    happy: '#10B981',
    sad: '#6B7280',
    confused: '#8B5CF6',
    excited: '#F97316'
  };

  const moodEmojis = {
    peaceful: '🌙',
    adventurous: '⚡',
    mysterious: '🔮',
    scary: '👻',
    happy: '☀️',
    sad: '☁️',
    confused: '🌀',
    excited: '🎆'
  };

  useEffect(() => {
    fetchDreamJournal();
  }, [fetchDreamJournal]);

  useEffect(() => {
    if (dreamJournal.length > 0) {
      calculateStats();
    }
  }, [dreamJournal]);

  const calculateStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {};
    dreamJournal.forEach(dream => {
      moodCounts[dream.mood] = (moodCounts[dream.mood] || 0) + 1;
    });

    // Calculate weekly activity
    const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
    dreamJournal.forEach(dream => {
      const dreamDate = new Date(dream.date);
      if (dreamDate >= oneWeekAgo) {
        const dayOfWeek = dreamDate.getDay();
        weeklyActivity[dayOfWeek]++;
      }
    });

    // Calculate streak
    let streak = 0;
    const sortedDreams = [...dreamJournal].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const dream of sortedDreams) {
      const dreamDate = new Date(dream.date);
      dreamDate.setHours(0, 0, 0, 0);
      
      if (dreamDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dreamDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    // Extract common symbols (simplified)
    const symbolCounts: { [key: string]: number } = {};
    const commonSymbols = ['water', 'flying', 'house', 'animal', 'forest', 'car', 'people', 'school'];
    
    dreamJournal.forEach(dream => {
      const description = dream.description.toLowerCase();
      commonSymbols.forEach(symbol => {
        if (description.includes(symbol)) {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        }
      });
    });

    const dreamSymbols = Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Find most common mood
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'peaceful';

    setStats({
      totalDreams: dreamJournal.length,
      streakDays: streak,
      mostCommonMood,
      averagePerWeek: weeklyActivity.reduce((a, b) => a + b, 0),
      moodDistribution: moodCounts,
      weeklyActivity,
      recentDreams: dreamJournal.slice(0, 3),
      dreamSymbols
    });
  };

  // Chart configurations
  const moodTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Dreams',
        data: stats.weeklyActivity,
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#A855F7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const moodDistributionData = {
    labels: Object.keys(stats.moodDistribution),
    datasets: [
      {
        data: Object.values(stats.moodDistribution),
        backgroundColor: Object.keys(stats.moodDistribution).map(mood => moodColors[mood as keyof typeof moodColors] || '#6B7280'),
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#A855F7',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#A855F7',
        borderWidth: 1,
      },
    },
  };

  const StatCard = ({ title, value, icon, gradient, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
    subtitle?: string;
  }) => (
    <motion.div
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20 backdrop-blur-sm`}>
            {icon}
          </div>
          {title === 'Dream Streak' && value > 0 && (
            <motion.div 
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥
            </motion.div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-300 font-medium">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0D041B] relative overflow-hidden">
      {/* Animated Background - matching homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Animated elements - matching homepage */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: Math.random() * 400 + 100 + 'px',
                height: Math.random() * 400 + 100 + 'px',
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)'
                }, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header - matching homepage style */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              }}
            >
              Dream Analytics
            </motion.h1>
            
            {/* Subheading */}
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome back, {user?.name?.split(' ')[0] || 'Dreamer'}
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Your personal analytics dashboard for exploring dream patterns and unlocking subconscious insights
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <StatCard
              title="Total Dreams"
              value={stats.totalDreams}
              icon={<Moon className="h-8 w-8 text-indigo-400" />}
              gradient="from-indigo-500 to-purple-600"
              subtitle="Dreams captured"
            />
            <StatCard
              title="Dream Streak"
              value={`${stats.streakDays} days`}
              icon={<Zap className="h-8 w-8 text-yellow-400" />}
              gradient="from-yellow-500 to-orange-600"
              subtitle="Keep it going!"
            />
            <StatCard
              title="Weekly Activity"
              value={stats.averagePerWeek}
              icon={<TrendingUp className="h-8 w-8 text-green-400" />}
              gradient="from-green-500 to-teal-600"
              subtitle="Dreams this week"
            />
            <StatCard
              title="Dominant Mood"
              value={stats.mostCommonMood}
              icon={<span className="text-3xl">{moodEmojis[stats.mostCommonMood as keyof typeof moodEmojis]}</span>}
              gradient="from-purple-500 to-pink-600"
              subtitle="Most frequent"
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Mood Trends Chart */}
            <motion.div 
              className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  <BarChart3 className="mr-3 text-purple-400 h-7 w-7" />
                  Weekly Dream Activity
                </h3>
                <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                  Last 7 days
                </div>
              </div>
              <div className="h-80">
                <Line data={moodTrendData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Mood Distribution */}
            <motion.div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <Heart className="mr-3 text-pink-400 h-7 w-7" />
                Mood Distribution
              </h3>
              <div className="h-80">
                <Doughnut data={moodDistributionData} options={doughnutOptions} />
              </div>
            </motion.div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Dreams */}
            <motion.div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  <Eye className="mr-3 text-indigo-400 h-7 w-7" />
                  Recent Dreams
                </h3>
                <Link 
                  to="/journal"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors bg-white/5 px-3 py-1 rounded-full"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {stats.recentDreams.map((dream, index) => (
                  <motion.div
                    key={dream.id}
                    className="p-6 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">
                            {moodEmojis[dream.mood as keyof typeof moodEmojis]}
                          </span>
                          <h4 className="font-semibold text-white">{dream.title}</h4>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {dream.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 ml-4 bg-white/5 px-2 py-1 rounded">
                        {new Date(dream.date).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {stats.recentDreams.length === 0 && (
                  <div className="text-center py-12">
                    <Moon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No dreams yet</p>
                    <Link 
                      to="/analyze"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Start your first dream
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Dream Symbols */}
            <motion.div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <Star className="mr-3 text-yellow-400 h-7 w-7" />
                Common Symbols
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.dreamSymbols.map((symbol, index) => (
                  <motion.div
                    key={symbol.symbol}
                    className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">
                        {symbol.symbol === 'water' && '🌊'}
                        {symbol.symbol === 'flying' && '🕊️'}
                        {symbol.symbol === 'house' && '🏠'}
                        {symbol.symbol === 'animal' && '🦋'}
                        {symbol.symbol === 'forest' && '🌲'}
                        {symbol.symbol === 'car' && '🚗'}
                        {symbol.symbol === 'people' && '👥'}
                        {symbol.symbol === 'school' && '🏫'}
                      </div>
                      <p className="text-white font-semibold capitalize">{symbol.symbol}</p>
                      <p className="text-gray-400 text-sm">{symbol.count} times</p>
                    </div>
                  </motion.div>
                ))}
                {stats.dreamSymbols.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No symbols detected yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Cards - matching homepage feature grid style */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {[
              {
                icon: <Brain className="h-8 w-8 text-indigo-400" />,
                title: 'AI Insights',
                description: `You tend to dream more on weekends. Your ${stats.mostCommonMood} dreams often feature transformation themes.`,
                gradient: 'from-indigo-500/20 to-purple-500/20',
                border: 'border-indigo-500/20'
              },
              {
                icon: <Download className="h-8 w-8 text-green-400" />,
                title: 'Export Analytics',
                description: 'Download your complete dream insights and analytics report.',
                gradient: 'from-green-500/20 to-teal-500/20',
                border: 'border-green-500/20',
                action: (
                  <button className="w-full mt-4 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors flex items-center justify-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </button>
                )
              },
              {
                icon: <Clock className="h-8 w-8 text-purple-400" />,
                title: 'Ambient Focus',
                description: 'Enhance your dream analysis with calming ambient sounds.',
                gradient: 'from-purple-500/20 to-pink-500/20',
                border: 'border-purple-500/20',
                action: (
                  <button 
                    onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
                    className="w-full mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isAmbientPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isAmbientPlaying ? 'Pause' : 'Play'} Ambient
                  </button>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/5 backdrop-blur-sm border ${feature.border} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
                {feature.action}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;