// =======================
// GAME DATA
// =======================
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

// =======================
// ACHIEVEMENTS
// =======================
const achievements = [
    { id: 'first_step', name: 'First Steps', desc: 'Complete your first habit', icon: '🌟', xp: 50 },
    { id: 'week_warrior', name: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '⚔️', xp: 200 },
    { id: 'level_five', name: 'Rising Hero', desc: 'Reach level 5 in any path', icon: '🛡️', xp: 300 },
    { id: 'all_paths', name: 'Renaissance Soul', desc: 'Have at least 1 habit in all 4 paths', icon: '✨', xp: 500 },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete all habits in one day', icon: '💎', xp: 250 },
    { id: 'milestone_master', name: 'Milestone Master', desc: 'Create 10 milestones', icon: '🏆', xp: 400 },
    { id: 'month_legend', name: 'Legendary Streak', desc: 'Maintain a 30-day streak', icon: '🔥', xp: 1000 },
    { id: 'ten_levels', name: 'Master of Craft', desc: 'Reach level 10 in any path', icon: '👑', xp: 750 }
];

// =======================
let currentView = 'dashboard';
let selectedPath = null;

// =======================
// SAVE / LOAD
// =======================
function loadData() {
    const saved = localStorage.getItem('projectMargoData');
    if (saved) gameData = JSON.parse(saved);
}

function saveData() {
    localStorage.setItem('projectMargoData', JSON.stringify(gameData));
    checkAchievements();
}

// =======================
// ACHIEVEMENTS LOGIC
// =======================
function checkAchievements() {
    achievements.forEach(a => {
        if (!gameData.achievements.includes(a.id)) {
            let unlocked = false;
            switch (a.id) {
                case 'first_step': unlocked = gameData.completedToday.length >= 1; break;
                case 'week_warrior': unlocked = Object.values(gameData.streaks).some(s => s >= 7); break;
                case 'level_five': unlocked = Object.values(gameData.paths).some(p => p.level >= 5); break;
                case 'all_paths': unlocked = Object.keys(gameData.paths).every(k => gameData.dailyHabits.some(h => h.pathKey === k)); break;
                case 'perfectionist': unlocked = gameData.dailyHabits.length && gameData.completedToday.length === gameData.dailyHabits.length; break;
                case 'milestone_master': unlocked = Object.values(gameData.roadmaps).flat().length >= 10; break;
                case 'month_legend': unlocked = Object.values(gameData.streaks).some(s => s >= 30); break;
                case 'ten_levels': unlocked = Object.values(gameData.paths).some(p => p.level >= 10); break;
            }
            if (unlocked) {
                gameData.achievements.push(a.id);
                gameData.totalXP += a.xp;
                showAchievementPopup(a);
            }
        }
    });
}

function showAchievementPopup(a) {
    document.getElementById('achievement-icon').textContent = a.icon;
    document.getElementById('achievement-name').textContent = a.name;
    document.getElementById('achievement-xp').textContent = `+${a.xp} XP`;
    document.getElementById('achievement-popup').classList.remove('hidden');
    setTimeout(() => document.getElementById('achievement-popup').classList.add('hidden'), 3000);
}

// =======================
// XP / HABITS
// =======================
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

function toggleHabit(id) {
    const habit = gameData.dailyHabits.find(h => h.id === id);
    if (gameData.completedToday.includes(id)) {
        gameData.completedToday = gameData.completedToday.filter(x => x !== id);
        addXP(habit.pathKey, -10);
    } else {
        gameData.completedToday.push(id);
        gameData.streaks[id] = (gameData.streaks[id] || 0) + 1;
        addXP(habit.pathKey, 10 + Math.floor(gameData.streaks[id] / 7) * 10);
    }
}

// =======================
// ROADMAP CRUD
// =======================
function addMilestone(pathKey) {
    const name = prompt('Milestone name?');
    if (!name) return;
    gameData.roadmaps[pathKey].push({ id: Date.now(), name, challenges: [] });
    saveData(); render();
}

function addChallenge(pathKey, milestoneId) {
    const name = prompt('Challenge name?');
    if (!name) return;
    gameData.roadmaps[pathKey]
        .find(m => m.id === milestoneId)
        .challenges.push({ id: Date.now(), name, habits: [] });
    saveData(); render();
}

function addHabit(pathKey, milestoneId, challengeId) {
    const name = prompt('Quest name?');
    if (!name) return;
    const habit = { id: Date.now(), name, pathKey, milestoneId, challengeId };
    const milestone = gameData.roadmaps[pathKey].find(m => m.id === milestoneId);
    milestone.challenges.find(c => c.id === challengeId).habits.push(habit);
    gameData.dailyHabits.push(habit);
    gameData.streaks[habit.id] = 0;
    saveData(); render();
}

function deleteHabit(id) {
    if (!confirm('Delete quest?')) return;
    gameData.dailyHabits = gameData.dailyHabits.filter(h => h.id !== id);
    gameData.completedToday = gameData.completedToday.filter(x => x !== id);
    delete gameData.streaks[id];
    saveData(); render();
}

// =======================
// VIEW CONTROL
// =======================
function showView(v) {
    currentView = v;
    selectedPath = null;
    render();
}

function showRoadmap(pathKey) {
    selectedPath = pathKey;
    currentView = 'roadmap';
    render();
}

// =======================
// RENDER
// =======================
function render() {
    let html = `<div class="text-white text-xl">Rendering...</div>`;

    if (currentView === 'dashboard') {
        html = `<h1 class="text-4xl font-bold">Dashboard</h1>`;
    }

    if (currentView === 'tracker') {
        html = gameData.dailyHabits.map(h => `
            <div>
                <button onclick="toggleHabit(${h.id})">✔</button> ${h.name}
            </div>
        `).join('') || `<p>No quests yet</p>`;
    }

    if (currentView === 'roadmap' && selectedPath) {
        const r = gameData.roadmaps[selectedPath];
        html = `
            <h1 class="text-3xl">${gameData.paths[selectedPath].name}</h1>
            <button onclick="addMilestone('${selectedPath}')">Add Milestone</button>
            ${r.map(m => `
                <div>
                    <h3>${m.name}</h3>
                    <button onclick="addChallenge('${selectedPath}', ${m.id})">+ Challenge</button>
                    ${m.challenges.map(c => `
                        <div>
                            ${c.name}
                            <button onclick="addHabit('${selectedPath}', ${m.id}, ${c.id})">+ Quest</button>
                            ${c.habits.map(h => `<div>${h.name}</div>`).join('')}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        `;
    }

    document.getElementById('app').innerHTML = html;
}

// =======================
// INIT
// =======================
loadData();
render();
