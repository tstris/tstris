import {
	Box,
	Button,
	Container,
	Group,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	useMantineColorScheme,
} from '@mantine/core';
import { Center } from '@mantine/core';
import { useTstris } from '@/../../packages/tstris-react';
import { DefaultPieceTypes } from '@/../../packages/tstris-core';
import { KeyboardEventHandler, memo } from 'react';
import { useFocusTrap } from '@mantine/hooks';

const getPieceColor = (piece: DefaultPieceTypes) => {
	if (piece == 'I') {
		return 'turquoise';
	} else if (piece == 'O') {
		return 'yellow';
	} else if (piece == 'J') {
		return 'blue';
	} else if (piece == 'L') {
		return 'orange';
	} else if (piece == 'T') {
		return 'purple';
	} else if (piece == 'Z') {
		return 'red';
	} else if (piece == 'S') {
		return 'green';
	} else {
		return 'transparent';
	}
};

// Use memo for cell component to save a lot of rerenders
// eslint-disable-next-line react/display-name
const Cell = memo(({ piece, size }: { piece: DefaultPieceTypes; size: number }) => {
	const color = getPieceColor(piece);

	return (
		<Box
			sx={(theme) => ({
				border: theme.colorScheme === 'dark' ? `1px solid white` : `1px solid black`,
				margin: 0,
				width: size,
				height: size,
			})}
		>
			<Box
				sx={{
					border: color !== 'transparent' ? `10px outset ${color}` : undefined,
					backgroundColor: getPieceColor(piece),
					width: size,
					height: size,
				}}
			></Box>
		</Box>
	);
});

const Board = ({
	board,
	onKeyDown,
}: {
	board: DefaultPieceTypes[][];
	onKeyDown: KeyboardEventHandler;
}) => {
	const ref = useFocusTrap();

	return (
		<SimpleGrid tabIndex={0} ref={ref} onKeyDown={onKeyDown} spacing={0} cols={10}>
			<button style={{ display: 'none' }}></button>
			{board
				.flatMap((piece) => piece)
				.map((piece, i) => (
					<Cell key={i} piece={piece} size={50} />
				))}
		</SimpleGrid>
	);
};

const Page = () => {
	const {
		boardWPlayer,
		score,
		level,
		rowsCleared,
		start,
		moveHandler,
		nextQueue,
		restart,
		heldPiece,
	} = useTstris();
	const { toggleColorScheme } = useMantineColorScheme();

	return (
		<Center sx={{ flexDirection: 'column', minHeight: '100vh' }}>
			<Button mb='md' onClick={() => toggleColorScheme()}>
				Toggle Color Scheme
			</Button>
			<Container>
				<Group align='start'>
					<Paper>
						<Text component='h1' sx={{ fontSize: 40 }}>
							Hold
						</Text>
						{heldPiece}
					</Paper>
					<Board board={boardWPlayer} onKeyDown={moveHandler} />
					<Stack align='center'>
						<Text component='h1' sx={{ fontSize: 40 }}>
							Info
						</Text>
						<Text component='h2' sx={{ fontSize: 28 }}>
							Next
						</Text>
						<Stack>
							{nextQueue?.map((piece, i) => (
								<p key={i}>{piece}</p>
							))}
						</Stack>
						<Text component='h2' sx={{ fontSize: 28 }}>
							Lines: {rowsCleared}
						</Text>
						<Text component='h2' sx={{ fontSize: 28 }}>
							Level: {level}
						</Text>
						<Text component='h2' sx={{ fontSize: 28 }}>
							Score: {score}
						</Text>
						<Button onClick={start}>Start</Button>
						<Button onClick={restart}>Restart</Button>
					</Stack>
				</Group>
			</Container>
		</Center>
	);
};

export default Page;
