import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { PieceTypeDefinition, Tstris, TstrisEventMap, TstrisOptions } from '@tstris/core';
import { UseTstrisReturn } from './types';

/** Default move handler for easy implementation */


// eslint-disable-next-line prettier/prettier
export const useTstris = <PieceTypes extends Record<string, PieceTypeDefinition<string>>>(
	options?: TstrisOptions<PieceTypes>,
	constructor: typeof Tstris<PieceTypes> = Tstris,
): UseTstrisReturn<PieceTypes> => {
	type Board = (keyof PieceTypes)[][];
	const instance = useRef(new constructor(options));
	const [board, setBoard] = useState<Board>(instance.current.getBoard());
	const [boardWPlayer, setBoardWPlayer] = useState<Board>(instance.current.getBoardWithPlayer());
	const [status, setStatus] = useState<Tstris['status']>(instance.current.status);
	const [score, setScore] = useState(instance.current.score);
	const [rowsCleared, setRowsCleared] = useState(instance.current.rowsCleared);
	const [level, setLevel] = useState(instance.current.level);
	const [heldPiece, setHeldPiece] = useState<keyof PieceTypes | null>(null);
	const [nextQueue, setNextQueue] = useState<(keyof PieceTypes)[] | null>(null);

	const createMoveHandler: KeyboardEventHandler = ({ keyCode }) => {
	if (instance.current.status === 'playing') {
		if (keyCode === 37) {
			instance.current.moveLeft();
		} else if (keyCode === 39) {
			instance.current.moveRight();
		} else if (keyCode === 40) {
			instance.current.softDrop();
		} else if (keyCode === 38) {
			instance.current.rotateRight();
		} else if (keyCode === 67) {
			instance.current.hold();
		} else if (keyCode === 90) {
			instance.current.rotateLeft();
		} else if (keyCode === 88) {
			instance.current.rotateRight();
		} else if (keyCode === 32) {
			instance.current.hardDrop();
		}
	}
};

	useEffect(() => {
		const defaultListeners: { [K in keyof TstrisEventMap<PieceTypes>]?: (arg: TstrisEventMap<PieceTypes>[K]) => void } = {
			start: () => {
				setScore(instance.current.score);
				setLevel(instance.current.level);
			},
			hold:({ next }) => {
				setHeldPiece(next);
			},
			statusChange:({ newStatus }) => {
				setStatus(newStatus);
			},
			rowCleared:({ clearedThisPlace }) => {
				setRowsCleared((prev) => prev + clearedThisPlace);
			},
			queueChange:({ queue }) => {
				setNextQueue(queue);
			},
			levelChange:({ newLevel }) => {
				setLevel(newLevel);
			},
			scoreChange: ({ newScore }) => {
				setScore(newScore);
			},
			update: () => {
				setBoard(instance.current.getBoard());
				setBoardWPlayer(instance.current.getBoardWithPlayer());
			},
		}

		Object.entries(defaultListeners).forEach(([event, cb]) => instance.current.on(event as any, cb));
		return () => Object.entries(defaultListeners).forEach(([event, cb]) => instance.current.off(event as any, cb));
	}, []);

	return {
		board,
		boardWPlayer,
		nextQueue,
		level,
		status,
		rowsCleared,
		score,
		heldPiece,
		start: instance.current.start.bind(instance.current),
		end: instance.current.end.bind(instance.current),
		restart: () => {
			instance.current.reset();
			instance.current.start();
		},
		addEventListener: instance.current.on.bind(instance.current),
		removeEventListener: instance.current.off.bind(instance.current),
		tstris: instance.current,
		moveHandler: createMoveHandler
	}
};
