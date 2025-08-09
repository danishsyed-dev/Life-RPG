// Life RPG Application JavaScript

class LifeRPG {
    constructor() {
        // Game data
        this.gameData = {
            questCategories: [
                "Health & Fitness",
                "Learning & Education", 
                "Productivity & Work",
                "Social & Relationships",
                "Creative & Hobbies",
                "Mindfulness & Wellness"
            ],
            presetQuests: {
                daily: [
                    {"name": "Morning Exercise", "category": "Health & Fitness", "xp": 20, "description": "Complete 30 minutes of physical activity"},
                    {"name": "Read for 30 minutes", "category": "Learning & Education", "xp": 15, "description": "Read educational content or books"},
                    {"name": "Meditation", "category": "Mindfulness & Wellness", "xp": 10, "description": "Practice mindfulness or meditation for 10+ minutes"},
                    {"name": "Healthy Meal", "category": "Health & Fitness", "xp": 10, "description": "Prepare and eat a nutritious meal"},
                    {"name": "Learn New Skill", "category": "Learning & Education", "xp": 25, "description": "Practice a new skill for 1 hour"},
                    {"name": "Social Connection", "category": "Social & Relationships", "xp": 15, "description": "Have meaningful conversation with friend/family"}
                ],
                main: [
                    {"name": "Complete Online Course", "category": "Learning & Education", "xp": 500, "description": "Finish an entire online course or certification"},
                    {"name": "Fitness Goal Achievement", "category": "Health & Fitness", "xp": 400, "description": "Reach a specific fitness milestone (run 5k, lift goal weight, etc.)"},
                    {"name": "Creative Project", "category": "Creative & Hobbies", "xp": 350, "description": "Complete a significant creative project (art, music, writing)"},
                    {"name": "Career Advancement", "category": "Productivity & Work", "xp": 600, "description": "Get promotion, new job, or complete major work project"}
                ],
                side: [
                    {"name": "Try New Recipe", "category": "Creative & Hobbies", "xp": 30, "description": "Cook a new dish you've never made before"},
                    {"name": "Random Act of Kindness", "category": "Social & Relationships", "xp": 20, "description": "Do something kind for someone without expecting anything back"},
                    {"name": "Organize Living Space", "category": "Productivity & Work", "xp": 25, "description": "Clean and organize a room or area of your home"},
                    {"name": "Nature Walk", "category": "Mindfulness & Wellness", "xp": 15, "description": "Spend time outdoors appreciating nature"}
                ]
            },
            achievements: [
                {"name": "First Steps", "description": "Complete your first quest", "xp": 0, "id": "first-quest"},
                {"name": "Consistency Champion", "description": "Complete daily quests for 7 days straight", "xp": 100, "id": "seven-day-streak"},
                {"name": "Scholar", "description": "Gain 100 Intelligence XP", "xp": 50, "id": "intelligence-100"},
                {"name": "Social Butterfly", "description": "Complete 10 social quests", "xp": 75, "id": "social-10"},
                {"name": "Master of Habits", "description": "Maintain a 30-day streak", "xp": 200, "id": "thirty-day-streak"},
                {"name": "Level 10 Hero", "description": "Reach character level 10", "xp": 150, "id": "level-10"}
            ]
        };

        // Character state
        this.character = {
            name: "Hero",
            avatar: "🧙‍♂️",
            level: 1,
            totalXP: 0,
            currentXP: 0,
            xpToNextLevel: 100,
            stats: {
                strength: { level: 1, xp: 0, xpToNext: 50 },
                intelligence: { level: 1, xp: 0, xpToNext: 50 },
                charisma: { level: 1, xp: 0, xpToNext: 50 },
                wisdom: { level: 1, xp: 0, xpToNext: 50 },
                dexterity: { level: 1, xp: 0, xpToNext: 50 }
            }
        };

        // Game state
        this.gameState = {
            todayXP: 0,
            currentStreak: 0,
            questsCompleted: 0,
            lastLoginDate: new Date().toDateString(),
            completedQuests: new Set(),
            unlockedAchievements: new Set(),
            activeQuests: {
                daily: [],
                main: [],
                side: []
            },
            customQuests: []
        };

        // Stat to category mapping
        this.statCategories = {
            "Health & Fitness": "strength",
            "Learning & Education": "intelligence",
            "Social & Relationships": "charisma",
            "Mindfulness & Wellness": "wisdom",
            "Creative & Hobbies": "dexterity",
            "Productivity & Work": "dexterity"
        };

        this.avatars = ["🧙‍♂️", "🧙‍♀️", "🦸‍♂️", "🦸‍♀️", "🥷", "🧚‍♂️", "🧚‍♀️", "🧝‍♂️", "🧝‍♀️", "👑"];
        this.currentAvatarIndex = 0;
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.setupEventListeners();
        this.generateDailyQuests();
        this.setupMainQuests();
        this.setupSideQuests();
        this.updateUI();
        this.renderAchievements();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Character name update
        const characterNameInput = document.getElementById('character-name');
        if (characterNameInput) {
            characterNameInput.addEventListener('input', (e) => {
                this.character.name = e.target.value || "Hero";
                this.updateUI();
            });
        }

        // Avatar change
        const changeAvatarBtn = document.getElementById('change-avatar');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                this.changeAvatar();
            });
        }

        // Refresh daily quests
        const refreshBtn = document.getElementById('refresh-daily-quests');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.generateDailyQuests();
            });
        }

        // Custom quest creation
        const createQuestBtn = document.getElementById('create-custom-quest');
        if (createQuestBtn) {
            createQuestBtn.addEventListener('click', () => {
                this.createCustomQuest();
            });
        }

        // Modal close buttons
        const closeLevelUpBtn = document.getElementById('close-level-up');
        if (closeLevelUpBtn) {
            closeLevelUpBtn.addEventListener('click', () => {
                this.hideModal('level-up-modal');
            });
        }

        const closeAchievementBtn = document.getElementById('close-achievement');
        if (closeAchievementBtn) {
            closeAchievementBtn.addEventListener('click', () => {
                this.hideModal('achievement-modal');
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    changeAvatar() {
        this.currentAvatarIndex = (this.currentAvatarIndex + 1) % this.avatars.length;
        this.character.avatar = this.avatars[this.currentAvatarIndex];
        const avatarElement = document.getElementById('character-avatar');
        if (avatarElement) {
            avatarElement.textContent = this.character.avatar;
        }
    }

    generateDailyQuests() {
        // Clear existing completed quests from today's selection
        this.gameState.completedQuests.clear();
        
        // Select 3 random daily quests
        const shuffled = [...this.gameData.presetQuests.daily].sort(() => 0.5 - Math.random());
        this.gameState.activeQuests.daily = shuffled.slice(0, 3).map((quest, index) => ({
            ...quest,
            id: `daily-${index}-${Date.now()}`,
            completed: false,
            type: 'daily'
        }));
        
        this.renderQuests();
        this.updateUI();
    }

    setupMainQuests() {
        this.gameState.activeQuests.main = this.gameData.presetQuests.main.map((quest, index) => ({
            ...quest,
            id: `main-${index}`,
            completed: false,
            type: 'main'
        }));
        this.renderQuests();
    }

    setupSideQuests() {
        this.gameState.activeQuests.side = this.gameData.presetQuests.side.map((quest, index) => ({
            ...quest,
            id: `side-${index}`,
            completed: false,
            type: 'side'
        }));
        this.renderQuests();
    }

    createCustomQuest() {
        const name = document.getElementById('custom-quest-name').value.trim();
        const description = document.getElementById('custom-quest-description').value.trim();
        const category = document.getElementById('custom-quest-category').value;
        const xp = parseInt(document.getElementById('custom-quest-xp').value) || 10;
        const type = document.getElementById('custom-quest-type').value;

        if (!name || !description) {
            alert('Please fill in quest name and description');
            return;
        }

        const customQuest = {
            name,
            description,
            category,
            xp: Math.max(5, Math.min(100, xp)),
            id: `custom-${Date.now()}`,
            completed: false,
            type,
            custom: true
        };

        this.gameState.activeQuests[type].push(customQuest);
        this.gameState.customQuests.push(customQuest);

        // Clear form
        document.getElementById('custom-quest-name').value = '';
        document.getElementById('custom-quest-description').value = '';
        document.getElementById('custom-quest-xp').value = '';

        this.renderQuests();
    }

    completeQuest(questId) {
        let completedQuest = null;
        
        // Find the quest in active quests
        for (const type of ['daily', 'main', 'side']) {
            const quest = this.gameState.activeQuests[type].find(q => q.id === questId);
            if (quest && !quest.completed) {
                quest.completed = true;
                completedQuest = quest;
                this.gameState.completedQuests.add(questId);
                break;
            }
        }

        if (completedQuest) {
            this.awardXP(completedQuest.xp, completedQuest.category);
            this.gameState.questsCompleted++;
            this.gameState.todayXP += completedQuest.xp;
            
            // Update streak (simplified - would normally check actual dates)
            this.gameState.currentStreak = Math.max(1, this.gameState.currentStreak + 1);
            
            this.checkAchievements();
            this.renderQuests();
            this.updateUI();
            
            // Show success message
            this.showQuestCompletionFeedback(completedQuest);
        }
    }

    showQuestCompletionFeedback(quest) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'quest-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: var(--color-success); color: white; padding: 16px; border-radius: 8px; box-shadow: var(--shadow-lg); z-index: 1001;">
                ✅ Quest Complete! +${quest.xp} XP
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    awardXP(xp, category) {
        // Award total XP
        this.character.totalXP += xp;
        this.character.currentXP += xp;

        // Award stat-specific XP
        const statName = this.statCategories[category] || 'dexterity';
        this.character.stats[statName].xp += Math.floor(xp * 0.5);

        // Check for character level up
        this.checkLevelUp();

        // Check for stat level ups
        this.checkStatLevelUps();
    }

    checkLevelUp() {
        while (this.character.currentXP >= this.character.xpToNextLevel) {
            this.character.currentXP -= this.character.xpToNextLevel;
            this.character.level++;
            this.character.xpToNextLevel = Math.floor(100 * Math.pow(this.character.level, 1.5));
            
            // Award stat increases
            const statIncreases = [];
            for (const statName in this.character.stats) {
                const increase = 2;
                this.character.stats[statName].level += increase;
                statIncreases.push(`${this.capitalize(statName)} +${increase}`);
            }
            
            this.showLevelUpModal(this.character.level, statIncreases);
        }
    }

    checkStatLevelUps() {
        for (const statName in this.character.stats) {
            const stat = this.character.stats[statName];
            while (stat.xp >= stat.xpToNext) {
                stat.xp -= stat.xpToNext;
                stat.level++;
                stat.xpToNext = Math.floor(50 * Math.pow(stat.level, 1.2));
            }
        }
    }

    checkAchievements() {
        const achievements = this.gameData.achievements;
        
        achievements.forEach(achievement => {
            if (this.gameState.unlockedAchievements.has(achievement.id)) return;
            
            let unlocked = false;
            
            switch (achievement.id) {
                case 'first-quest':
                    unlocked = this.gameState.questsCompleted >= 1;
                    break;
                case 'seven-day-streak':
                    unlocked = this.gameState.currentStreak >= 7;
                    break;
                case 'intelligence-100':
                    unlocked = this.character.stats.intelligence.xp >= 100;
                    break;
                case 'social-10':
                    const socialQuests = Array.from(this.gameState.completedQuests).filter(id => {
                        for (const type of ['daily', 'main', 'side']) {
                            const quest = this.gameState.activeQuests[type].find(q => q.id === id);
                            if (quest && quest.category === 'Social & Relationships') return true;
                        }
                        return false;
                    }).length;
                    unlocked = socialQuests >= 10;
                    break;
                case 'thirty-day-streak':
                    unlocked = this.gameState.currentStreak >= 30;
                    break;
                case 'level-10':
                    unlocked = this.character.level >= 10;
                    break;
            }
            
            if (unlocked) {
                this.gameState.unlockedAchievements.add(achievement.id);
                this.showAchievementModal(achievement);
                if (achievement.xp > 0) {
                    this.awardXP(achievement.xp, 'Mindfulness & Wellness');
                }
            }
        });
        
        this.renderAchievements();
    }

    showLevelUpModal(newLevel, statIncreases) {
        const newLevelElement = document.getElementById('new-level');
        const statList = document.getElementById('stat-increases');
        
        if (newLevelElement) newLevelElement.textContent = newLevel;
        if (statList) statList.innerHTML = statIncreases.map(stat => `<li>${stat}</li>`).join('');
        
        this.showModal('level-up-modal');
    }

    showAchievementModal(achievement) {
        const nameElement = document.getElementById('achievement-name');
        const descElement = document.getElementById('achievement-description');
        const xpElement = document.getElementById('achievement-xp');
        
        if (nameElement) nameElement.textContent = achievement.name;
        if (descElement) descElement.textContent = achievement.description;
        if (xpElement) xpElement.textContent = achievement.xp;
        
        this.showModal('achievement-modal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    renderQuests() {
        this.renderQuestList('daily-quest-list', this.gameState.activeQuests.daily.slice(0, 3));
        this.renderQuestList('all-daily-quests', this.gameState.activeQuests.daily);
        this.renderQuestList('main-quests', this.gameState.activeQuests.main);
        this.renderQuestList('side-quests', this.gameState.activeQuests.side);
    }

    renderQuestList(containerId, quests) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = quests.map(quest => `
            <div class="quest-item ${quest.completed ? 'completed' : ''}">
                <div class="quest-header">
                    <h4 class="quest-title">${quest.name}</h4>
                    <span class="quest-xp">+${quest.xp} XP</span>
                </div>
                <span class="quest-category">${quest.category}</span>
                <p class="quest-description">${quest.description}</p>
                <div class="quest-actions">
                    ${quest.completed ? 
                        '<span class="quest-completed-check">✅ Completed!</span>' : 
                        `<button class="btn btn--primary btn--sm quest-complete-btn" onclick="window.lifeRPG.completeQuest('${quest.id}')">Complete Quest</button>`
                    }
                </div>
            </div>
        `).join('');
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;
        
        container.innerHTML = this.gameData.achievements.map(achievement => {
            const isUnlocked = this.gameState.unlockedAchievements.has(achievement.id);
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    ${achievement.xp > 0 ? `<span class="achievement-reward">+${achievement.xp} XP</span>` : ''}
                </div>
            `;
        }).join('');
    }

    updateUI() {
        // Update header
        const userLevelElement = document.getElementById('user-level');
        const characterLevelElement = document.getElementById('character-level');
        const totalXpElement = document.getElementById('total-xp');
        
        if (userLevelElement) userLevelElement.textContent = this.character.level;
        if (characterLevelElement) characterLevelElement.textContent = this.character.level;
        if (totalXpElement) totalXpElement.textContent = this.character.totalXP;
        
        // Update XP bar
        const xpProgress = (this.character.currentXP / this.character.xpToNextLevel) * 100;
        const xpProgressElement = document.getElementById('xp-progress');
        const xpTextElement = document.getElementById('xp-text');
        
        if (xpProgressElement) xpProgressElement.style.width = `${xpProgress}%`;
        if (xpTextElement) xpTextElement.textContent = `${this.character.currentXP} / ${this.character.xpToNextLevel} XP`;

        // Update character info
        const characterNameElement = document.getElementById('character-name');
        const characterAvatarElement = document.getElementById('character-avatar');
        
        if (characterNameElement && characterNameElement.value !== this.character.name) {
            characterNameElement.value = this.character.name;
        }
        if (characterAvatarElement) {
            characterAvatarElement.textContent = this.character.avatar;
        }

        // Update stats
        for (const statName in this.character.stats) {
            const stat = this.character.stats[statName];
            const statProgress = (stat.xp / stat.xpToNext) * 100;
            const levelElement = document.getElementById(`${statName}-level`);
            const progressElement = document.getElementById(`${statName}-progress`);
            
            if (levelElement) levelElement.textContent = stat.level;
            if (progressElement) progressElement.style.width = `${statProgress}%`;
        }

        // Update quick stats
        const todayXpElement = document.getElementById('today-xp');
        const currentStreakElement = document.getElementById('current-streak');
        const questsCompleteElement = document.getElementById('quests-complete');
        
        if (todayXpElement) todayXpElement.textContent = this.gameState.todayXP;
        if (currentStreakElement) currentStreakElement.textContent = `${this.gameState.currentStreak} days`;
        if (questsCompleteElement) questsCompleteElement.textContent = this.gameState.questsCompleted;

        // Update progress bars
        const completedMain = this.gameState.activeQuests.main.filter(q => q.completed).length;
        const totalMain = this.gameState.activeQuests.main.length;
        const mainProgress = totalMain > 0 ? (completedMain / totalMain) * 100 : 0;
        const mainProgressElement = document.getElementById('main-quest-progress');
        const mainTextElement = document.getElementById('main-quest-text');
        
        if (mainProgressElement) mainProgressElement.style.width = `${mainProgress}%`;
        if (mainTextElement) mainTextElement.textContent = `${completedMain}/${totalMain}`;

        const unlockedAchievements = this.gameState.unlockedAchievements.size;
        const totalAchievements = this.gameData.achievements.length;
        const achievementProgress = (unlockedAchievements / totalAchievements) * 100;
        const achievementProgressElement = document.getElementById('achievement-progress');
        const achievementTextElement = document.getElementById('achievement-text');
        
        if (achievementProgressElement) achievementProgressElement.style.width = `${achievementProgress}%`;
        if (achievementTextElement) achievementTextElement.textContent = `${unlockedAchievements}/${totalAchievements}`;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the application when DOM is ready
const lifeRPG = new LifeRPG();
lifeRPG.init();

// Expose globally for onclick handlers
window.lifeRPG = lifeRPG;