import { PieceTypeDefinition, Tstris } from '@tstris/core';
import { KeyboardEventHandler } from 'react';

export interface UseTstrisReturn<PieceTypes extends Record<string, PieceTypeDefinition<string>>> {
	board: Tstris<PieceTypes>['board'];
	boardWPlayer: Tstris<PieceTypes>['board'];
	nextQueue: (keyof PieceTypes)[] | null;
	level: Tstris<PieceTypes>['level'];
	status: Tstris['status'];
	rowsCleared: Tstris<PieceTypes>['rowsCleared'];
	score: Tstris<PieceTypes>['score'];
	heldPiece: keyof PieceTypes | null;
	start: Tstris<PieceTypes>['start'];
	end: Tstris<PieceTypes>['end'];
	restart: () => void;
	addEventListener: Tstris<PieceTypes>['on'];
	removeEventListener: Tstris<PieceTypes>['off'];
	tstris: Tstris<PieceTypes>;
	moveHandler: KeyboardEventHandler;
}
