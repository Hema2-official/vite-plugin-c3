# vite-plugin-c3: making C3 easy-to-use for the web
Plugin for automatic C3 to WASM compilation and site reloading in Vite. ⚡

## Supported platforms
See the [@c3-lang/c3c](https://www.npmjs.com/package/@c3-lang/c3c) package for information on supported platforms and how to configure unsupported ones.

## Usage
```js
import { defineConfig } from 'vite';
import { c3c } from 'vite-plugin-c3';
// ...

export default defineConfig({
    plugins: [
        // Include the plugin:
        c3c({
            /* config options */
        })
    ],
    // ...
});
```

## Configuration
```js
// Here is the default configuration:
c3c({
    outputPath: 'static/wasm_main',  // Output path for the WASM binary
    include: ['src/**/*.c3'],  // Glob patterns to include
    exclude: [],  // Glob patterns to exclude (overrides include)
    wasm64: false,  // Whether to use 64-bit WASM
    compilerOptions: ''  // Additional compiler options passed to c3c
})
```
