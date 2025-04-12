import { Bird } from './Bird.js';
import { PipeManager } from "./PipeManager.js"

export class Game {
    static instance = null;
    
    constructor() {
        Game.instance = this;
        ml5.setBackend("cpu");  // cpu is actually faster than webgl for really small networks
        
        // Game state
        this.isGameOver = false;
        this.animationId = null;
        this.generation = 1;
        this.lastTime = 0;
        this.birds = []

        // Game elements
        this.gameElement = document.getElementById('game');
        this.gameOverElement = document.getElementById('game-over'); // dialog
        this.scoreElement = document.getElementById('score'); // top left
        this.finalScoreElement = document.getElementById('final-score'); // dialog text
        this.restartButton = document.getElementById('restart-button');

        // Create bird and pipe manager instances
        this.pipeManager = new PipeManager();

        // population
        let populationSize = 1
        for (let i = 0; i < populationSize; i++) {
            this.birds.push(new Bird());
        }

        this.restartButton.addEventListener('click', () => this.startGame());
        this.startGame();
    }

    startGame() {
        // when the next generation starts, you also have to pass a new brain here
        for (let bird of this.birds) {
            bird.reset();
        }
        this.pipeManager.reset();
        this.gameOverElement.close();
        this.gameElement.classList.remove("paused")

        // Cancel any pending animation frame before starting a new one
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        // Reset time trackers using current time
        this.lastTime = performance.now();
        this.isGameOver = false;
        // Start single animation frame loop
        this.animationId = requestAnimationFrame((ts) => this.update(ts));
    }


    gameOver() {
        this.isGameOver = true;
        this.gameElement.classList.add("paused")
        this.finalScoreElement.innerHTML = `Score: ${this.pipeManager.score}`
        this.gameOverElement.showModal()
    }


    update(ts) {
        const elapsed = ts - this.lastTime;
        if (elapsed >= 1000 / 30) { // 30fps
            this.lastTime = ts;
            this.gameLoop();
        }
        if (!this.isGameOver) {
            this.animationId = requestAnimationFrame((ts) => this.update(ts));
        }
    }

    gameLoop() {
        // Update bird position
        let livingbirds = 0
        for (let bird of this.birds) {
            if(bird.alive && bird.loaded) {
                livingbirds++
                bird.update();
            }
        }

        // Update pipes and collisions
        this.pipeManager.updatePipes();
        this.pipeManager.checkCollisions(this.birds);


        // game over
        if(livingbirds === 0) {
            this.gameOver();
        }

    }
}

// Instantiate the Game class
new Game();