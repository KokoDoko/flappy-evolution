import { Pipe } from './Pipe.js';

export class PipeManager {

    constructor() {
        this.pipeSpeed = 4; 
        this.minGapHeight = 260; 
        this.gapHeightVariation = 100; 
        this.score = 0;
        this.gameElement = document.getElementById('game');
        this.scoreElement = document.getElementById('score'); // top left
        //this.gapCheck = document.getElementById('gapcheck');
        this.pipes = []; 
        this.showDebug = true;
        this.spawnCounter = 0;
        this.spawnTime = 180;
    }
    


    createPipe() {
        const gapHeight = this.minGapHeight + Math.random() * this.gapHeightVariation;
        const minGapStart = 50;
        const maxGapStart = window.innerHeight - gapHeight - 100;
        const gapStart = minGapStart + Math.random() * (maxGapStart - minGapStart);
        const initX = window.innerWidth;
        
        // Create pipes
        const topPipe = new Pipe({ x: initX, y: 0, height: gapStart, className: 'top' });
        const bottomPipe = new Pipe({ x: initX, y: gapStart + gapHeight, height: window.innerHeight - (gapStart + gapHeight),  className: 'bottom'});

        this.pipes.push(topPipe, bottomPipe);
    }

    // Move all pipes to the left
    updatePipes() {
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            pipe.updatePosition();

            if (pipe.x < -pipe.width) {
                pipe.element.remove();
                this.pipes.splice(i, 1);
                if (pipe.className === 'top') {
                    this.score++;
                    this.scoreElement.innerText = `Score: ${this.score}`;
                }
            }
        }

        // Create new pipes with random intervals
        this.spawnCounter++
        if (this.spawnCounter > this.spawnTime) {
            this.createPipe()
            this.spawnCounter = 0
            this.spawnTime = 120 + Math.random() * 120
        }

        // if(this.showDebug) {
        //     this.drawPipeStats()
        // }
        
    }

    // Gets the two pipes directly in front of the bird (the next gap to fly through)
    getNextTwoPipes() {
        const validPipes = this.pipes.filter(pipe => pipe.x + pipe.width >= 200);
        return validPipes.slice(0, 2);
    }

    // Only check collisions with the two pipes directly right of the birds
    checkCollisions(birds) {
        const twoPipes = this.getNextTwoPipes();

        for(let bird of birds) {
            for (let pipe of twoPipes) {
                if (this.checkCollision(pipe, bird)) {
                    bird.kill();
                }
            }
        }

        
    }

    checkCollision(pipe, bird) {
        const birdRect = bird.element.getBoundingClientRect();
        const pipeRect = pipe.element.getBoundingClientRect();

        return !(birdRect.right < pipeRect.left ||
            birdRect.left > pipeRect.right ||
            birdRect.bottom < pipeRect.top ||
            birdRect.top > pipeRect.bottom);
    }

    reset() {
        this.spawnCounter = 0;         // reset spawn counter
        this.spawnTime = 180;          // set initial spawn time delay
        
        
        // Clear all pipes from DOM and array
        this.pipes.forEach(pipe => pipe.element.remove());
        this.pipes = [];
    }

    getPipeStats() {
        const nextPipes = this.getNextTwoPipes();
        if (nextPipes.length < 2) {
            return null;
        }
        // Assumes top pipe's height is its bottom edge and bottom pipe's y is its top edge.
        const pipeTop = nextPipes[0];
        const pipeBottom = nextPipes[1];
        return { xpos: pipeBottom.x, gapTop: pipeTop.height, gapBottom: pipeBottom.y };
    }

    // draw a rectangle between the two leftmost pipes
    drawPipeStats() {
        const pipeStats = this.getPipeStats()
        if (pipeStats) {
            this.gapCheck.style.height = `${pipeStats.gapBottom - pipeStats.gapTop}px`;
            this.gapCheck.style.transform = `translate(${pipeStats.xpos}px, ${pipeStats.gapTop}px)`;
        }
    }
}