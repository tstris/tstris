import { getRandomKey } from '../../utils/getRandomKey';
import { Tstris } from '../Tstris';
import { DefaultPieceTypes, InternalOptions, PieceTypeDefinition, TstrisOptions } from '../types';

export class Player<
	PieceTypes extends Record<string, PieceTypeDefinition<string>> = Record<
		DefaultPieceTypes,
		PieceTypeDefinition<DefaultPieceTypes>
	>,
> {
	public currPiece!: string[][];
	public heldPiece?: keyof PieceTypes;
	public nextPieces: string[];
	public pos: { x: number; y: number };

	constructor(private tstris: Tstris<PieceTypes>, private options: InternalOptions<PieceTypes>) {
		this.nextPieces = Array(options.nextQueueSize);
		this.pos = { x: 0, y: 0 };
	}

	start() {
		this.currPiece = this.options.pieceTypes[this.getRandomPiece()].shape;

		// populate next queue
		for (let i = 0; i < this.options.nextQueueSize; i += 1) {
			this.nextPieces[i] = this.getRandomPiece();
		}
	}

	reset() {
		this.heldPiece = undefined;
		this.nextPieces = Array(this.options.nextQueueSize);
		// hopefully does'nt break anything
		this.currPiece = [[]];
	}

	/** Call after player piece is placed or hold is activated */
	resetPlayer() {
		this.pos = { x: this.options.width / 2 - 2, y: 0 };

		// getNextPiece handles no queue case and replacing taken piece
		this.currPiece = this.options.pieceTypes[this.getNextPiece()].shape;
	}

	/** Switches current piece with held piece or places current piece in hold and gets next piece */
	hold() {
		if (!this.options.hold) return;
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
		return getRandomKey(this.options.pieceTypes);
	}
}
