import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import {
  User,
  Calendar,
  Clock,
  Mail,
  Activity,
  Settings,
  Bell,
  Shield,
  TrendingUp,
  Award,
  Zap,
  Star,
  Target,
  Sparkles,
  BarChart3,
  Flame,
  Crown,
  CloudLightning as Lightning,
} from "lucide-react";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [animatedStats, setAnimatedStats] = useState({
    days: 0,
    sessions: 0,
    achievements: 0,
  });

  const handleLogout = () => {
    logout();
  };

  // Animate counters on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ days: 127, sessions: 45, achievements: 12 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const stats = [
    {
      label: "Days Active",
      value: animatedStats.days,
      icon: Activity,
      color: "from-blue-400 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/10",
      progress: 85,
      trend: "+12%",
    },
    {
      label: "Sessions",
      value: animatedStats.sessions,
      icon: TrendingUp,
      color: "from-purple-400 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/10",
      progress: 67,
      trend: "+8%",
    },
    {
      label: "Achievements",
      value: animatedStats.achievements,
      icon: Award,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "from-yellow-500/10 to-yellow-600/10",
      progress: 92,
      trend: "+24%",
    },
  ];

  const quickActions = [
    {
      icon: Settings,
      label: "Account Settings",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      hoverColor: "hover:from-blue-500/30 hover:to-blue-600/30",
    },
    {
      icon: Bell,
      label: "Notifications",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300",
      hoverColor: "hover:from-purple-500/30 hover:to-purple-600/30",
    },
    {
      icon: Shield,
      label: "Security",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-300",
      hoverColor: "hover:from-green-500/30 hover:to-green-600/30",
    },
  ];

  const achievements = [
    { icon: Crown, label: "VIP Member", color: "text-yellow-400" },
    { icon: Flame, label: "Streak Master", color: "text-orange-400" },
    { icon: Star, label: "Top Performer", color: "text-blue-400" },
    { icon: Lightning, label: "Speed Runner", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Enhanced floating particles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "bg-green-400"
                : i % 3 === 1
                ? "bg-emerald-400"
                : "bg-teal-400"
            } ${i % 4 === 0 ? "w-2 h-2" : "w-1 h-1"} opacity-20`}
            animate={{
              x: [
                Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
              ],
              y: [
                Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
                Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
              ],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Enhanced Header with animated background */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 relative"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative inline-flex items-center justify-center w-24 h-24 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full shadow-xl blur opacity-75"></div>
            <div className="relative z-10 flex items-center justify-center w-full h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full">
              <User className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-transparent bg-clip-text mb-4 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back, {user?.userName}!
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-emerald-600/20 rounded-lg blur opacity-0"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.h1>

          <motion.p
            className="text-gray-300 text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Here's your personalized dashboard overview
          </motion.p>

          <motion.div
            className="flex items-center justify-center mt-4 space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                <span className="text-gray-300 text-sm font-medium">
                  {achievement.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Cards with progress rings */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative overflow-hidden bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl group"
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Animated background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-100`}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <motion.p
                      className="text-4xl font-bold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 1 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm font-medium">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity`}
                    ></div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-300">{stat.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl mr-4 shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Profile Information
                </h3>
                <Sparkles className="w-5 h-5 text-yellow-400 ml-2" />
              </div>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm group/item"
                  whileHover={{
                    backgroundColor: "rgba(75, 85, 99, 0.5)",
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="p-2 bg-green-400/20 rounded-lg mr-3 group-hover/item:bg-green-400/30 transition-colors">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold text-lg">
                      {user?.userName}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </motion.div>

                <motion.div
                  className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm group/item"
                  whileHover={{
                    backgroundColor: "rgba(75, 85, 99, 0.5)",
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="p-2 bg-green-400/20 rounded-lg mr-3 group-hover/item:bg-green-400/30 transition-colors">
                    <Mail className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Email Address</p>
                    <p className="text-white font-semibold text-lg">
                      {user?.email}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Activity Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 transform rotate-12 scale-150"
                animate={{ rotate: [12, 15, 12] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-xl mr-4 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Account Activity
                </h3>
                <BarChart3 className="w-5 h-5 text-emerald-400 ml-2" />
              </div>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm group/item"
                  whileHover={{
                    backgroundColor: "rgba(75, 85, 99, 0.5)",
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="p-2 bg-emerald-400/20 rounded-lg mr-3 group-hover/item:bg-emerald-400/30 transition-colors">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white font-semibold text-lg">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </motion.div>

                <motion.div
                  className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm group/item"
                  whileHover={{
                    backgroundColor: "rgba(75, 85, 99, 0.5)",
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="p-2 bg-emerald-400/20 rounded-lg mr-3 group-hover/item:bg-emerald-400/30 transition-colors">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Last Active</p>
                    <p className="text-white font-semibold text-lg">
                      {user?.lastLogin ? formatDate(user.lastLogin) : "N/A"}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-600/5 rounded-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mr-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Quick Actions
              <Target className="w-6 h-6 text-yellow-400 ml-3" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  className={`relative flex items-center justify-center p-6 bg-gradient-to-r ${action.color} rounded-2xl border ${action.borderColor} ${action.textColor} ${action.hoverColor} transition-all duration-300 group overflow-hidden`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <action.icon className="w-6 h-6 mr-3 relative z-10" />
                  <span className="font-semibold text-lg relative z-10">
                    {action.label}
                  </span>

                  {/* Animated background shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Logout Button */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.button
            onClick={handleLogout}
            className="relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-2xl overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background layers */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500"
              initial={{ x: "100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />

            <span className="relative z-10 flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2"
              >
                👋
              </motion.div>
              Sign Out
            </span>

            {/* Multiple glow effects */}
            <div className="absolute inset-0 bg-red-400 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-red-300 rounded-3xl blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"></div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
