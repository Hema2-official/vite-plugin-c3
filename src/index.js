import { globSync } from 'glob';
import process from 'node:process';
import path from 'node:path';
import { run_c3c } from '@c3-lang/c3c';

/** @type {import('./public.d.ts').PluginOptions} */
const defaultOptions = {
    outputPath: 'static/wasm_main',
    include: ['src/**/*.c3'],
    exclude: [],
    wasm64: false,
    compilerOptions: ''
};

/**
 * @param {Partial<import('./public.d.ts').PluginOptions>} [options]
 * @returns {import('vite').Plugin}
 */
export function c3c(options) {
    // Merge options
    const opts = { ...defaultOptions, ...options };
    
    // Add output file to exclude list to prevent loops
    opts.exclude.push(`${opts.outputPath}.wasm`);
        
    // Find the project root
    const projectRoot = process.cwd();

    const findFiles = () => {
        // Find C3 files: compile glob pattern list from include/exclude
        const toExclude = globSync(opts.exclude);

        const toInclude = globSync(opts.include, {
            exclude: (path) => toExclude.includes(path)
        });

        // Return absolute paths
        return toInclude.map((file) => path.normalize(path.resolve(projectRoot, file)));
    };

    const rebuild = () => {
        console.log('[C3] Building C3 files...');

        // Find files (paths are relative to project root)
        const c3Files = findFiles();

        // Create compiler command
        const commandForC3C = [
            `compile`,               // Command
            `--reloc=none`,          // Relocation model: none
            `--target wasm${opts.wasm64 ? '64' : '32'}`, // wasm32/64
            `-g0`,                   // Disable debug info
            `--link-libc=no`,        // Disable linking with libc
            `--no-entry`,            // No entry point
            `-z --export-table`,     // Linker -> Export table
            opts.wasm64 ? '-z -mwasm64' : '', // Linker -> 64-bit WASM
            `-o ${opts.outputPath}`, // Output path
            opts.compilerOptions,    // Additional compiler options
            c3Files.join(' ')        // C3 source files
        ].join(' ');

        // C3C automatically prints errors
        run_c3c(commandForC3C, { cwd: projectRoot });
        console.log(`[C3] Built ${opts.outputPath}.wasm`);
    };

    const buildStart = async () => {
        try {
            // Build C3 files
            rebuild();
        } catch (error) {
            console.error('[C3] Build failed!');
        }
    }

    const handleHotUpdate = async ({ file, server }) => {
        // Fetch source files (absolute paths)
        const c3Files = findFiles();

        if (c3Files.includes(path.normalize(file))) {
            try {
                // Rebuild C3 files
                rebuild();

                // Reload the browser
                server.ws.send({
                    type: 'full-reload'
                });
            } catch (error) {
                console.error('[C3] Build failed!');
            }
        }
    }

    return {
        name: 'vite-plugin-c3',
        buildStart,
        handleHotUpdate
    };
}
