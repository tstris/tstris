import {
	Box,
	Button,
	Container,
	Grid,
	Group,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	useMantineColorScheme,
} from '@mantine/core';
import { Center } from '@mantine/core';
import { useTstris } from '@/../../packages/tstris-react';
import { DefaultPieceTypes, DEFAULT_PIECE_TYPES } from '@/../../packages/tstris-core';
import { KeyboardEventHandler, memo } from 'react';
import { useFocusTrap } from '@mantine/hooks';

const getPieceColor = (piece: DefaultPieceTypes) => {
	if (piece == 'I') {
		return '#40E0D0';
	} else if (piece == 'O') {
		return '#FFFF00';
	} else if (piece == 'J') {
		return '#0000FF';
	} else if (piece == 'L') {
		return '#FFA500';
	} else if (piece == 'T') {
		return '#800080';
	} else if (piece == 'Z') {
		return '#FF0000';
	} else if (piece == 'S') {
		return '#008000';
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
				sx={(theme) => ({
					border: color !== 'transparent' ? `${size / 5}px outset ${color}` : undefined,
					borderTopColor:
						color !== 'transparent' ? theme.fn.lighten(color, 0.2) : undefined,
					borderLeftColor:
						color !== 'transparent' ? theme.fn.lighten(color, 0.2) : undefined,
					backgroundColor: getPieceColor(piece),
					width: size,
					height: size,
				})}
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

const RenderPiece = ({ shape }: { shape: DefaultPieceTypes[][] }) => {
	return (
		<Grid gutter={0} columns={shape.length}>
			{shape.map((row, y) => (
				<Grid.Col span={1} key={y}>
					{row.map((_, x) => {
						const piece = shape[x][y];

						return <Cell key={x} piece={piece} size={30} />;
					})}
				</Grid.Col>
			))}
		</Grid>
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
			<Container size='xl'>
				<Group sx={{ width: '100%' }} align='start'>
					<Paper>
						<Text component='h1' sx={{ fontSize: 40 }}>
							Hold
						</Text>
						{heldPiece && <RenderPiece shape={DEFAULT_PIECE_TYPES[heldPiece].shape} />}
					</Paper>
					<Board board={boardWPlayer} onKeyDown={moveHandler} />
					<Stack sx={{ width: 300 }} align='center'>
						<Text component='h1' sx={{ fontSize: 40 }}>
							Info
						</Text>
						<Text component='h2' sx={{ fontSize: 28 }}>
							Next
						</Text>
						<Stack sx={{ width: '100%' }} align='center'>
							{nextQueue?.map((piece, i) => (
								<RenderPiece key={i} shape={DEFAULT_PIECE_TYPES[piece].shape} />
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
