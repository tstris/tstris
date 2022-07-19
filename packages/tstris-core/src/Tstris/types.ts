export type DefaultPieceTypes = 'O' | 'I' | 'J' | 'L' | 'Z' | 'S' | 'T' | '';

export type PieceTypeDefinition<T extends string, E extends object = {}> = {
	shape: (T | '')[][];
} & E;

export type PlayerPiece<PieceTypes extends Record<string, PieceTypeDefinition<string>>> = {
	shape: (keyof PieceTypes)[][];
	type: keyof PieceTypes;
};

export interface TstrisOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	/** Types of cells that will be available in the game instance */
	pieceTypes?: PieceTypes | Record<string, PieceTypeDefinition<string>>;
	/** Width of game board, defaults to 10 */
	width?: number;
	/** Height of game board, defaults to 20 */
	height?: number;
	/**
	 * Function which determines what the level should be, default is provided and exported
	 */
	levelFunction?: (args: { totalRowsCleared: number; currLevel: number }) => number;
	/**
	 * Function which determines game speed from current level in ms (lower is faster), default is provided and exported
	 */
	speedFunction?: (level: number) => number;
	/**
	 * Function called whenever rows are cleared in order to determine how much they are worth, default is provided and exported
	 */
	scoreFunction?: (args: { rowsCleared: number; level: number; tSpin: boolean }) => number;
	/** How many pieces ahead are shown to player, defaults to 3 */
	nextQueueSize?: number;
	/** Whether or not player should be reset after hold, defaults to true */
	resetOnHold?: boolean;
	/** Whether or not holding is allowed, defaults to true */
	hold?: boolean;
	/** Level that the game will begin at, defaults to 1 */
	startLevel?: number;
	/**
	 * How the board should start for this game instance, should align with width and height provided to options
	 */
	defaultBoard?: (keyof PieceTypes)[][];
}

export type HasDefault =
	| 'pieceTypes'
	| 'height'
	| 'width'
	| 'startLevel'
	| 'speedFunction'
	| 'scoreFunction'
	| 'levelFunction'
	| 'nextQueueSize'
	| 'hold'
	| 'resetOnHold';

/**
 * For internal use only, basically pick which properties have a default value
 */
export type DefaultOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> =
	Required<Pick<TstrisOptions<PieceTypes>, HasDefault>>;

export type InternalOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> =
	DefaultOptions<PieceTypes> & Omit<TstrisOptions<PieceTypes>, HasDefault>;

export type TstrisEvent<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	PieceTypes extends Record<string, PieceTypeDefinition<string>>,
	Args extends object = {},
> = {
	preventDefault: () => void;
} & Args;

export interface TstrisEventMap<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	naturalDrop: TstrisEvent<PieceTypes, { cell: boolean }>;
	rowCleared: TstrisEvent<
		PieceTypes,
		{ totalRowsCleared: number; clearedThisPlace: number; rows: number[]; tSpin: boolean }
	>;
	update: TstrisEvent<PieceTypes>;
	start: TstrisEvent<PieceTypes>;
	end: TstrisEvent<PieceTypes>;
	hold: TstrisEvent<PieceTypes, { previous: keyof PieceTypes; next: keyof PieceTypes }>;
	piecePlaced: TstrisEvent<PieceTypes, { type: keyof PieceTypes }>;
	queueChange: TstrisEvent<PieceTypes, { queue: (keyof PieceTypes)[] }>;
	levelChange: TstrisEvent<PieceTypes, { newLevel: number }>;
	scoreChange: TstrisEvent<PieceTypes, { oldScore: number; newScore: number }>;
}
