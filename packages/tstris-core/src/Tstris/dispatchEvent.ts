import { PieceTypeDefinition, TstrisEventMap } from './types';

/**
 * Calls callback for event wih prope arguments and default preventing
 * @param event Event name
 * @param args Arguments for specific event
 * @returns Whether or not the event's default was prevented
 */
export const dispatchEvent = <
	PieceTypes extends Record<string, PieceTypeDefinition<string>>,
	E extends keyof TstrisEventMap<PieceTypes>,
>(
	events: Map<
		keyof TstrisEventMap<PieceTypes>,
		((args: TstrisEventMap<PieceTypes>[E]) => void)[]
	>,
	event: E,
	args: Omit<TstrisEventMap<PieceTypes>[E], 'preventDefault'>,
) => {
	let defaultPrevented = false;
	const preventDefault = () => (defaultPrevented = true);

	events.get(event)?.forEach((listener) => listener?.({ ...args, preventDefault } as any));

	return defaultPrevented;
};
