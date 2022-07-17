export type DefaultPieceTypes = 'O' | 'I' | 'J' | 'L' | 'Z' | 'S' | 'T';

export type PieceTypeDefinition<T extends string, E extends object = {}> = {
	shape: (T | '')[][];
} & E;

export interface TstrisOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	/**
	 * Types of cells that will be available in the game instance
	 */
	pieceTypes?: PieceTypes | Record<string, PieceTypeDefinition<string>>;
	/**
	 * Width of game board, defaults to 10
	 */
	width?: number;
	/**
	 * Height of game board, defaults to 20
	 */
	height?: number;
	/**
	 * Speed in milliseconds at which the game will begin, defaults to 1000
	 */
	startSpeed?: number;
	/**
	 * How many pieces ahead are shown to player, defaults to 3
	 */
	nextQueueSize?: number;
	/**
	 * Whether or not holding is allowed, defaults to true
	 */
	hold?: boolean;
	/**
	 * Level that the game will begin at, defaults to 1
	 */
	startLevel?: number;
	/**
	 * How the board should start for this game instance, should align with width and height provided to options
	 */
	defaultBoard?: PieceTypes[][];
}

export type HasDefault = 'pieceTypes' | 'height' | 'width' | 'startLevel' | 'startSpeed' | 'nextQueueSize' | 'hold';

/**
 * For internal use only, basically pick which properties have a default value
 */
export type DefaultOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> = Required<
	Pick<TstrisOptions<PieceTypes>, HasDefault>
>;

export type InternalOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> =
	DefaultOptions<PieceTypes> & Omit<TstrisOptions<PieceTypes>, HasDefault>;

export interface TstrisEventMap<PieceType extends Record<string, PieceTypeDefinition<string>>> {
	tick: { cell: boolean };
}
