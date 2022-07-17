import { defineConfig } from 'tsup';

export default defineConfig((options) => {
	return {
		minify: !options.watch,
		sourcemap: !options.watch,
		entry: ['src/index.ts'],
		outDir: '../../dist/packages/tstris-core/lib',
		clean: true,
		dts: true,
		format: ['esm', 'cjs'],
		target: 'es2015',
	};
});
