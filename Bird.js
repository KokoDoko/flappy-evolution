import { Game } from './main.js';

export class Bird {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('bird');
        document.getElementById('game').append(this.element);
        this.stats = document.getElementById("stats")
        this.gameHeight = window.innerHeight;
        this.gameWidth = window.innerWidth;
        this.velocity = 0;
        this.gravity = 0.5;
        this.alive = true;
        this.jumpForce = -10;
        this.y = (this.gameHeight / 2) + (Math.random() * 300 - 150);
        this.x = 200; 
        this.width = this.element.getBoundingClientRect().width
        this.height = this.element.getBoundingClientRect().height
        this.updatePosition();
        this.createBrain();
    }

    createBrain() {
        let options = {
            inputs: 5,
            outputs: ["flap", "no flap"],
            task: "classification",
            neuroEvolution: true
        };
        this.brain = ml5.neuralNetwork(options);
        const modelInfo = {
            model: "model/model.json",
            metadata: "model/model_meta.json",
            weights: "model/model.weights.bin",
        };
        this.brain.load(modelInfo, ()=>{
            console.log("brain loaded!")
        });

    }

    kill(){
        this.alive = false;
        this.element.classList.add("dead")
    }

    jump() { 
        if (!Game.instance.isGameOver && this.alive) {
            this.velocity = this.jumpForce;
        }
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.updatePosition();
        this.updateStats();
        if(this.checkBoundaries()) {
             this.kill()
        }
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.velocity * 2}deg)`;
    }

    checkBoundaries() {
        return this.y < 0 || this.y + this.height > this.gameHeight;
    }

    // after the first generation, each bird gets a new brain (the other option is removing all instances/dom elements and creating new birds)
    reset() {
        this.y = (this.gameHeight / 2) + (Math.random() * 300 - 150);
        this.velocity = 0;
        this.element.classList.remove("dead")
        this.alive = true;
        this.updatePosition();
    }

    // inputs for the neural network
    // - distance X to next pipeset
    // - bird velocity
    // - bird Y position
    // - next gap top Y
    // - next gap bottom Y
    updateStats() {
        const pipeStats = Game.instance.pipeManager.getPipeStats()
        // 
        if (pipeStats) {
            // create neural network inputs. divide by width/height as a way of normalisation (0 - 1 range)
            let inputs = [
                this.y / this.gameHeight,
                this.normalizeVelocity(this.velocity),                       
                (pipeStats.xpos - this.x + this.width) / this.gameWidth,    // todo x could be -minus 
                pipeStats.gapTop / this.gameHeight,
                pipeStats.gapBottom / this.gameHeight
            ];

            // Wait synchronously for the result (without callback - otherwise you get 30 callbacks per second)
            let results = this.brain.classifySync(inputs);        
            if (results[0].label === "flap") {
                 this.jump();            
            }
        }
    }

    normalizeVelocity(value) {
        let min = -15
        let max = 30
        return (value - min) / (max - min);
    }
}

