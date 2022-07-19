declare type DefaultPieceTypes = 'O' | 'I' | 'J' | 'L' | 'Z' | 'S' | 'T' | '';
declare type PieceTypeDefinition<T extends string, E extends object = {}> = {
    shape: (T | '')[][];
} & E;
interface TstrisOptions<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
    /** Types of cells that will be available in the game instance */
    pieceTypes?: PieceTypes | Record<string, PieceTypeDefinition<string>>;
    /** Width of game board, defaults to 10 */
    width?: number;
    /** Height of game board, defaults to 20 */
    height?: number;
    /**
     * Function which determines what the level should be, default is provided and exported
     */
    levelFunction?: (args: {
        totalRowsCleared: number;
        currLevel: number;
    }) => number;
    /**
     * Function which determines game speed from current level in ms (lower is faster), default is provided and exported
     */
    speedFunction?: (level: number) => number;
    /**
     * Function called whenever rows are cleared in order to determine how much they are worth, default is provided and exported
     */
    scoreFunction?: (args: {
        rowsCleared: number;
        level: number;
        tSpin: boolean;
    }) => number;
    /** How many pieces ahead are shown to player, defaults to 3 */
    nextQueueSize?: number;
    /** Whether or not player should be reset after hold, defaults to true */
    resetOnHold?: boolean;
    /** Whether or not holding is allowed, defaults to true */
    hold?: boolean;
    /** Level that the game will begin at, defaults to 1 */
    startLevel?: number;
    /** Number of times a piece can collide before being placed, higher is more lenient, defaults to 3 */
    placementCollisions?: number;
    /**
     * How the board should start for this game instance, should align with width and height provided to options
     */
    defaultBoard?: (keyof PieceTypes)[][];
}
declare type TstrisEvent<PieceTypes extends Record<string, PieceTypeDefinition<string>>, Args extends object = {}> = {
    preventDefault: () => void;
} & Args;
interface TstrisEventMap<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
    naturalDrop: TstrisEvent<PieceTypes, {
        cell: boolean;
    }>;
    rowCleared: TstrisEvent<PieceTypes, {
        totalRowsCleared: number;
        clearedThisPlace: number;
        rows: number[];
        tSpin: boolean;
    }>;
    update: TstrisEvent<PieceTypes>;
    start: TstrisEvent<PieceTypes>;
    end: TstrisEvent<PieceTypes>;
    hold: TstrisEvent<PieceTypes, {
        previous: keyof PieceTypes;
        next: keyof PieceTypes;
    }>;
    piecePlaced: TstrisEvent<PieceTypes, {
        type: keyof PieceTypes;
    }>;
    queueChange: TstrisEvent<PieceTypes, {
        queue: (keyof PieceTypes)[];
    }>;
    levelChange: TstrisEvent<PieceTypes, {
        newLevel: number;
    }>;
    scoreChange: TstrisEvent<PieceTypes, {
        oldScore: number;
        newScore: number;
    }>;
}

/**
 * Represents a game instance
 */
declare class Tstris<PieceTypes extends Record<string | '', PieceTypeDefinition<string>> = Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>> {
    private events;
    private board;
    private player;
    private options;
    /** Starts at 0 so that first loop can always run */
    private lastLoopRun;
    /** setInterval id */
    private interval?;
    private loopStatus;
    holdUsed: boolean;
    level: number;
    rowsCleared: number;
    score: number;
    status: 'playing' | 'paused' | 'ended' | 'idle';
    /**
     * Construct a new game instance
     * @param options Options for the new instance, not required
     */
    constructor(options?: TstrisOptions<PieceTypes>);
    start(): void;
    /**
     * Sets game status to "ended" and stops game loop
     * 	@param reset Whether this function should also reset board and player
     */
    end(reset?: boolean): void;
    /** Resets board and player and sets status to "idle" but does not stop loop */
    reset(): void;
    /**
     * Add event listener to the game instance for certain events
     * @param event Event to add callback for
     * @param cb Callback to run when event occurs
     */
    on<E extends keyof TstrisEventMap<PieceTypes>>(event: E, cb: (args: Pick<TstrisEventMap<PieceTypes>, E>[E]) => void): void;
    /**
     * Remove event an event listener from game instance
     * @param event Event to remove event listener for
     */
    off<E extends keyof TstrisEventMap<PieceTypes>>(event: E): void;
    /**
     * Get a copy of the current game board, only shows placed pieces, not the player piece
     * @returns A copy of the current game board
     */
    getBoard(): (keyof PieceTypes)[][];
    /**
     * Get a copy of the board with player piece rendered as well
     * @returns A copy of current board with the player rendered
     */
    getBoardWithPlayer(): (keyof PieceTypes)[][];
    /** Moves player to the right by 1 cell */
    moveRight(): void;
    /** Moves player to the left by 1 cell */
    moveLeft(): void;
    /** Moves player down 1 cell and checks if they lost the game */
    softDrop(): void;
    /** Moves player down and instantly places piece */
    hardDrop(): void;
    /** Switches current piece with held piece or places current piece in hold and gets next piece */
    hold(): void;
    /** Rotates current piece to the right */
    rotateRight(): void;
    /** Rotates current piece to the left */
    rotateLeft(): void;
    getEventMap(): Map<keyof TstrisEventMap<PieceTypes>, (arg: {
        preventDefault: () => void;
    } | TstrisEvent<PieceTypes, {
        previous: keyof PieceTypes;
        next: keyof PieceTypes;
    }> | TstrisEvent<PieceTypes, {
        cell: boolean;
    }> | TstrisEvent<PieceTypes, {
        totalRowsCleared: number;
        clearedThisPlace: number;
        rows: number[];
        tSpin: boolean;
    }> | TstrisEvent<PieceTypes, {
        type: keyof PieceTypes;
    }> | TstrisEvent<PieceTypes, {
        queue: (keyof PieceTypes)[];
    }> | TstrisEvent<PieceTypes, {
        newLevel: number;
    }> | TstrisEvent<PieceTypes, {
        oldScore: number;
        newScore: number;
    }>) => void>;
    /**
     * Ensure this instance and its player use same reference
     *
     * **For Internal use only**
     */
    private setBoard;
    /** Starts game loop if it isn't running */
    private startLoop;
    /** Stops game loop */
    private stopLoop;
    /** Resets loop to make it wait whole interval again */
    private resetLoop;
    private gameLoop;
    /** Checks for if rows were cleared and if player position needs to be adjusted, call after any moves */
    private updateBoard;
    /** Finds cleared rows and replaces them, also dispatches rowCleared event and calls scoreFunction */
    private handleClearedRows;
    private generateDefaultBoard;
}

export { Tstris };
