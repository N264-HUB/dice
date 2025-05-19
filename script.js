class DiceGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.diceValues = [0, 0];
        this.currentTurnScore = 0;
        this.targetScore = 100;
        
        // DOM elements
        this.playerCountInput = document.getElementById('playerCount');
        this.startGameBtn = document.getElementById('startGame');
        this.rollDiceBtn = document.getElementById('rollDice');
        this.holdTurnBtn = document.getElementById('holdTurn');
        this.newGameBtn = document.getElementById('newGame');
        this.gameArea = document.querySelector('.game-area');
        this.playersContainer = document.getElementById('playersContainer');
        this.dice1 = document.getElementById('dice1');
        this.dice2 = document.getElementById('dice2');
        this.currentTurnScoreElement = document.getElementById('currentTurnScore');
        this.targetScoreElement = document.getElementById('targetScore');

        // Event listeners
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.rollDiceBtn.addEventListener('click', () => this.rollDice());
        this.holdTurnBtn.addEventListener('click', () => this.holdTurn());
        this.newGameBtn.addEventListener('click', () => this.resetGame());
    }

    startGame() {
        const playerCount = parseInt(this.playerCountInput.value);
        if (playerCount < 1 || playerCount > 4) {
            alert('Please select between 1 and 4 players');
            return;
        }

        this.players = Array(playerCount).fill(0);
        this.currentPlayerIndex = 0;
        this.gameStarted = true;
        this.gameArea.style.display = 'block';
        this.updatePlayerSections();
        this.updateActivePlayer();
        this.updateCurrentTurnScore(0);
    }

    updatePlayerSections() {
        this.playersContainer.innerHTML = '';
        this.players.forEach((score, index) => {
            const playerSection = document.createElement('div');
            playerSection.className = 'player-section';
            if (score >= this.targetScore) {
                playerSection.classList.add('winner');
            }
            playerSection.innerHTML = `
                <h3>Player ${index + 1}</h3>
                <div class="player-score">${score}</div>
            `;
            this.playersContainer.appendChild(playerSection);
        });
    }

    updateActivePlayer() {
        const playerSections = document.querySelectorAll('.player-section');
        playerSections.forEach((section, index) => {
            section.classList.toggle('active', index === this.currentPlayerIndex);
        });
    }

    updateCurrentTurnScore(score) {
        this.currentTurnScore = score;
        this.currentTurnScoreElement.textContent = score;
    }

    rollDice() {
        if (!this.gameStarted) return;

        // Add rolling animation
        this.dice1.classList.add('rolling');
        this.dice2.classList.add('rolling');

        // Roll two dice
        this.diceValues = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];

        // Update dice display after animation
        setTimeout(() => {
            this.dice1.textContent = this.getDiceSymbol(this.diceValues[0]);
            this.dice2.textContent = this.getDiceSymbol(this.diceValues[1]);
            this.dice1.classList.remove('rolling');
            this.dice2.classList.remove('rolling');

            // Check for snake eyes (double 1s)
            if (this.diceValues[0] === 1 && this.diceValues[1] === 1) {
                this.players[this.currentPlayerIndex] = 0;
                this.updateCurrentTurnScore(0);
                this.updatePlayerSections();
                this.nextTurn();
                return;
            }

            // Check for single 1s
            if (this.diceValues[0] === 1 || this.diceValues[1] === 1) {
                this.updateCurrentTurnScore(0);
                this.nextTurn();
                return;
            }

            // Update current turn score
            const sum = this.diceValues.reduce((a, b) => a + b, 0);
            this.updateCurrentTurnScore(this.currentTurnScore + sum);

            // Check for winner
            if (this.players[this.currentPlayerIndex] + this.currentTurnScore >= this.targetScore) {
                this.players[this.currentPlayerIndex] += this.currentTurnScore;
                this.updatePlayerSections();
                this.declareWinner();
            }
        }, 500);
    }

    holdTurn() {
        if (!this.gameStarted) return;
        
        // Add current turn score to player's total
        this.players[this.currentPlayerIndex] += this.currentTurnScore;
        this.updatePlayerSections();
        
        // Check for winner
        if (this.players[this.currentPlayerIndex] >= this.targetScore) {
            this.declareWinner();
            return;
        }
        
        this.nextTurn();
    }

    nextTurn() {
        this.updateCurrentTurnScore(0);
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.updateActivePlayer();
    }

    declareWinner() {
        const winnerIndex = this.currentPlayerIndex;
        setTimeout(() => {
            alert(`Player ${winnerIndex + 1} wins with ${this.players[winnerIndex]} points!`);
            this.resetGame();
        }, 500);
    }

    getDiceSymbol(value) {
        const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceSymbols[value - 1];
    }

    resetGame() {
        this.gameStarted = false;
        this.gameArea.style.display = 'none';
        this.players = [];
        this.currentPlayerIndex = 0;
        this.diceValues = [0, 0];
        this.currentTurnScore = 0;
        this.dice1.textContent = '⚄';
        this.dice2.textContent = '⚄';
        this.updateCurrentTurnScore(0);
    }
}

// Initialize the game
const game = new DiceGame(); 