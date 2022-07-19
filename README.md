# Tstris

A headless, zero dependency, implementation of a falling block puzzle game. You bring your own ui library and can use the raw core library or use library specific bindings. It is compatible with both common JS and ES Modules and is built in ES6.

## Installation

`npm install @tstris/core`

## Usage

```ts
// Instantiate class
// by default you will get a 4 tile block game
const tstris = new Tstris();

// Attach event listeners to instance...
tstris.on('update', () => {
    const newBoard = tstris.getBoardWithPlayer();

    // ...render board
});

// Starts game
tstris.start();
```

The simple implementation above will be able to show pieces dropping

## Examples

For more in depth examples, check out the examples directory of the repository.

## Credit

Huge thanks to FreeCodeCamp for the great tutorial on making a block game in react. A lot of the logic for the game was taken from here. I did add a lot of improvements like collision leeway, holding, and the next queue, but i couldn't have done it without this so thank you so much. <https://www.youtube.com/watch?v=ZGOaCxX8HIU>
