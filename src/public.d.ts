export interface PluginOptions {
    /**
     * Path where the compiled WebAssembly binary should be saved, relative to the project root.
     * The `.wasm` extension is automatically appended to the file name.
     * By default, the binary is saved to `static/wasm_main`.
     */
    outputPath?: string;

	/**
	 * A single one or an array of glob patterns specifying source files to be included by the C3 compiler.
     * By default, all `.c3` files from the `src` directory are included.
	 */
	include?: string | string[];
	/**
	 * A single one or an array of glob patterns specifying source files to be ignored by the C3 compiler.
     * By default, no files are excluded.
     * The build output path is always excluded.
	 */
	exclude?: string | string[];

    /**
     * Whether to compile the source into 64-bit WebAssembly.
     * By default, 32-bit WebAssembly is generated.
     */
    wasm64?: boolean;

    /**
     * Additional command line options to pass to the C3 compiler.
     * 
     * @see https://c3-lang.org/
     */
    compilerOptions?: string;
}

// eslint-disable-next-line n/no-missing-import
export * from './index.js';
