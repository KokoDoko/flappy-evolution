# Flappy Evolution

<img src="./images/bird-big.png" width="340">

[LIVE DEMO](https://kokodoko.github.io/flappy-evolution/)

### Flappy bird learns to fly by neuro-evolution

- Create a generation of 100 birds with a random brain
- The brain decides when to flap, based on 5 sensory inputs of the bird
- After all birds have sadly passed away, pairs of birds that performed best are selected for the next generation
- Those pairs make children, based on their parents brains, and mutate slightly
- After 5 ~ 15 generations with a population of ~30, the birds can avoid pipes effectively
- This demo loads this pre-trained brain into 3 birds

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
let brain = ml5.neuralNetwork(options);

let inputs = [...sensory data here...]
let prediction = brain.classify(inputs, (result) => {
    console.log(`I think I should %{result[0].label}`)
})

```
<br><br><bR>


## Links

- https://natureofcode.com/neuroevolution/
- https://docs.ml5js.org/#/reference/neural-network

