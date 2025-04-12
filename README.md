# Flappy Evolution

Flappy bird can teach himself how to fly by neuro-evolution.

- Create a generation of 100 birds with a random brain
- The brain decides when to flap, based on 5 sensory inputs of the bird
- The 2 birds that perform best are selected for the next generation
- Those 2 birds make a child, that child gets slight mutations to create a new generation of 100 birds
- After only a few generations, Flappy can fly all by himself.
- This demo loads the pre-trained brain into 3 birds.

<br><br><bR>

## ML5 Neural network

### Inputs

- The y-position of the bird
- The y-velocity of the bird
- The y-position of the next top pipe’s opening
- The y-position of the next bottom pipe’s opening
- The x-distance to the next pipe



<figure>
    <img width="400" src="./images/inputs.png" alt="Diagram of neural network inputs">
    <figcaption>Five sensory inputs - (The Nature of Code by Daniel Shiffman)</figcaption>
</figure>

<br><br><bR>

### Outputs

- Flap or don't flap

<figure>
    <img width="400" src="./images/network.webp">
    <figcaption>Resulting Neural Network (The Nature of Code by Daniel Shiffman)</figcaption>
</figure>

<br><br><bR>


### Code

```js
let options = {
    inputs: 5,
    outputs: ["flap", "no flap"],
    task: "classification",
    neuroEvolution: true
};
this.brain = ml5.neuralNetwork(options);
```
<br><br><bR>


## Links

- https://natureofcode.com/neuroevolution/
- https://docs.ml5js.org/#/reference/neural-network

