import { Player } from './Player';
import { dispatchEvent } from './dispatchEvent';
import {
	PieceTypeDefinition,
	DefaultPieceTypes,
	TstrisEventMap,
	TstrisOptions,
	InternalOptions,
	DefaultOptions,
} from './types';

export const DEFAULT_PIECE_TYPES = {
	I: {
		shape: [
			['', '', '', ''],
			['I', 'I', 'I', 'I'],
			['', '', '', ''],
			['', '', '', ''],
		],
	},
	J: {
		shape: [
			['J', '', ''],
			['J', 'J', 'J'],
			['', '', ''],
		],
	},
	L: {
		shape: [
			['', '', 'L'],
			['L', 'L', 'L'],
			['', '', ''],
		],
	},
	O: {
		shape: [
			['O', 'O'],
			['O', 'O'],
		],
	},
	S: {
		shape: [
			['', 'S', 'S'],
			['S', 'S', ''],
			['', '', ''],
		],
	},
	T: {
		shape: [
			['', 'T', ''],
			['T', 'T', 'T'],
			['', '', ''],
		],
	},
	Z: {
		shape: [
			['Z', 'Z', ''],
			['', 'Z', 'Z'],
			['', '', ''],
		],
	},
};

// TODO
export const DEFAULT_SPEED_FUNCTION = () => {
	return 500;
};

// TODO
export const DEFAULT_SCORE_FUNCTION = () => {
	return 10;
};

// TODO
export const DEFAULT_LEVEL_FUNCTION = () => {
	return 1;
};

export const DEFAULT_OPTIONS: DefaultOptions<
	Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>
> = {
	pieceTypes: DEFAULT_PIECE_TYPES,
	nextQueueSize: 3,
	resetOnHold: true,
	hold: true,
	width: 10,
	height: 20,
	speedFunction: DEFAULT_SPEED_FUNCTION,
	scoreFunction: DEFAULT_SCORE_FUNCTION,
	levelFunction: DEFAULT_LEVEL_FUNCTION,
	startLevel: 1,
};

/**
 * Represents a game instance
 */
export class Tstris<
	PieceTypes extends Record<string | '', PieceTypeDefinition<string>> = Record<
		DefaultPieceTypes,
		PieceTypeDefinition<DefaultPieceTypes>
	>,
> {
	private events: Map<
		keyof TstrisEventMap<PieceTypes>,
		(arg: TstrisEventMap<PieceTypes>[keyof TstrisEventMap<PieceTypes>]) => void
	>;
	private board: (keyof PieceTypes)[][];
	private player: Player<PieceTypes>;
	private options: InternalOptions<PieceTypes>;
	/** Starts at 0 so that first loop can always run */
	private lastLoopRun = 0;
	/** setInterval id */
	private interval?: number;
	private loopStatus: 'running' | 'stopped' = 'stopped';
	public holdUsed = false;
	public level: number;
	public rowsCleared = 0;
	public score = 0;
	public status: 'playing' | 'paused' | 'ended' | 'idle' = 'idle';

	/**
	 * Construct a new game instance
	 * @param options Options for the new instance, not required
	 */
	constructor(options: TstrisOptions<PieceTypes> = {}) {
		// make copy of provided default board if it exists
		options.defaultBoard = options.defaultBoard?.map((row) => row.slice(0));

		this.options = {
			...DEFAULT_OPTIONS,
			...options,
		} as InternalOptions<PieceTypes>;

		this.events = new Map();
		this.level = this.options.startLevel;

		// don't use updateBoard because player doesn't exist yet
		this.board = options.defaultBoard || this.generateDefaultBoard();
		this.player = new Player<PieceTypes>(this, this.options, this.board);
	}

	start() {
		this.player.start();
		this.startLoop();
		this.status = 'playing';
	}

	/**
	 * Sets game status to "ended" and stops game loop
	 * 	@param reset Whether this function should also reset board and player
	 */
	end(reset?: boolean) {
		this.status = 'ended';
		this.stopLoop();
		if (reset) this.reset();
	}

	/** Resets board and player and sets status to "idle" but does not stop loop */
	reset() {
		this.player.reset();
		this.setBoard(this.options.defaultBoard || this.generateDefaultBoard());
		this.status = 'idle';
	}

	/**
	 * Add event listener to the game instance for certain events
	 * @param event Event to add callback for
	 * @param cb Callback to run when event occurs
	 */
	on<E extends keyof TstrisEventMap<PieceTypes>>(
		event: E,
		cb: (args: Pick<TstrisEventMap<PieceTypes>, E>[E]) => void,
	) {
		this.events.set(event, cb as any);
	}

	/**
	 * Remove event an event listener from game instance
	 * @param event Event to remove event listener for
	 */
	off<E extends keyof TstrisEventMap<PieceTypes>>(event: E) {
		this.events.delete(event);
	}

	/**
	 * Get a copy of the current game board, only shows placed pieces, not the player piece
	 * @returns A copy of the current game board
	 */
	getBoard() {
		return this.board.map((row) => row.slice(0));
	}

	/**
	 * Get a copy of the board with player piece rendered as well
	 * @returns A copy of current board with the player rendered
	 */
	getBoardWithPlayer() {
		const currBoard = this.getBoard();

		// technically possible
		if (!this.player.currPiece) return currBoard;

		// renders piece onto board
		this.player.currPiece.shape.forEach((row, y) =>
			row.forEach((value, x) => {
				if (value !== '') {
					currBoard[y + this.player.pos.y][x + this.player.pos.x] = value;
				}
			}),
		);

		return currBoard;
	}

	/** Moves player to the right by 1 cell */
	moveRight() {
		this.player.moveHorizontal('right');
		this.updateBoard();
	}

	/** Moves player to the left by 1 cell */
	moveLeft() {
		this.player.moveHorizontal('left');
		this.updateBoard();
	}

	/** Moves player down 1 cell and checks if they lost the game */
	softDrop() {
		// temporarily stop default dropping when soft dropping
		this.stopLoop();
		if (this.player.drop()) this.end();
		this.updateBoard();
		this.startLoop();
	}

	/** Switches current piece with held piece or places current piece in hold and gets next piece */
	hold() {
		if (this.holdUsed || !this.options.hold) return;
		this.player.hold();
		this.updateBoard();
		this.holdUsed = true;
	}

	/** Rotates current piece to the right */
	rotateRight() {
		this.player.rotatePiece('right');
		this.updateBoard();
	}

	/** Rotates current piece to the left */
	rotateLeft() {
		this.player.rotatePiece('left');
		this.updateBoard();
	}

	getEventMap() {
		return new Map(this.events);
	}

	/**
	 * Ensure this instance and its player use same reference
	 *
	 * **For Internal use only**
	 */
	private setBoard(value: (keyof PieceTypes)[][]) {
		this.board = value;
		this.player.board = value;
	}

	/** Starts game loop if it isn't running */
	private startLoop() {
		if (this.loopStatus === 'running') return;
		this.loopStatus = 'running';
		this.interval = setInterval(this.gameLoop.bind(this), 0) as any;
	}

	/** Stops game loop */
	private stopLoop() {
		this.loopStatus = 'stopped';
		clearInterval(this.interval);
	}

	private gameLoop() {
		// Only run loop if enough time has passed since last run
		// This allows for dynamic loop length not usually possible in vanilla context
		if (this.lastLoopRun > Date.now() - this.options.speedFunction(this.level)) return;
		//const loopStart = Date.now();

		const prevented = dispatchEvent(this.events, 'naturalDrop', { cell: true });
		if (prevented) return;

		// when drop returns true, the game is over because of overflow
		const ended = this.player.drop();
		this.updateBoard();
		if (ended) {
			return this.end();
		}

		//console.log('loop time:', Date.now() - loopStart);
		this.lastLoopRun = Date.now();
	}

	/** Checks for if rows were cleared and if player position needs to be adjusted, call after any moves */
	private updateBoard() {
		// then check if we collided or just update the board
		if (this.player.collided) {
			dispatchEvent(this.events, 'piecePlaced', {
				type: this.player.currPiece.type as string,
			});
			this.setBoard(this.handleClearedRows(this.getBoardWithPlayer()));
			this.player.resetPlayer({ afterHold: false });
			// hold resets after a piece is placed
			this.holdUsed = false;
		} else {
			this.setBoard(this.getBoard());
		}

		dispatchEvent(this.events, 'update', {});
	}

	/** Finds cleared rows and replaces them, also dispatches rowCleared event and calls scoreFunction */
	private handleClearedRows(newBoard: (keyof PieceTypes)[][]) {
		let rowsCleared = 0;
		const rowIndexes: number[] = [];

		// find which rows are cleared and instead of adding them to back to ack, add new row to top
		const withClearedRows = newBoard.reduce<(keyof PieceTypes)[][]>((ack, row, i) => {
			if (row.findIndex((cell) => cell === '') === -1) {
				rowsCleared += 1;
				rowIndexes.push(i);
				ack.unshift(new Array<keyof PieceTypes>(newBoard[0].length).fill(''));
				return ack;
			}
			ack.push(row);
			return ack;
		}, []);

		this.rowsCleared += rowsCleared;
		dispatchEvent(this.events, 'rowCleared', {
			totalRowsCleared: this.rowsCleared,
			clearedThisPlace: rowsCleared,
			rows: rowIndexes,
			tSpin: false,
		});

		const newScore = this.options.scoreFunction({
			rowsCleared,
			level: this.level,
			tSpin: false,
		});
		dispatchEvent(this.events, 'scoreChange', {
			oldScore: this.score,
			newScore: (this.score += newScore),
		});

		const newLevel = this.options.levelFunction({
			totalRowsCleared: this.rowsCleared,
			currLevel: this.level,
		});
		if (newLevel !== this.level) {
			this.level = newLevel;
			dispatchEvent(this.events, 'levelChange', { newLevel });
		}

		return withClearedRows;
	}

	private generateDefaultBoard() {
		return Array.from(Array(this.options.height), () => new Array(this.options.width).fill(''));
	}
}
