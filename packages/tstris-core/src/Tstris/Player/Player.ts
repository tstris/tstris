import { getRandomKey } from '../../utils/getRandomKey';
import { Tstris } from '../Tstris';
import { DefaultPieceTypes, InternalOptions, PieceTypeDefinition, TstrisOptions } from '../types';

type PlayerPiece<PieceTypes extends Record<string, PieceTypeDefinition<string>>> = {
	shape: (keyof PieceTypes)[][];
	type: keyof PieceTypes;
};

export class Player<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	public currPiece!: PlayerPiece<PieceTypes>;
	public heldPiece?: PlayerPiece<PieceTypes>;
	public nextPieces: PlayerPiece<PieceTypes>[];
	public pos: { x: number; y: number };

	constructor(private tstris: Tstris<PieceTypes>, private options: InternalOptions<PieceTypes>) {
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
	}

	/** Call after player piece is placed or hold is activated */
	resetPlayer({ afterHold = false }) {
		this.pos = { x: this.options.width / 2 - 2, y: 0 };

		// getNextPiece handles no queue case and replacing taken piece
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
		const randPiece = getRandomKey(this.options.pieceTypes);
		return {
			shape: this.options.pieceTypes[randPiece].shape as (keyof PieceTypes)[][],
			type: randPiece as keyof PieceTypes,
		};
	}
}
