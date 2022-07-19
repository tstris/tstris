import { Tstris } from '../../packages/tstris-core/lib/index.mjs';

const tstris = new Tstris();

let board = document.getElementById('board');
const hold = document.getElementById('hold');
const next = document.getElementById('next');
const score = document.getElementById('score');
const level = document.getElementById('level');

score.innerHTML = tstris.score;
level.innerHTML = tstris.level;

const move = ({ keyCode }) => {
	if (tstris.status !== 'ended') {
		if (keyCode === 37) {
			tstris.moveLeft();
		} else if (keyCode === 39) {
			tstris.moveRight();
		} else if (keyCode === 40) {
			tstris.softDrop();
		} else if (keyCode === 38) {
			tstris.rotateRight();
		} else if (keyCode === 67) {
			tstris.hold();
		} else if (keyCode === 90) {
			tstris.rotateLeft();
		} else if (keyCode === 88) {
			tstris.rotateRight();
		} else if (keyCode === 32) {
			tstris.hardDrop();
		}
	}
};

const getColor = (cell) => {
	if (cell == 'I') {
		return 'turquoise';
	} else if (cell == 'O') {
		return 'yellow';
	} else if (cell == 'J') {
		return 'blue';
	} else if (cell == 'L') {
		return 'orange';
	} else if (cell == 'T') {
		return 'purple';
	} else if (cell == 'Z') {
		return 'red';
	} else if (cell == 'S') {
		return 'green';
	}
};

window.addEventListener('keydown', move);

tstris.on('update', () => {
	const tstrisBoard = tstris.getBoardWithPlayer();

	const flattenedBoard = tstrisBoard.flatMap((cell) => cell);
	//console.log(flattenedBoard);

	board.textContent = '';
	board.append(
		...flattenedBoard.map((cell) => {
			const cellEl = document.createElement('div');
			cellEl.style.background = getColor(cell);
			cellEl.style.border = '0.5px solid black';
			cellEl.style.margin = '0';
			return cellEl;
		}),
	);
});

tstris.on('scoreChange', ({ newScore }) => {
	score.innerHTML = newScore;
});

tstris.on('levelChange', ({ newLevel }) => {
	level.innerHTML = newLevel;
});

tstris.on('queueChange', ({ queue }) => {
	next.textContent = '';
	next.append(
		...queue.map((piece) => {
			const cellEl = document.createElement('div');
			cellEl.innerHTML = piece;
			cellEl.style.border = '0.5px solid black';
			cellEl.style.margin = '16px';
			return cellEl;
		}),
	);
});

tstris.on('hold', ({ next }) => {
	hold.innerText = next;
});

document.getElementById('restart')?.addEventListener('click', () => {
	tstris.reset();
	tstris.start();
});

tstris.start();
