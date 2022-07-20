# tstris-react

Bindings for tstris through react hooks.

## Installation

```bash
npm install @tstris/core @tstris/react
```

## Usage

```tsx
import { useTstris } from '@tstris/react';

const Component = () => {
	const { boardWPlayer, moveHandler } = useTstris();

	return (
		<Board onKeyDown={moveHandler} board={boardWPlayer} />
	);
}
```

This is a very dumbed down example, please look at examples/react for a more detailed implementation.
