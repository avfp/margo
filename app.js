// Game Data
let gameData = {
    character: { name: 'Hero', title: 'Novice Adventurer', avatar: '🧙‍♀️' },
    paths: {
        scholar: { name: 'The Scholar', level: 1, xp: 0, maxXp: 100, icon: '📚', color: 'from-cyan-400 via-blue-500 to-indigo-600', border: 'border-blue-500' },
        author: { name: 'The Author', level: 1, xp: 0, maxXp: 100, icon: '✍️', color: 'from-purple-400 via-violet-500 to-fuchsia-600', border: 'border-purple-500' },
        leader: { name: 'The Leader', level: 1, xp: 0, maxXp: 100, icon: '👑', color: 'from-amber-400 via-orange-500 to-red-600', border: 'border-orange-500' },
        vessel: { name: 'The Vessel', level: 1, xp: 0, maxXp: 100, icon: '💪', color: 'from-pink-400 via-rose-500 to-red-600', border: 'border-pink-500' }
    },
    roadmaps: { scholar: [], author: [], leader: [], vessel: [] },
    dailyHabits: [],
    completedToday: [],
    streaks: {},
    achievements: [],
    totalXP: 0
};

const achievements = [
    { id: 'first_step', name: 'First Steps', desc: 'Complete your first habit', icon: '🌟', xp: 50 },
    { id: 'week_warrior', name: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '⚔️', xp: 200 },
    { id: 'level_five', name: 'Rising Hero', desc: 'Reach level 5 in any path', icon: '🛡️', xp: 300 },
    { id: 'all_paths', name: 'Renaissance Soul', desc: 'Have at least 1 habit in all 4 paths', icon: '✨', xp: 500 },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete all habits in a single day', icon: '💎', xp: 250 },
    { id: 'milestone_master', name: 'Milestone Master', desc: 'Create 10 milestones', icon: '🏆', xp: 400 },
    { id: 'month_legend', name: 'Legendary Streak', desc: 'Maintain a 30-day streak', icon: '🔥', xp: 1000 },
    { id: 'ten_levels', name: 'Master of Craft', desc: 'Reach level 10 in any path', icon: '👑', xp: 750 }
];

let currentView = 'dashboard';
let selectedPath = null;

function loadData() {
    const saved = localStorage.getItem('projectMargoData');
    if (saved) gameData = JSON.parse(saved);
}

function saveData() {
    localStorage.setItem('projectMargoData', JSON.stringify(gameData));
    checkAchievements();
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameData.achievements.includes(achievement.id)) {
            let unlocked = false;
            switch(achievement.id) {
                case 'first_step': unlocked = gameData.completedToday.length >= 1; break;
                case 'week_warrior': unlocked = Object.values(gameData.streaks).some(s => s >= 7); break;
                case 'level_five': unlocked = Object.values(gameData.paths).some(p => p.level >= 5); break;
                case 'all_paths': unlocked = Object.keys(gameData.paths).every(key => gameData.dailyHabits.some(h => h.pathKey === key)); break;
                case 'perfectionist': unlocked = gameData.dailyHabits.length > 0 && gameData.completedToday.length === gameData.dailyHabits.length; break;
                case 'milestone_master': unlocked = Object.values(gameData.roadmaps).flat().length >= 10; break;
                case 'month_legend': unlocked = Object.values(gameData.streaks).some(s => s >= 30); break;
                case 'ten_levels': unlocked = Object.values(gameData.paths).some(p => p.level >= 10); break;
            }
            if (unlocked) {
                gameData.achievements.push(achievement.id);
                gameData.totalXP += achievement.xp;
                showAchievementPopup(achievement);
            }
        }
    });
}

function showAchievementPopup(achievement) {
    document.getElementById('achievement-icon').textContent = achievement.icon;
    document.getElementById('achievement-name').textContent = achievement.name;
    document.getElementById('achievement-xp').textContent = `+${achievement.xp} XP`;
    document.getElementById('achievement-popup').classList.remove('hidden');
    setTimeout(() => document.getElementById('achievement-popup').classList.add('hidden'), 3000);
}

function addXP(pathKey, amount) {
    const path = gameData.paths[pathKey];
    path.xp += amount;
    gameData.totalXP += amount;
    while (path.xp >= path.maxXp) {
        path.xp -= path.maxXp;
        path.level++;
        path.maxXp = Math.floor(path.maxXp * 1.5);
    }
    saveData();
    render();
}

function toggleHabit(habitId) {
    const habit = gameData.dailyHabits.find(h => h.id === habitId);
    if (gameData.completedToday.includes(habitId)) {
        gameData.completedToday = gameData.completedToday.filter(id => id !== habitId);
        addXP(habit.pathKey, -10);
    } else {
        gameData.completedToday.push(habitId);
        gameData.streaks[habitId] = (gameData.streaks[habitId] || 0) + 1;
        const streakBonus = Math.floor(gameData.streaks[habitId] / 7);
        addXP(habit.pathKey, 10 * (1 + streakBonus));
    }
}

function addMilestone(pathKey) {
    const name = prompt('Enter milestone name:');
    if (name && name.trim()) {
        gameData.roadmaps[pathKey].push({ id: Date.now(), name: name.trim(), challenges: [] });
        saveData();
        render();
    }
}

function addChallenge(pathKey, milestoneId) {
    const name = prompt('Enter challenge name:');
    if (name && name.trim()) {
        const milestone = gameData.roadmaps[pathKey].find(m => m.id === milestoneId);
        milestone.challenges.push({ id: Date.now(), name: name.trim(), habits: [] });
        saveData();
        render();
    }
}

function addHabit(pathKey, milestoneId, challengeId) {
    const name = prompt('Enter daily quest name:');
    if (name && name.trim()) {
        const milestone = gameData.roadmaps[pathKey].find(m => m.id === milestoneId);
        const challenge = milestone.challenges.find(c => c.id === challengeId);
        const habitWithId = { id: Date.now(), name: name.trim(), pathKey, milestoneId, challengeId };
        challenge.habits.push(habitWithId);
        gameData.dailyHabits.push(habitWithId);
        gameData.streaks[habitWithId.id] = 0;
        saveData();
        render();
    }
}

function deleteMilestone(pathKey, milestoneId) {
    if (confirm('Delete this milestone?')) {
        gameData.roadmaps[pathKey] = gameData.roadmaps[pathKey].filter(m => m.id !== milestoneId);
        saveData();
        render();
    }
}

function deleteChallenge(pathKey, milestoneId, challengeId) {
    if (confirm('Delete this challenge?')) {
        const milestone = gameData.roadmaps[pathKey].find(m => m.id === milestoneId);
        milestone.challenges = milestone.challenges.filter(c => c.id !== challengeId);
        saveData();
        render();
    }
}

function deleteHabit(habitId) {
    if (confirm('Delete this quest?')) {
        const habit = gameData.dailyHabits.find(h => h.id === habitId);
        const milestone = gameData.roadmaps[habit.pathKey].find(m => m.id === habit.milestoneId);
        const challenge = milestone.challenges.find(c => c.id === habit.challengeId);
        challenge.habits = challenge.habits.filter(h => h.id !== habitId);
        gameData.dailyHabits = gameData.dailyHabits.filter(h => h.id !== habitId);
        gameData.completedToday = gameData.completedToday.filter(id => id !== habitId);
        saveData();
        render();
    }
}

function showView(view) {
    currentView = view;
    ['dashboard', 'character', 'tracker', 'roadmap'].forEach(v => {
        const btn = document.getElementById(`btn-${v}`);
        if (btn) {
            btn.className = `px-5 py-2 rounded-lg font-bold transition-all ${v === view ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border-2 border-purple-300' : 'text-purple-300 hover:bg-white/10 border-2 border-transparent'}`;
        }
    });
    render();
}

function showRoadmap(pathKey) {
    selectedPath = pathKey;
    currentView = 'roadmap';
    render();
}

function render() {
    const totalLevel = Math.floor(Object.values(gameData.paths).reduce((sum, p) => sum + p.level, 0) / 4);
    const todayProgress = gameData.dailyHabits.length > 0 ? Math.round((gameData.completedToday.length / gameData.dailyHabits.length) * 100) : 0;
    
    let html = '';
    
    if (currentView === 'dashboard') {
        html = `<div class="space-y-6">
            <div class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 border-4 border-purple-500 shadow-2xl">
                <div class="flex items-center gap-6 flex-wrap">
                    <div class="text-7xl">${gameData.character.avatar}</div>
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold text-white mb-1">${gameData.character.name}</h1>
                        <p class="text-purple-300 text-lg mb-3">${gameData.character.title}</p>
                        <div class="flex items-center gap-4 flex-wrap">
                            <div class="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                                <p class="text-white/70 text-xs mb-1">Level</p>
                                <p class="text-3xl font-bold text-yellow-300">${totalLevel}</p>
                            </div>
                            <div class="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                                <p class="text-white/70 text-xs mb-1">Total XP</p>
                                <p class="text-2xl font-bold text-cyan-300">${gameData.totalXP}</p>
                            </div>
                            <div class="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                                <p class="text-white/70 text-xs mb-1">Achievements</p>
                                <p class="text-2xl font-bold text-purple-300">${gameData.achievements.length}/${achievements.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-4">🎯 Today's Quest Progress</h2>
                <div class="w-full bg-black/30 rounded-full h-6 border border-white/20">
                    <div class="h-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold" style="width:${todayProgress}%">${todayProgress>0?todayProgress+'%':''}</div>
                </div>
                <p class="text-white/80 mt-2 text-center">${gameData.completedToday.length}/${gameData.dailyHabits.length} quests completed</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${Object.entries(gameData.paths).map(([key,path])=>`<div onclick="showRoadmap('${key}')" class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-4 ${path.border} shadow-2xl hover:scale-105 transition-all cursor-pointer">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-16 h-16 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-3xl border-2 border-white/20">${path.icon}</div>
                        <div><h3 class="font-bold text-2xl text-white">${path.name}</h3><p class="text-yellow-300 text-lg">Level ${path.level}</p></div>
                    </div>
                    <div class="w-full bg-black/40 rounded-full h-4 border border-white/20"><div class="h-4 bg-gradient-to-r ${path.color} rounded-full" style="width:${(path.xp/path.maxXp)*100}%"></div></div>
                    <p class="text-white/70 mt-2 text-right">${path.xp}/${path.maxXp} XP</p>
                </div>`).join('')}
            </div>
        </div>`;
    } else if (currentView === 'character') {
        const maxStreak = Math.max(...Object.values(gameData.streaks), 0);
        const completionRate = gameData.dailyHabits.length > 0 ? Math.round((gameData.completedToday.length / gameData.dailyHabits.length) * 100) : 0;
        html = `<div class="space-y-6">
            <div class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 border-4 border-purple-500 shadow-2xl">
                <div class="flex items-start gap-8 flex-wrap">
                    <div class="text-9xl">${gameData.character.avatar}</div>
                    <div class="flex-1">
                        <h1 class="text-5xl font-bold text-white mb-2">${gameData.character.name}</h1>
                        <p class="text-purple-300 text-2xl mb-6 italic">"${gameData.character.title}"</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white/10 p-4 rounded-lg border border-white/20"><p class="text-white/70 text-sm">⭐ Level</p><p class="text-4xl font-bold text-yellow-300">${totalLevel}</p></div>
                            <div class="bg-white/10 p-4 rounded-lg border border-white/20"><p class="text-white/70 text-sm">💎 Total XP</p><p class="text-4xl font-bold text-cyan-300">${gameData.totalXP}</p></div>
                            <div class="bg-white/10 p-4 rounded-lg border border-white/20"><p class="text-white/70 text-sm">🔥 Max Streak</p><p class="text-4xl font-bold text-orange-300">${maxStreak}</p></div>
                            <div class="bg-white/10 p-4 rounded-lg border border-white/20"><p class="text-white/70 text-sm">📈 Completion</p><p class="text-4xl font-bold text-green-300">${completionRate}%</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-4">⚔️ Path Mastery</h2>
                <div class="space-y-4">${Object.entries(gameData.paths).map(([key,path])=>`<div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center text-2xl border-2 border-white/20">${path.icon}</div>
                    <div class="flex-1">
                        <div class="flex justify-between mb-1"><span class="text-white font-semibold">${path.name}</span><span class="text-yellow-300 font-bold">Lv.${path.level}</span></div>
                        <div class="w-full bg-black/40 rounded-full h-3 border border-white/20"><div class="h-3 rounded-full bg-gradient-to-r ${path.color}" style="width:${(path.xp/path.maxXp)*100}%"></div></div>
                    </div>
                </div>`).join('')}</div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-yellow-500 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-4">🏆 Achievements (${gameData.achievements.length}/${achievements.length})</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${achievements.map(a=>{const u=gameData.achievements.includes(a.id);return`<div class="p-4 rounded-lg border-2 ${u?'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500':'bg-black/20 border-gray-700'}">
                    <div class="flex items-start gap-3">
                        <div class="text-4xl ${u?'':'grayscale opacity-30'}">${a.icon}</div>
                        <div class="flex-1"><h3 class="font-bold ${u?'text-yellow-300':'text-gray-500'}">${a.name}</h3><p class="text-sm ${u?'text-white/80':'text-gray-600'}">${a.desc}</p><p class="text-xs mt-1 ${u?'text-cyan-300':'text-gray-700'}">+${a.xp} XP</p></div>
                        ${u?'<span class="text-2xl">✓</span>':''}
                    </div>
                </div>`}).join('')}</div>
            </div>
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-4">✨ How to Gain Achievements</h2>
                <div class="space-y-3">
                    <div class="flex gap-3 bg-white/10 p-3 rounded-lg"><span class="text-2xl">📝</span><div><p class="text-white font-semibold">Complete Habits</p><p class="text-sm text-white/70">Check off daily quests to earn XP</p></div></div>
                    <div class="flex gap-3 bg-white/10 p-3 rounded-lg"><span class="text-2xl">🔥</span><div><p class="text-white font-semibold">Build Streaks</p><p class="text-sm text-white/70">Complete habits consecutively</p></div></div>
                    <div class="flex gap-3 bg-white/10 p-3 rounded-lg"><span class="text-2xl">⬆️</span><div><p class="text-white font-semibold">Level Up</p><p class="text-sm text-white/70">Gain XP to level up paths</p></div></div>
                    <div class="flex gap-3 bg-white/10 p-3 rounded-lg"><span class="text-2xl">🎯</span><div><p class="text-white font-semibold">Create Milestones</p><p class="text-sm text-white/70">Build your roadmaps</p></div></div>
                </div>
            </div>
        </div>`;
    } else if (currentView === 'tracker') {
        html = `<div class="space-y-6">
            <div class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 border-4 border-purple-500 shadow-2xl"><h1 class="text-3xl font-bold text-white">🛡️ Daily Quest Log</h1></div>
            ${Object.entries(gameData.paths).map(([pk,p])=>{const ph=gameData.dailyHabits.filter(h=>h.pathKey===pk);return ph.length===0?'':`<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-4 ${p.border} shadow-xl">
                <div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl border-2 border-white/20">${p.icon}</div><h2 class="text-2xl font-bold text-white">${p.name} Quests</h2></div>
                <div class="space-y-3">${ph.map(h=>{const ic=gameData.completedToday.includes(h.id);const s=gameData.streaks[h.id]||0;return`<div class="flex items-center gap-3 p-4 rounded-lg border-2 ${ic?'bg-green-900/30 border-green-500':'bg-black/20 border-white/20'}">
                    <button onclick="toggleHabit(${h.id})" class="w-8 h-8 rounded-lg border-2 flex items-center justify-center ${ic?'bg-green-500 border-green-400':'border-white/30'}">${ic?'✓':''}</button>
                    <p class="flex-1 font-semibold text-lg ${ic?'line-through text-white/50':'text-white'}">${h.name}</p>
                    ${s>0?`<div class="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full border-2 border-yellow-400"><span class="text-lg">🔥</span><span class="font-bold text-white">${s}</span></div>`:''}
                    <button onclick="deleteHabit(${h.id})" class="p-2 hover:bg-red-900/50 rounded-lg text-red-400">🗑️</button>
                </div>`}).join('')}</div>
            </div>`}).join('')}
            ${gameData.dailyHabits.length===0?'<div class="text-center py-16 bg-slate-900/50 rounded-xl border-2 border-dashed border-purple-500/30"><p class="text-6xl mb-4">🎯</p><p class="text-white/70 text-lg">No quests yet!</p><p class="text-white/50">Create habits from roadmaps</p></div>':''}
        </div>`;
    } else if (currentView === 'roadmap' && selectedPath) {
        const path = gameData.paths[selectedPath];
        const roadmap = gameData.roadmaps[selectedPath];
        html = `<div class="space-y-6">
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-4 ${path.border} shadow-2xl">
                <div class="flex items-center gap-4 mb-4 flex-wrap">
                    <div class="w-20 h-20 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-4xl border-2 border-white/20">${path.icon}</div>
                    <div class="flex-1"><h1 class="text-4xl font-bold text-white">${path.name}</h1><p class="text-purple-300 text-lg">Level ${path.level} • ${path.xp}/${path.maxXp} XP</p></div>
                </div>
                <div class="w-full bg-black/40 rounded-full h-4 border-2 border-white/20"><div class="h-4 bg-gradient-to-r ${path.color} rounded-full" style="width:${(path.xp/path.maxXp)*100}%"></div></div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border-2 border-purple-500 shadow-xl">
                <h3 class="font-bold text-white mb-3 text-lg">➕ Create New Milestone</h3>
                <button onclick="addMilestone('${selectedPath}')" class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-2xl">Add Milestone</button>
            </div>
            ${roadmap.map((m,i)=>`<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-indigo-500 shadow-xl">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3 flex-1"><div class="w-10 h-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center text-white font-bold text-xl border-2 border-white/20">${i+1}</div><h3 class="text-xl font-bold text-white">${m.name}</h3></div>
                    <button onclick="deleteMilestone('${selectedPath}',${m.id})" class="p-2 hover:bg-red-900/50 rounded-lg text-red-400">🗑️</button>
                </div>
                <div class="ml-8 space-y-3">
                    ${m.challenges.map(c=>`<div class="border-l-4 border-purple-500 pl-4 bg-black/20 rounded-r-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <h4 class="font-semibold text-white">⚔️ ${c.name}</h4>
                            <button onclick="deleteChallenge('${selectedPath}',${m.id},${c.id})" class="p-1 hover:bg-red-900/50 rounded text-red-400 text-sm">🗑️</button>
                        </div>
                        <div class="ml-6 space-y-1">${c.habits.map(h=>`<div class="text-sm text-cyan-300">✓ ${h.name}</div>`).join('')}</div>
                        <button onclick="addHabit('${selectedPath}',${m.id},${c.id})" class="text-sm text-cyan-400 hover:text-cyan-300 mt-2">+ Add quest</button>
                    </div>`).join('')}
                    <button onclick="addChallenge('${selectedPath}',${m.id})" class="text-sm text-purple-400 hover:text-purple-300 font-semibold">+ Add challenge</button>
                </div>
            </div>`).join('')}
            ${roadmap.length===0?'<div class="text-center py-16 bg-slate-900/50 rounded-xl border-2 border-dashed border-purple-500/30"><p class="text-6xl mb-4">🎯</p><p class="text-white/70 text-lg">No milestones yet!</p><p class="text-white/50">Create your first milestone above</p></div>':''}
        </div>`;
    }
    
    document.getElementById('app').innerHTML = html;
}

loadData();
render();
