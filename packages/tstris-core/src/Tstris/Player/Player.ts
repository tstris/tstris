import { getRandomKey } from '../../utils/getRandomKey';
import { Tstris } from '../Tstris';
import { InternalOptions, PieceTypeDefinition, PlayerPiece } from '../types';

export class Player<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	public currPiece!: PlayerPiece<PieceTypes>;
	public heldPiece?: PlayerPiece<PieceTypes>;
	public nextPieces: PlayerPiece<PieceTypes>[];
	public pos: { x: number; y: number };
	public collided = false;

	constructor(
		private tstris: Tstris<PieceTypes>,
		private options: InternalOptions<PieceTypes>,
		/** Reference to game board */
		public board: (keyof PieceTypes)[][],
	) {
		this.nextPieces = Array(options.nextQueueSize);
		this.pos = { x: 0, y: 0 };
	}

	start() {
		this.currPiece = this.getRandomPiece();

		// populate next queue
		for (let i = 0; i < this.options.nextQueueSize; i += 1) {
			this.nextPieces[i] = this.getRandomPiece();
		}
	}

	reset() {
		this.heldPiece = undefined;
		this.nextPieces = Array(this.options.nextQueueSize);
		// hopefully does'nt break anything
		this.currPiece = { shape: [[]] as any, type: '' };
		this.pos = { x: this.options.width / 2 - 2, y: 0 };
		this.collided = false;
	}

	/** Call after player piece is placed or hold is activated */
	resetPlayer({ afterHold = true }) {
		this.pos = { x: this.options.width / 2 - 2, y: 0 };

		// getNextPiece handles no queue case and replacing taken piece
		// if called after hold() do not get next piece
		if (!afterHold) this.currPiece = this.getNextPiece();
	}

	/** Switches current piece with held piece or places current piece in hold and gets next piece */
	hold() {
		if (!this.options.hold) return;
		if (!this.heldPiece) {
			this.heldPiece = this.currPiece;
			this.currPiece = this.getNextPiece();
			return;
		}
		const tmp = this.heldPiece;
		this.heldPiece = this.currPiece;
		this.currPiece = tmp;
		if (this.options.resetOnHold) this.resetPlayer({ afterHold: true });
	}

	/**
	 * Moves player by x and y and updates their collision status
	 */
	updatePos({ x, y, collided }: { x: number; y: number; collided: boolean }) {
		this.pos = { x: this.pos.x + x, y: this.pos.y + y };
		this.collided = collided;
	}

	/**
	 * **For internal use only**
	 */
	rotate(shape: string[][], dir: 'left' | 'right') {
		// make the row columns
		const rotatedPiece = shape.map((_, index) => shape.map((col) => col[index]));
		// reverse each row to get a rotated matrix
		if (dir === 'right') return rotatedPiece.map((row) => row.reverse());
		return rotatedPiece.reverse();
	}

	/**
	 * Drops player by one, used in gameLoop and softDrop
	 * @returns Whether or not the game ended from this drop
	 */
	drop() {
		if (!this.checkCollision({ x: 0, y: 1 })) {
			this.updatePos({ x: 0, y: 1, collided: false });
		} else {
			// game over
			if (this.pos.y < 1) {
				return true;
			}
			this.updatePos({ x: 0, y: 0, collided: true });
		}
		return false;
	}

	checkCollision({ x: moveX, y: moveY }: { x: number; y: number }) {
		for (let y = 0; y < this.currPiece.shape.length; y += 1) {
			for (let x = 0; x < this.currPiece.shape[y].length; x += 1) {
				//1. check that we're on piece (non-empty) cell
				if (this.currPiece.shape[y][x] !== '') {
					if (
						//2. check that our movement is in the game area height
						// shouldn't go through bottom on game area
						this.board[y + this.pos.y + moveY] === undefined ||
						//3. check that move is within game area width
						this.board[y + this.pos.y + moveY][x + this.pos.x + moveX] === undefined ||
						//4. check that cell we're moving to isn't set to clear
						this.board[y + this.pos.y + moveY][x + this.pos.x + moveX] !== ''
					) {
						return true;
					}
				}
			}
		}
		return false;
	}

	moveHorizontal(dir: 'left' | 'right') {
		const dirNumber = dir === 'left' ? -1 : 1;
		if (!this.checkCollision({ x: dirNumber, y: 0 })) {
			this.updatePos({ x: dirNumber, y: 0, collided: false });
		}
	}

	/**
	 * Gets next piece from queue, if there is one, and replaces it by adding a piece to back
	 *
	 * If there isn't a piece in queue because of queue length 0, it returns a random piece
	 */
	private getNextPiece() {
		// if it was empty, shift returns undefined so we know it was queue length of 0
		const nextPiece = this.nextPieces.shift();

		// length was reduced by shift so this is fine to do
		if (this.options.nextQueueSize > 0) this.nextPieces.push(this.getRandomPiece());

		return nextPiece ?? this.getRandomPiece();
	}

	private getRandomPiece() {
		const randPiece = getRandomKey(this.options.pieceTypes);
		return {
			shape: this.options.pieceTypes[randPiece].shape as (keyof PieceTypes)[][],
			type: randPiece as keyof PieceTypes,
		};
	}
}
