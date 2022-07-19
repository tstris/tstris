import { DEFAULT_PIECE_TYPES, Tstris } from '../Tstris';
import { DefaultPieceTypes, PieceTypeDefinition } from '../types';
import { Player } from './Player';

describe('Tstris Player', () => {
	let tstris: Tstris;
	let player: Player<Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>>;

	beforeEach(() => {
		tstris = new Tstris();
		player = tstris['player'];
		// initialize with random pieces
		player.start();
	});

	describe('Player.rotate', () => {
		let iPiece: string[][];

		beforeEach(() => {
			iPiece = DEFAULT_PIECE_TYPES.I.shape.map((arr) => arr.slice(0));
		});

		it('Should rotate piece to the right when dir is "right"', () => {
			const rotated = player.rotate(iPiece, 'right');
			expect(rotated).toEqual([
				['', '', 'I', ''],
				['', '', 'I', ''],
				['', '', 'I', ''],
				['', '', 'I', ''],
			]);
		});

		it('Should rotate piece to the left when dir is "left"', () => {
			const rotated = player.rotate(iPiece, 'left');
			expect(rotated).toEqual([
				['', 'I', '', ''],
				['', 'I', '', ''],
				['', 'I', '', ''],
				['', 'I', '', ''],
			]);
		});

		it('Should not mutate input array', () => {
			player.rotate(iPiece, 'left');
			expect(iPiece).toEqual([
				['', '', '', ''],
				['I', 'I', 'I', 'I'],
				['', '', '', ''],
				['', '', '', ''],
			]);
		});
	});

	describe('Player.hold', () => {
		it('Should put curr piece in hold and get next piece if hold is empty', () => {
			const currPiece = player.currPiece;
			const nextInQueue = player.nextPieces[0];
			player.hold();
			expect(player.heldPiece).toBe(currPiece);
			expect(player.currPiece).toBe(nextInQueue);
		});

		it('Should swap curr piece with held piece if there is one', () => {
			player.hold();
			const currPiece = player.currPiece;
			const heldPiece = player.heldPiece;
			player.hold();

			// they should swap
			expect(player.currPiece).toBe(heldPiece);
			expect(player.heldPiece).toBe(currPiece);
		});
	});
});
