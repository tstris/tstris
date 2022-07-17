import { DEFAULT_OPTIONS, DEFAULT_PIECE_TYPES, Tstris } from '../Tstris';
import { DefaultPieceTypes, PieceTypeDefinition } from '../types';
import { Player } from './Player';

describe('Tstris Player', () => {
	let player: Player<Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>>;

	beforeEach(() => {
		player = new Player<Record<DefaultPieceTypes, PieceTypeDefinition<DefaultPieceTypes>>>(
			new Tstris(),
			DEFAULT_OPTIONS,
		);
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
			const rotated = player.rotate(iPiece, 'left');
			expect(iPiece).toEqual([
				['', '', '', ''],
				['I', 'I', 'I', 'I'],
				['', '', '', ''],
				['', '', '', ''],
			]);
		});
	});
});
