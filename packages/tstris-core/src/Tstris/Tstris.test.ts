import { DEFAULT_OPTIONS, Tstris } from './Tstris';

describe('Tstris', () => {
	let tstris: Tstris;

	beforeEach(() => {
		tstris = new Tstris();
	});

	describe('Tstris.getBoard', () => {
		it('Should return a board of correct width and height', () => {
			const board = tstris.getBoard();
			expect(board).toBeDefined();
			expect(board.length).toEqual(DEFAULT_OPTIONS.height);
			expect(board[0].length).toEqual(DEFAULT_OPTIONS.width);
			// should be all empty
			expect(board.every((row) => row.every((cell) => cell === ''))).toBe(true);
		});
	});
});
