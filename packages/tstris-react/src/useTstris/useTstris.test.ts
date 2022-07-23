import { renderHook, cleanup, act } from '@testing-library/react';
import { useTstris } from './useTstris';
import { describe, it, afterEach, expect } from 'vitest';

describe('useTstris', () => {
	afterEach(cleanup);

	it('Should run without errors & have the instance be defined', () => {
		const { result } = renderHook(() => useTstris());
		expect(result.current.tstris).toBeDefined();
	});

	it('Should have the instance be referentially stable', () => {
		const { rerender, result } = renderHook(() => useTstris());
		const beforeRerender = result.current.tstris;
		rerender();
		expect(result.current.tstris).toBe(beforeRerender);
	});

	it('Should react to events being fired in the game.', () => {
		const { result } = renderHook(() => useTstris());
		const startingBoard = result.current.boardWPlayer;
		act(() => {
			result.current.tstris.start();
			result.current.tstris.softDrop();
		});
		expect(result.current.boardWPlayer).not.toEqual(startingBoard);
	});
});
