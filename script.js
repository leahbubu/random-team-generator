// Team name generation data
const adjectives = [
    'Thunder', 'Lightning', 'Cosmic', 'Stellar', 'Quantum', 'Mystic', 'Phoenix',
    'Dragon', 'Shadow', 'Crystal', 'Blazing', 'Arctic', 'Neon', 'Cyber', 'Titanium',
    'Golden', 'Silver', 'Emerald', 'Sapphire', 'Ruby', 'Ninja', 'Samurai', 'Warrior',
    'Phantom', 'Vortex', 'Eclipse', 'Nova', 'Meteor', 'Comet', 'Nebula', 'Galaxy',
    'Atomic', 'Electric', 'Magnetic', 'Sonic', 'Turbo', 'Hyper', 'Ultra', 'Mega',
    'Alpha', 'Omega', 'Prime', 'Elite', 'Supreme', 'Royal', 'Imperial', 'Legendary'
];

const nouns = [
    'Hawks', 'Eagles', 'Falcons', 'Dragons', 'Tigers', 'Lions', 'Panthers', 'Wolves',
    'Bears', 'Sharks', 'Dolphins', 'Phoenixes', 'Griffins', 'Unicorns', 'Ninjas',
    'Warriors', 'Knights', 'Guardians', 'Defenders', 'Champions', 'Titans', 'Giants',
    'Spartans', 'Vikings', 'Pirates', 'Rangers', 'Hunters', 'Strikers', 'Blazers',
    'Rockets', 'Comets', 'Stars', 'Meteors', 'Thunders', 'Storms', 'Cyclones',
    'Hurricanes', 'Tornadoes', 'Avalanches', 'Tsunamis', 'Legends', 'Heroes', 'Mavericks',
    'Rebels', 'Renegades', 'Outlaws', 'Bandits', 'Crusaders', 'Conquerors', 'Emperors'
];

// DOM Elements
const membersInput = document.getElementById('members-input');
const teamCountInput = document.getElementById('team-count');
const teamNamesToggle = document.getElementById('team-names-toggle');
const generateBtn = document.getElementById('generate-btn');
const resultsSection = document.getElementById('results-section');
const teamsContainer = document.getElementById('teams-container');
const copyBtn = document.getElementById('copy-btn');

// Load saved preferences
function loadPreferences() {
    const savedToggle = localStorage.getItem('teamNamesEnabled');
    if (savedToggle !== null) {
        teamNamesToggle.checked = savedToggle === 'true';
    }
}

// Save preferences
function savePreferences() {
    localStorage.setItem('teamNamesEnabled', teamNamesToggle.checked);
}

// Generate random team name
function generateTeamName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective} ${noun}`;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate teams
function generateTeams() {
    // Get and validate input
    const membersText = membersInput.value.trim();
    if (!membersText) {
        alert('Please enter at least one team member!');
        membersInput.focus();
        return;
    }

    const members = membersText
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

    if (members.length === 0) {
        alert('Please enter at least one team member!');
        membersInput.focus();
        return;
    }

    const teamCount = parseInt(teamCountInput.value);
    if (teamCount < 2 || teamCount > members.length) {
        alert(`Please enter a valid number of teams (2-${members.length})!`);
        teamCountInput.focus();
        return;
    }

    // Shuffle members
    const shuffledMembers = shuffleArray(members);

    // Distribute members into teams
    const teams = Array.from({ length: teamCount }, () => []);
    shuffledMembers.forEach((member, index) => {
        teams[index % teamCount].push(member);
    });

    // Generate team names if enabled
    const useTeamNames = teamNamesToggle.checked;
    const teamNames = useTeamNames
        ? Array.from({ length: teamCount }, () => generateTeamName())
        : Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`);

    // Display teams
    displayTeams(teams, teamNames);
}

// Display teams
function displayTeams(teams, teamNames) {
    teamsContainer.innerHTML = '';

    teams.forEach((members, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.style.animationDelay = `${index * 0.1}s`;

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';

        const teamName = document.createElement('h3');
        teamName.className = 'team-name';
        teamName.textContent = teamNames[index];

        const teamCount = document.createElement('p');
        teamCount.className = 'team-count';
        teamCount.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;

        teamHeader.appendChild(teamName);
        teamHeader.appendChild(teamCount);

        const membersList = document.createElement('ul');
        membersList.className = 'team-members';

        members.forEach(member => {
            const memberItem = document.createElement('li');
            memberItem.className = 'team-member';
            memberItem.textContent = member;
            membersList.appendChild(memberItem);
        });

        teamCard.appendChild(teamHeader);
        teamCard.appendChild(membersList);
        teamsContainer.appendChild(teamCard);
    });

    resultsSection.classList.remove('hidden');

    // Scroll to results with a small delay to ensure DOM is updated
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Copy all teams to clipboard
function copyAllTeams() {
    const teamCards = document.querySelectorAll('.team-card');
    let text = '';

    teamCards.forEach((card, index) => {
        const teamName = card.querySelector('.team-name').textContent;
        const members = Array.from(card.querySelectorAll('.team-member'))
            .map(m => m.textContent)
            .join('\n');

        text += `${teamName}\n${members}\n`;
        if (index < teamCards.length - 1) {
            text += '\n';
        }
    });

    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.querySelector('.btn-text').textContent;
        copyBtn.querySelector('.btn-text').textContent = 'Copied!';
        copyBtn.querySelector('.btn-icon').textContent = '✓';

        setTimeout(() => {
            copyBtn.querySelector('.btn-text').textContent = originalText;
            copyBtn.querySelector('.btn-icon').textContent = '📋';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard. Please try again.');
        console.error('Copy failed:', err);
    });
}

// Event listeners
generateBtn.addEventListener('click', generateTeams);
copyBtn.addEventListener('click', copyAllTeams);
teamNamesToggle.addEventListener('change', savePreferences);

// Allow Enter key in textarea (Shift+Enter for new line)
membersInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        generateTeams();
    }
});

// Allow Enter key on team count input
teamCountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        generateTeams();
    }
});

// Initialize
loadPreferences();

// Detect embed mode from URL parameter
function detectEmbedMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('embed') === 'true') {
        document.body.classList.add('embed-mode');
    }
}

detectEmbedMode();
