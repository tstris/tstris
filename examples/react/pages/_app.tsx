import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { ReactNode } from 'react';
import Head from 'next/head';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';

interface _App<P = {}> {
	(props: AppProps & P): ReactNode;
	getInitialProps?: (ctx: AppContext) => Promise<P & AppInitialProps>;
}

const MyApp: _App = ({ Component, pageProps }) => {
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'colorScheme',
		defaultValue: preferredColorScheme,
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = (value?: 'dark' | 'light') => {
		const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
		setColorScheme(value || nextColorScheme);
	};

	return (
		<>
			<Head>
				<link rel='icon' href='/icon.png' type='image/png' />
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
				<title>Tstris React</title>
			</Head>
			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ colorScheme, cursorType: 'pointer' }}
				>
					<Component {...pageProps} />
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
};

export default MyApp;
