const passwords = ['B@nner24!', '6', 'B1gBlu3Dog$20', '73USQN4YQ4Y6CA', 'Sh4r3d', 'Lim3wir3', 'Confidentiality', 'ISEEYOU', 'C1TS', '1Z093A4A0379647014'];
const traps = {
    'Zer0Trust': 'Virus detected in USB! System lockdown initiated.',
    'Fr33_net': 'Suspicious WIFI Detected! Network lockout engaged.',
    'password123': 'Weak password detected! Account temporarily suspended.',
    'http://h3lp.me': 'Malicious website! Browser lockdown initiated.',
    '6195638': 'Suspicous contact found! Calls blocked.',
    'Ch34tc0de!': 'Malicious data found! Firewall activated.'
};
let startTime;
let trapCount = 0;
let remainingPasswords = [...passwords];
let timeRemaining = 30 * 60; // 30 minutes in seconds
let timerInterval;
let gameStarted = false;
let inputLocked = false;
let statusMessages = [];

const startButton = document.getElementById('startButton');
const instructionsDiv = document.getElementById('instructions');
const gameDiv = document.getElementById('game');
const endScreenDiv = document.getElementById('endScreen');
const timerDiv = document.getElementById('timer');
const progressTextDiv = document.getElementById('progressText');
const progressBarDiv = document.getElementById('progressBar');
const passwordInput = document.getElementById('passwordInput');
const outputDiv = document.getElementById('output');
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');
const trapSound = document.getElementById('trapSound');
const statusMessagesDiv = document.getElementById('statusMessages');
const maxStatusMessages = 5;
const finishSound = document.getElementById('finishSound');
const gameOverSound = document.getElementById('gameOverSound');

startButton.addEventListener('click', startGame);
passwordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
});

function generateAsciiBackground() {
    const asciiChars = '!@#$%^&*()_+-={}[]|\\:;"\'<>,.?/~`';
    const backgroundDiv = document.getElementById('ascii-background');
    const width = Math.ceil(window.innerWidth / 12);
    const height = Math.ceil(window.innerHeight / 2);
    
    let backgroundText = '';
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            backgroundText += asciiChars[Math.floor(Math.random() * asciiChars.length)];
        }
        backgroundText += '\n';
    }
    
    backgroundDiv.textContent = backgroundText;
}

// Call this function when the window loads and resizes
window.addEventListener('load', generateAsciiBackground);
window.addEventListener('resize', generateAsciiBackground);

// The rest of your JavaScript code remains the same

function startGame() {
    gameStarted = true;
    startTime = Date.now();
    trapCount = 0;
    instructionsDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    startTimer();
    passwordInput.focus();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimer();
        if (timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDiv.textContent = timeString;

    // Check if less than 1 minute remains
    if (timeRemaining < 60) {
        timerDiv.classList.add('timer-warning');
    } else {
        timerDiv.classList.remove('timer-warning');
    }
}

function addStatusMessage(message, type) {
    let colorClass = '';
    switch(type) {
        case 'correct':
            colorClass = 'status-correct';
            break;
        case 'incorrect':
            colorClass = 'status-incorrect';
            break;
        case 'trap':
            colorClass = 'status-trap';
            break;
        default:
            colorClass = '';
    }
    
    statusMessages.push(`<span class="${colorClass}">${message}</span>`);
    if (statusMessages.length > maxStatusMessages) {
        statusMessages.shift(); // Remove the oldest message
    }
    updateStatusMessagesDisplay();
}

function updateStatusMessagesDisplay() {
    statusMessagesDiv.innerHTML = statusMessages.map(msg => `${msg}<br>`).join('');
    statusMessagesDiv.scrollTop = statusMessagesDiv.scrollHeight; // Auto-scroll to the bottom
}

function checkPassword() {
    if (inputLocked) {
        addStatusMessage("Input is locked. Please wait.");
        return;
    }

    const input = passwordInput.value;
    passwordInput.value = '';

    if (remainingPasswords.includes(input)) {
        successSound.play();
        remainingPasswords = remainingPasswords.filter(pw => pw !== input);
        addStatusMessage(`Correct clue: ${input}`, 'correct');
        updateProgress();
        if (remainingPasswords.length === 0) {
            endGame(true);
        }
    } else if (input in traps) {
        trapSound.play();
        addStatusMessage(`TRAP ACTIVATED: ${traps[input]}`, 'trap');
        trapCount++;
        lockoutInput();
    } else {
        failSound.play();
        addStatusMessage(`Incorrect clue: ${input}`, 'incorrect');
    }
}

function lockoutInput() {
    inputLocked = true;
    passwordInput.disabled = true;
    addStatusMessage("System locked for 30 seconds.", 'trap');
    
    setTimeout(() => {
        inputLocked = false;
        passwordInput.disabled = false;
        addStatusMessage("Lockout ended. System restored.");
	passwordInput.focus();
    }, 30000);
}

function updateProgress() {
    const solved = passwords.length - remainingPasswords.length;
    progressTextDiv.textContent = `Progress: ${solved}/${passwords.length}`;
    
    // Update ASCII progress bar
    const progressBarLength = 10; // Increased from 10 to 20 for better visibility
    const filledLength = Math.round((solved / passwords.length) * progressBarLength);
    const emptyLength = progressBarLength - filledLength;
    
    const filledBar = '█'.repeat(filledLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    progressBarDiv.textContent = `${filledBar}${emptyBar}`;
}

function endGame(success) {
    clearInterval(timerInterval);
    gameDiv.style.display = 'none';
    endScreenDiv.style.display = 'block';

    const endTime = Date.now();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const solvedPasswords = passwords.length - remainingPasswords.length;

    const endScreenTitle = document.getElementById('endScreenTitle');
    const endScreenContent = document.getElementById('endScreenContent');

    if (success) {
        finishSound.play();
        endScreenTitle.textContent = '🏆 Congratulations! 🏆';
        endScreenTitle.className = 'success';
        endScreenContent.innerHTML = `
            <p>You have successfully entered all the codes and deactivated the ransomware.</p>
            <p>The Cyb3rGh0$t Syndicate has been defeated and the organization is safe...for now.</p>
            <p>Total time taken: ${minutes} minutes and ${seconds} seconds</p>
            <p>Number of traps activated: ${trapCount}</p>
        `;
    } else {
        gameOverSound.play();
        endScreenTitle.textContent = ' Time\'s up!';
        endScreenTitle.className = 'failure';
        endScreenContent.innerHTML = `
            <h2>☠ Note from The Cyb3rGh0$t Syndicate ☠</h2>
            <p>You failed to enter all the codes in time.</p>
            <p>We have exfiltrated your data to the dark web.</p>
            <p>Better luck next time!</p>
            <p>Progress: ${solvedPasswords}/${passwords.length} clues solved</p>
            <p>Number of traps activated: ${trapCount}</p>
        `;
    }
}

document.querySelector('.terminal-button.close').addEventListener('click', () => {
    if (confirm('Ch34tc0de!')) {
        //window.close();
    }
});

window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
});

document.onkeydown = function(e) {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
        alert('Refreshing is disabled for this game.');
        return false;
    }
};
