import { Spread } from '../utils/types';
import { Player } from './Player';
import { PieceTypeDefinition, DefaultPieceTypes, TstrisEventMap, TstrisOptions, InternalOptions, DefaultOptions } from './types';

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

export const DEFAULT_OPTIONS: DefaultOptions<Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>> = {
	pieceTypes: DEFAULT_PIECE_TYPES,
	nextQueueSize: 3,
	hold: true,
	width: 10,
	height: 20,
	startSpeed: 1000,
	startLevel: 1,
};

/**
 * Represents a game instance
 */
export class Tstris<
	PieceTypes extends Record<string, PieceTypeDefinition<string>> = Record<
		DefaultPieceTypes,
		PieceTypeDefinition<DefaultPieceTypes>
	>,
> {
	private events: Map<keyof TstrisEventMap<PieceTypes>, (...args: any[]) => void>;
	private board: PieceTypes[][];
	private player: Player<PieceTypes>;
	private options: InternalOptions<PieceTypes>;
	private isPlaying = false;
	private paused = false;

	/**
	 * Construct a new game instance
	 * @param options Options for the new instance, not required
	 */
	constructor(options: TstrisOptions<PieceTypes> = {}) {
		this.options = {
			...DEFAULT_OPTIONS,
			...options,
		} as InternalOptions<PieceTypes>;

		this.events = new Map();
		this.board =
			options.defaultBoard ||
			this.generateDefaultBoard();
		this.player = new Player<PieceTypes>(this, this.options);
	}

	start() {
		this.isPlaying = true;
		this.player.start();
	}

	end() {
		this.isPlaying = false;
		this.reset();
	}

	reset() {
		this.player.reset();
		this.board = this.options.defaultBoard || this.generateDefaultBoard();
	}

	/**
	 * Add event listener to the game instance for certain events
	 * @param event Event to add callback for
	 * @param cb Callback to run when event occurs
	 */
	on<E extends keyof TstrisEventMap<PieceTypes>>(
		event: E,
		cb: (args: TstrisEventMap<PieceTypes>[E]) => void,
	) {
		this.events.set(event, cb);
	}

	/**
	 * Remove event an event listener from game instance
	 * @param event Event to remove event listener for
	 */
	off<E extends keyof TstrisEventMap<PieceTypes>>(event: E) {
		this.events.delete(event);
	}

	/**
	 * Get a copy of the current game board
	 * @returns A copy of the current game board
	 */
	getBoard() {
		return this.board.map((row) => row.slice(0));
	}

	private generateDefaultBoard () {
		return Array.from(Array(this.options.height), () => new Array(this.options.width).fill(''))
	}
}