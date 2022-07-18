var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/utils/getRandomKey.ts
var getRandomKey = (obj) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
};

// src/Tstris/Player/Player.ts
var Player = class {
  constructor(tstris, options, board) {
    this.tstris = tstris;
    this.options = options;
    this.board = board;
    this.collided = false;
    this.nextPieces = Array(options.nextQueueSize);
    this.pos = { x: 0, y: 0 };
  }
  start() {
    this.currPiece = this.getRandomPiece();
    for (let i = 0; i < this.options.nextQueueSize; i += 1) {
      this.nextPieces[i] = this.getRandomPiece();
    }
  }
  reset() {
    this.heldPiece = void 0;
    this.nextPieces = Array(this.options.nextQueueSize);
    this.currPiece = { shape: [[]], type: "" };
    this.pos = { x: this.options.width / 2 - 2, y: 0 };
    this.collided = false;
  }
  resetPlayer({ afterHold = true }) {
    this.pos = { x: this.options.width / 2 - 2, y: 0 };
    if (!afterHold)
      this.currPiece = this.getNextPiece();
  }
  hold() {
    if (!this.options.hold)
      return;
    if (!this.heldPiece) {
      this.heldPiece = this.currPiece;
      this.currPiece = this.getNextPiece();
      return;
    }
    const tmp = this.heldPiece;
    this.heldPiece = this.currPiece;
    this.currPiece = tmp;
    if (this.options.resetOnHold)
      this.resetPlayer({ afterHold: true });
  }
  updatePos({ x, y, collided }) {
    this.pos = { x: this.pos.x + x, y: this.pos.y + y };
    this.collided = collided;
  }
  rotate(shape, dir) {
    const rotatedPiece = shape.map((_, index) => shape.map((col) => col[index]));
    if (dir === "right")
      return rotatedPiece.map((row) => row.reverse());
    return rotatedPiece.reverse();
  }
  drop() {
    if (!this.checkCollision({ x: 0, y: 1 })) {
      this.updatePos({ x: 0, y: 1, collided: false });
    } else {
      if (this.pos.y < 1) {
        return true;
      }
      this.updatePos({ x: 0, y: 0, collided: true });
    }
    return false;
  }
  checkCollision({ x: moveX, y: moveY }) {
    for (let y = 0; y < this.currPiece.shape.length; y += 1) {
      for (let x = 0; x < this.currPiece.shape[y].length; x += 1) {
        if (this.currPiece.shape[y][x] !== "") {
          if (this.board[y + this.pos.y + moveY] === void 0 || this.board[y + this.pos.y + moveY][x + this.pos.x + moveX] === void 0 || this.board[y + this.pos.y + moveY][x + this.pos.x + moveX] !== "") {
            return true;
          }
        }
      }
    }
    return false;
  }
  moveHorizontal(dir) {
    const dirNumber = dir === "left" ? -1 : 1;
    if (!this.checkCollision({ x: dirNumber, y: 0 })) {
      this.updatePos({ x: dirNumber, y: 0, collided: false });
    }
  }
  getNextPiece() {
    const nextPiece = this.nextPieces.shift();
    if (this.options.nextQueueSize > 0)
      this.nextPieces.push(this.getRandomPiece());
    return nextPiece != null ? nextPiece : this.getRandomPiece();
  }
  getRandomPiece() {
    const randPiece = getRandomKey(this.options.pieceTypes);
    return {
      shape: this.options.pieceTypes[randPiece].shape,
      type: randPiece
    };
  }
};

// src/Tstris/Tstris.ts
var DEFAULT_PIECE_TYPES = {
  I: {
    shape: [
      ["", "", "", ""],
      ["I", "I", "I", "I"],
      ["", "", "", ""],
      ["", "", "", ""]
    ]
  },
  J: {
    shape: [
      ["J", "", ""],
      ["J", "J", "J"],
      ["", "", ""]
    ]
  },
  L: {
    shape: [
      ["", "", "L"],
      ["L", "L", "L"],
      ["", "", ""]
    ]
  },
  O: {
    shape: [
      ["O", "O"],
      ["O", "O"]
    ]
  },
  S: {
    shape: [
      ["", "S", "S"],
      ["S", "S", ""],
      ["", "", ""]
    ]
  },
  T: {
    shape: [
      ["", "T", ""],
      ["T", "T", "T"],
      ["", "", ""]
    ]
  },
  Z: {
    shape: [
      ["Z", "Z", ""],
      ["", "Z", "Z"],
      ["", "", ""]
    ]
  }
};
var DEFAULT_SPEED_FUNCTION = () => {
  return 500;
};
var DEFAULT_SCORE_FUNCTION = () => {
  return 10;
};
var DEFAULT_OPTIONS = {
  pieceTypes: DEFAULT_PIECE_TYPES,
  nextQueueSize: 3,
  resetOnHold: true,
  hold: true,
  width: 10,
  height: 20,
  speedFunction: DEFAULT_SPEED_FUNCTION,
  scoreFunction: DEFAULT_SCORE_FUNCTION,
  startLevel: 1
};
var Tstris = class {
  constructor(options = {}) {
    this.lastLoopRun = 0;
    this.loopStatus = "stopped";
    this.rowsCleared = 0;
    this.score = 0;
    this.status = "idle";
    var _a;
    options.defaultBoard = (_a = options.defaultBoard) == null ? void 0 : _a.map((row) => row.slice(0));
    this.options = __spreadValues(__spreadValues({}, DEFAULT_OPTIONS), options);
    this.events = /* @__PURE__ */ new Map();
    this.level = this.options.startLevel;
    this.board = options.defaultBoard || this.generateDefaultBoard();
    this.player = new Player(this, this.options, this.board);
  }
  start() {
    this.player.start();
    this.startLoop();
    this.status = "playing";
  }
  end(reset) {
    this.status = "ended";
    this.stopLoop();
    if (reset)
      this.reset();
  }
  reset() {
    this.player.reset();
    this.setBoard(this.options.defaultBoard || this.generateDefaultBoard());
    this.status = "idle";
  }
  on(event, cb) {
    this.events.set(event, cb);
  }
  off(event) {
    this.events.delete(event);
  }
  getBoard() {
    return this.board.map((row) => row.slice(0));
  }
  getBoardWithPlayer() {
    const currBoard = this.getBoard();
    if (!this.player.currPiece)
      return currBoard;
    this.player.currPiece.shape.forEach((row, y) => row.forEach((value, x) => {
      if (value !== "") {
        currBoard[y + this.player.pos.y][x + this.player.pos.x] = value;
      }
    }));
    return currBoard;
  }
  moveRight() {
    this.player.moveHorizontal("right");
    this.updateBoard();
  }
  moveLeft() {
    this.player.moveHorizontal("left");
    this.updateBoard();
  }
  softDrop() {
    this.stopLoop();
    if (this.player.drop())
      this.end();
    this.updateBoard();
    this.startLoop();
  }
  setBoard(value) {
    this.board = value;
    this.player.board = value;
  }
  startLoop() {
    if (this.loopStatus === "running")
      return;
    this.loopStatus = "running";
    this.interval = setInterval(this.gameLoop.bind(this), 0);
  }
  stopLoop() {
    this.loopStatus = "stopped";
    clearInterval(this.interval);
  }
  gameLoop() {
    if (this.lastLoopRun > Date.now() - this.options.speedFunction(this.level))
      return;
    const loopStart = Date.now();
    const prevented = this.dispatchEvent("naturalDrop", { cell: true });
    if (prevented)
      return;
    const ended = this.player.drop();
    this.updateBoard();
    if (ended) {
      return this.end();
    }
    console.log("loop time:", Date.now() - loopStart);
    this.lastLoopRun = Date.now();
  }
  updateBoard() {
    if (this.player.collided) {
      this.setBoard(this.handleClearedRows(this.getBoardWithPlayer()));
      this.player.resetPlayer({ afterHold: false });
    } else {
      this.setBoard(this.getBoard());
    }
    this.dispatchEvent("update", {});
  }
  handleClearedRows(newBoard) {
    let rowsCleared = 0;
    const withClearedRows = newBoard.reduce((ack, row) => {
      if (row.findIndex((cell) => cell === "") === -1) {
        rowsCleared += 1;
        ack.unshift(new Array(newBoard[0].length).fill(""));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);
    this.dispatchEvent("rowCleared", { numCleared: rowsCleared, tSpin: false });
    this.score += this.options.scoreFunction({
      rowsCleared,
      level: this.level,
      tSpin: false
    });
    return withClearedRows;
  }
  dispatchEvent(event, args) {
    var _a;
    let defaultPrevented = false;
    const preventDefault = () => defaultPrevented = true;
    (_a = this.events.get(event)) == null ? void 0 : _a(__spreadProps(__spreadValues({}, args), { preventDefault }));
    return defaultPrevented;
  }
  generateDefaultBoard() {
    return Array.from(Array(this.options.height), () => new Array(this.options.width).fill(""));
  }
};
export {
  Tstris
};
