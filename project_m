import React, { useState, useEffect } from 'react';
import { Check, Plus, Edit2, Trash2, Star, Flame, Trophy, Target, Book, Feather, Crown, Heart, Sparkles, Sword, Shield, Zap } from 'lucide-react';

const ProjectMargo = () => {
  const pathIcons = {
    scholar: Book,
    author: Feather,
    leader: Crown,
    vessel: Heart
  };

  const pathColors = {
    scholar: 'from-cyan-400 via-blue-500 to-indigo-600',
    author: 'from-purple-400 via-violet-500 to-fuchsia-600',
    leader: 'from-amber-400 via-orange-500 to-red-600',
    vessel: 'from-pink-400 via-rose-500 to-red-600'
  };

  const pathBorders = {
    scholar: 'border-blue-500',
    author: 'border-purple-500',
    leader: 'border-orange-500',
    vessel: 'border-pink-500'
  };

  // Achievement definitions
  const achievementList = [
    { id: 'first_step', name: 'First Steps', desc: 'Complete your first habit', icon: '🌟', xp: 50, condition: (data) => data.completedToday.length >= 1 },
    { id: 'week_warrior', name: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '⚔️', xp: 200, condition: (data) => Object.values(data.streaks).some(s => s >= 7) },
    { id: 'level_five', name: 'Rising Hero', desc: 'Reach level 5 in any path', icon: '🛡️', xp: 300, condition: (data) => Object.values(data.paths).some(p => p.level >= 5) },
    { id: 'all_paths', name: 'Renaissance Soul', desc: 'Have at least 1 habit in all 4 paths', icon: '✨', xp: 500, condition: (data) => Object.keys(data.paths).every(key => data.dailyHabits.some(h => h.pathKey === key)) },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete all habits in a single day', icon: '💎', xp: 250, condition: (data) => data.dailyHabits.length > 0 && data.completedToday.length === data.dailyHabits.length },
    { id: 'milestone_master', name: 'Milestone Master', desc: 'Create 10 milestones', icon: '🏆', xp: 400, condition: (data) => Object.values(data.roadmaps).flat().length >= 10 },
    { id: 'month_legend', name: 'Legendary Streak', desc: 'Maintain a 30-day streak', icon: '🔥', xp: 1000, condition: (data) => Object.values(data.streaks).some(s => s >= 30) },
    { id: 'ten_levels', name: 'Master of Craft', desc: 'Reach level 10 in any path', icon: '👑', xp: 750, condition: (data) => Object.values(data.paths).some(p => p.level >= 10) },
  ];

  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPath, setSelectedPath] = useState(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(null);

  const [gameData, setGameData] = useState({
    character: {
      name: 'Hero',
      title: 'Novice Adventurer',
      avatar: '🧙‍♀️'
    },
    paths: {
      scholar: { name: 'The Scholar', level: 1, xp: 0, maxXp: 100 },
      author: { name: 'The Author', level: 1, xp: 0, maxXp: 100 },
      leader: { name: 'The Leader', level: 1, xp: 0, maxXp: 100 },
      vessel: { name: 'The Vessel', level: 1, xp: 0, maxXp: 100 }
    },
    roadmaps: {
      scholar: [],
      author: [],
      leader: [],
      vessel: []
    },
    dailyHabits: [],
    completedToday: [],
    streaks: {},
    achievements: [],
    totalXP: 0,
    lastVisit: new Date().toDateString()
  });

  useEffect(() => {
    const saved = localStorage.getItem('projectMargoData');
    if (saved) {
      setGameData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectMargoData', JSON.stringify(gameData));
    checkAchievements();
  }, [gameData]);

  const checkAchievements = () => {
    achievementList.forEach(achievement => {
      if (!gameData.achievements.includes(achievement.id) && achievement.condition(gameData)) {
        setGameData(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id],
          totalXP: prev.totalXP + achievement.xp
        }));
        setShowAchievementPopup(achievement);
        setTimeout(() => setShowAchievementPopup(null), 3000);
      }
    });
  };

  const addXP = (pathKey, amount) => {
    setGameData(prev => {
      const path = prev.paths[pathKey];
      let newXp = path.xp + amount;
      let newLevel = path.level;
      let newMaxXp = path.maxXp;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = Math.floor(newMaxXp * 1.5);
      }

      return {
        ...prev,
        paths: {
          ...prev.paths,
          [pathKey]: { ...path, xp: newXp, level: newLevel, maxXp: newMaxXp }
        },
        totalXP: prev.totalXP + amount
      };
    });
  };

  const addMilestone = (pathKey, milestone) => {
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [pathKey]: [...prev.roadmaps[pathKey], { ...milestone, id: Date.now(), challenges: [] }]
      }
    }));
  };

  const addChallenge = (pathKey, milestoneId, challenge) => {
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [pathKey]: prev.roadmaps[pathKey].map(m =>
          m.id === milestoneId
            ? { ...m, challenges: [...m.challenges, { ...challenge, id: Date.now(), habits: [] }] }
            : m
        )
      }
    }));
  };

  const addHabit = (pathKey, milestoneId, challengeId, habit) => {
    const habitWithId = { ...habit, id: Date.now(), pathKey, milestoneId, challengeId };
    
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [pathKey]: prev.roadmaps[pathKey].map(m =>
          m.id === milestoneId
            ? {
                ...m,
                challenges: m.challenges.map(c =>
                  c.id === challengeId
                    ? { ...c, habits: [...c.habits, habitWithId] }
                    : c
                )
              }
            : m
        )
      },
      dailyHabits: [...prev.dailyHabits, habitWithId],
      streaks: { ...prev.streaks, [habitWithId.id]: 0 }
    }));
  };

  const toggleHabit = (habitId) => {
    const habit = gameData.dailyHabits.find(h => h.id === habitId);
    
    if (gameData.completedToday.includes(habitId)) {
      setGameData(prev => ({
        ...prev,
        completedToday: prev.completedToday.filter(id => id !== habitId)
      }));
      addXP(habit.pathKey, -10);
    } else {
      const streakBonus = Math.floor((gameData.streaks[habitId] || 0) / 7);
      const xpGain = 10 * (1 + streakBonus);
      
      setGameData(prev => ({
        ...prev,
        completedToday: [...prev.completedToday, habitId],
        streaks: {
          ...prev.streaks,
          [habitId]: (prev.streaks[habitId] || 0) + 1
        }
      }));
      addXP(habit.pathKey, xpGain);
    }
  };

  const deleteMilestone = (pathKey, milestoneId) => {
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [pathKey]: prev.roadmaps[pathKey].filter(m => m.id !== milestoneId)
      }
    }));
  };

  const deleteChallenge = (pathKey, milestoneId, challengeId) => {
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [pathKey]: prev.roadmaps[pathKey].map(m =>
          m.id === milestoneId
            ? { ...m, challenges: m.challenges.filter(c => c.id !== challengeId) }
            : m
        )
      }
    }));
  };

  const deleteHabit = (habitId) => {
    const habit = gameData.dailyHabits.find(h => h.id === habitId);
    setGameData(prev => ({
      ...prev,
      roadmaps: {
        ...prev.roadmaps,
        [habit.pathKey]: prev.roadmaps[habit.pathKey].map(m =>
          m.id === habit.milestoneId
            ? {
                ...m,
                challenges: m.challenges.map(c =>
                  c.id === habit.challengeId
                    ? { ...c, habits: c.habits.filter(h => h.id !== habitId) }
                    : c
                )
              }
            : m
        )
      },
      dailyHabits: prev.dailyHabits.filter(h => h.id !== habitId),
      completedToday: prev.completedToday.filter(id => id !== habitId)
    }));
  };

  const Dashboard = () => {
    const totalLevel = Math.floor(
      Object.values(gameData.paths).reduce((sum, p) => sum + p.level, 0) / 4
    );
    const todayProgress = gameData.dailyHabits.length > 0
      ? Math.round((gameData.completedToday.length / gameData.dailyHabits.length) * 100)
      : 0;

    return (
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 overflow-hidden border-4 border-purple-500 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="text-7xl filter drop-shadow-lg">{gameData.character.avatar}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-1">{gameData.character.name}</h1>
              <p className="text-purple-300 text-lg mb-3">{gameData.character.title}</p>
              <div className="flex items-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-white/70 text-xs mb-1">Overall Level</p>
                  <p className="text-3xl font-bold text-yellow-300">{totalLevel}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-white/70 text-xs mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-cyan-300">{gameData.totalXP}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-white/70 text-xs mb-1">Achievements</p>
                  <p className="text-2xl font-bold text-purple-300">{gameData.achievements.length}/{achievementList.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Progress */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-yellow-400" size={28} />
            Today's Quest Progress
          </h2>
          <div className="mb-3">
            <div className="w-full bg-black/30 rounded-full h-6 border border-white/20 overflow-hidden">
              <div
                className="h-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${todayProgress}%` }}
              >
                {todayProgress > 0 && `${todayProgress}%`}
              </div>
            </div>
            <p className="text-white/80 mt-2 text-center text-lg">
              {gameData.completedToday.length} / {gameData.dailyHabits.length} quests completed
            </p>
          </div>
        </div>

        {/* The Four Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(gameData.paths).map(([key, path]) => {
            const Icon = pathIcons[key];
            return (
              <div
                key={key}
                className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-4 ${pathBorders[key]} shadow-2xl hover:scale-105 transition-all cursor-pointer overflow-hidden group`}
                onClick={() => {
                  setSelectedPath(key);
                  setActiveView('roadmap');
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity" style={{
                  background: `linear-gradient(135deg, ${key === 'scholar' ? '#06b6d4, #3b82f6' : key === 'author' ? '#a855f7, #d946ef' : key === 'leader' ? '#f59e0b, #ef4444' : '#ec4899, #ef4444'})`
                }}></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pathColors[key]} flex items-center justify-center shadow-lg border-2 border-white/20`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-white">{path.name}</h3>
                      <p className="text-yellow-300 text-lg font-semibold">Level {path.level}</p>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-4 border border-white/20 overflow-hidden">
                    <div
                      className={`h-4 bg-gradient-to-r ${pathColors[key]} transition-all shadow-lg`}
                      style={{ width: `${(path.xp / path.maxXp) * 100}%` }}
                    />
                  </div>
                  <p className="text-white/70 mt-2 text-right font-medium">
                    {path.xp} / {path.maxXp} XP
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CharacterSheet = () => {
    const totalLevel = Math.floor(
      Object.values(gameData.paths).reduce((sum, p) => sum + p.level, 0) / 4
    );
    const maxStreak = Math.max(...Object.values(gameData.streaks), 0);
    const completionRate = gameData.dailyHabits.length > 0 
      ? Math.round((gameData.completedToday.length / gameData.dailyHabits.length) * 100) 
      : 0;

    return (
      <div className="space-y-6">
        {/* Character Card */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 border-4 border-purple-500 shadow-2xl">
          <div className="flex items-start gap-8">
            <div className="text-9xl filter drop-shadow-2xl">{gameData.character.avatar}</div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-2">{gameData.character.name}</h1>
              <p className="text-purple-300 text-2xl mb-6 italic">"{gameData.character.title}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white/70 text-sm mb-1">⭐ Overall Level</p>
                  <p className="text-4xl font-bold text-yellow-300">{totalLevel}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white/70 text-sm mb-1">💎 Total XP</p>
                  <p className="text-4xl font-bold text-cyan-300">{gameData.totalXP}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white/70 text-sm mb-1">🔥 Max Streak</p>
                  <p className="text-4xl font-bold text-orange-300">{maxStreak} days</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white/70 text-sm mb-1">📈 Completion</p>
                  <p className="text-4xl font-bold text-green-300">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Path Levels */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sword className="text-yellow-400" size={28} />
            Path Mastery
          </h2>
          <div className="space-y-4">
            {Object.entries(gameData.paths).map(([key, path]) => {
              const Icon = pathIcons[key];
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pathColors[key]} flex items-center justify-center border-2 border-white/20`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-semibold">{path.name}</span>
                      <span className="text-yellow-300 font-bold">Lv.{path.level}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-3 border border-white/20">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${pathColors[key]}`}
                        style={{ width: `${(path.xp / path.maxXp) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-yellow-500 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-400" size={28} />
            Achievements ({gameData.achievements.length}/{achievementList.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievementList.map(achievement => {
              const unlocked = gameData.achievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    unlocked
                      ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500'
                      : 'bg-black/20 border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-4xl ${unlocked ? 'filter drop-shadow-lg' : 'grayscale opacity-30'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 ${unlocked ? 'text-yellow-300' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${unlocked ? 'text-white/80' : 'text-gray-600'}`}>
                        {achievement.desc}
                      </p>
                      <p className={`text-xs mt-1 ${unlocked ? 'text-cyan-300' : 'text-gray-700'}`}>
                        +{achievement.xp} XP
                      </p>
                    </div>
                    {unlocked && <Check className="text-green-400" size={24} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Gain Achievements */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-400" size={28} />
            How to Gain Achievements
          </h2>
          <div className="space-y-3 text-white/90">
            <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold">Complete Habits</p>
                <p className="text-sm text-white/70">Check off your daily quests to earn XP and unlock achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-semibold">Build Streaks</p>
                <p className="text-sm text-white/70">Complete habits consecutively for bonus XP and special achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
              <span className="text-2xl">⬆️</span>
              <div>
                <p className="font-semibold">Level Up</p>
                <p className="text-sm text-white/70">Gain XP to level up your paths and unlock level-based achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold">Create Milestones</p>
                <p className="text-sm text-white/70">Build your roadmaps with goals and challenges to unlock more achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DailyTracker = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 border-4 border-purple-500 shadow-2xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="text-cyan-400" size={36} />
          Daily Quest Log
        </h1>
      </div>

      {Object.entries(gameData.paths).map(([pathKey, path]) => {
        const pathHabits = gameData.dailyHabits.filter(h => h.pathKey === pathKey);
        if (pathHabits.length === 0) return null;

        const Icon = pathIcons[pathKey];

        return (
          <div key={pathKey} className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-4 ${pathBorders[pathKey]} shadow-xl`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pathColors[pathKey]} flex items-center justify-center border-2 border-white/20`}>
                <Icon className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">{path.name} Quests</h2>
            </div>

            <div className="space-y-3">
              {pathHabits.map(habit => {
                const isCompleted = gameData.completedToday.includes(habit.id);
                const streak = gameData.streaks[habit.id] || 0;

                return (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-900/30 border-green-500'
                        : 'bg-black/20 border-white/20 hover:border-purple-400'
                    }`}
                  >
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-400'
                          : 'border-white/30 hover:border-purple-500'
                      }`}
                    >
                      {isCompleted && <Check className="text-white" size={20} />}
                    </button>

                    <div className="flex-1">
                      <p className={`font-semibold text-lg ${isCompleted ? 'line-through text-white/50' : 'text-white'}`}>
                        {habit.name}
                      </p>
                    </div>

                    {streak > 0 && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-lg">
                        <Flame className="text-white" size={20} />
                        <span className="text-lg font-bold text-white">{streak}</span>
                      </div>
                    )}

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 hover:bg-red-900/50 rounded-lg transition-colors border border-red-500/30"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {gameData.dailyHabits.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-xl border-2 border-dashed border-purple-500/30">
          <Target size={64} className="mx-auto mb-4 text-purple-400 opacity-50" />
          <p className="text-white/70 text-lg">No quests assigned yet!</p>
          <p className="text-white/50 text-sm">Create habits from your roadmaps to begin your journey</p>
        </div>
      )}
    </div>
  );

  const RoadmapView = () => {
    const [newMilestone, setNewMilestone] = useState('');
    const [newChallenge, setNewChallenge] = useState({ milestoneId: null, name: '' });
    const [newHabit, setNewHabit] = useState({ challengeId: null, milestoneId: null, name: '' });

    if (!selectedPath) return null;

    const path = gameData.paths[selectedPath];
    const roadmap = gameData.roadmaps[selectedPath];
    const Icon = pathIcons[selectedPath];

    return (
      <div className="space-y-6">
        <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-4 ${pathBorders[selectedPath]} shadow-2xl`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${pathColors[selectedPath]} flex items-center justify-center shadow-lg border-2 border-white/20`}>
              <Icon size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">{path.name}</h1>
              <p className="text-purple-300 text-lg">Level {path.level} • {path.xp}/{path.maxXp} XP</p>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-4 border-2 border-white/20 overflow-hidden">
            <div
              className={`h-4 bg-gradient-to-r ${pathColors[selectedPath]} transition-all shadow-lg`}
              style={{ width: `${(path.xp / path.maxXp) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border-2 border-purple-500 shadow-xl">
          <h3 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
            <Plus className="text-purple-400" size={24} />
            Create New Milestone
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="e.g., Master the Ancient Scrolls of Machine Learning"
              className="flex-1 px-4 py-3 bg-black/40 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-500 outline-none"
            />
            <button
              onClick={() => {
                if (newMilestone.trim()) {
                  addMilestone(selectedPath, { name: newMilestone });
                  setNewMilestone('');
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-2xl transition-all border-2 border-purple-400"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {roadmap.map((milestone, mIdx) => (
            <div key={milestone.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pathColors[selectedPath]} flex items-center justify-center text-white font-bold text-xl border-2 border-white/20`}>
                    {mIdx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white">{milestone.name}</h3>
                </div>
                <button
                  onClick={() => deleteMilestone(selectedPath, milestone.id)}
                  className="p-2 hover:bg-red-900/50 rounded-lg transition-colors border border-red-500/30"
                >
                  <Trash2 size={20} className="text-red-400" />
                </button>
              </div>

              <div className="ml-8 space-y-3">
                {milestone.challenges.map((challenge) => (
                  <div key={challenge.id} className="border-l-4 border-purple-500 pl-4 bg-black/20 rounded-r-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Sword className="text-yellow-400" size={18} />
                        {challenge.name}
                      </h4>
                      <button
                        onClick={() => deleteChallenge(selectedPath, milestone.id, challenge.id)}
                        className="p-1 hover:bg-red-900/50 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>

                    <div className="ml-6 space-y-1">
                      {challenge.habits.map((habit) => (
                        <div key={habit.id} className="text-sm text-cyan-300 flex items-center gap-2">
                          <Check size={14} />
                          {habit.name}
                        </div>
                      ))}
                    </div>

                    {newHabit.challengeId === challenge.id && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newHabit.name}
                          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                          placeholder="Daily quest..."
                          className="flex-1 px-3 py-2 text-sm bg-black/40 border border-white/20 rounded text-white placeholder-white/40 focus:border-purple-500 outline-none"
                        />
                        <button
                          onClick={() => {
                            if (newHabit.name.trim()) {
                              addHabit(selectedPath, milestone.id, challenge.id, { name: newHabit.name });
                              setNewHabit({ challengeId: null, milestoneId: null, name: '' });
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    )}
                    {newHabit.challengeId !== challenge.id && (
                      <button
                        onClick={() => setNewHabit({ challengeId: challenge.id, milestoneId: milestone.id, name: '' })}
                        className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 font-semibold"
                      >
                        + Add daily quest
                      </button>
                    )}
                  </div>
                ))}

                {newChallenge.milestoneId === milestone.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChallenge.name}
                      onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
                      placeholder="Challenge name..."
                      className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-500 outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newChallenge.name.trim()) {
                          addChallenge(selectedPath, milestone.id, { name: newChallenge.name });
                          setNewChallenge({ milestoneId: null, name: '' });
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setNewChallenge({ milestoneId: milestone.id, name: '' })}
                    className="text-sm text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    + Add challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {roadmap.length === 0 && (
          <div className="text-center py-16 bg-slate-900/50 rounded-xl border-2 border-dashed border-purple-500/30">
            <Target size={64} className="mx-auto mb-4 text-purple-400 opacity-50" />
            <p className="text-white/70 text-lg">No milestones in this path yet!</p>
            <p className="text-white/50 text-sm">Begin your journey by creating your first milestone above</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Achievement Popup */}
      {showAchievementPopup && (
        <div className="fixed top-24 right-4 z-50 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 shadow-2xl border-4 border-yellow-300 animate-bounce">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{showAchievementPopup.icon}</span>
            <div>
              <p className="text-white font-bold text-xl mb-1">Achievement Unlocked!</p>
              <p className="text-yellow-100 text-lg">{showAchievementPopup.name}</p>
              <p className="text-yellow-200 text-sm">+{showAchievementPopup.xp} XP</p>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl sticky top-0 z-40 border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={32} />
              Project Margo
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-5 py-2 rounded-lg font-bold transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border-2 border-purple-300'
                    : 'text-purple-300 hover:bg-white/10 border-2 border-transparent'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('character')}
                className={`px-5 py-2 rounded-lg font-bold transition-all ${
                  activeView === 'character'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border-2 border-purple-300'
                    : 'text-purple-300 hover:bg-white/10 border-2 border-transparent'
                }`}
              >
                Character
              </button>
              <button
                onClick={() => setActiveView('tracker')}
                className={`px-5 py-2 rounded-lg font-bold transition-all ${
                  activeView === 'tracker'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border-2 border-purple-300'
                    : 'text-purple-300 hover:bg-white/10 border-2 border-transparent'
                }`}
              >
                Quests
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'character' && <CharacterSheet />}
        {activeView === 'tracker' && <DailyTracker />}
        {activeView === 'roadmap' && <RoadmapView />}
      </main>
    </div>
  );
};

export default ProjectMargo;
