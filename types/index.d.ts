import { PluginOptions } from "../src/public";

declare module 'vite-plugin-c3' {
    export function c3c(options?: Partial<PluginOptions> | undefined): import('vite').Plugin;
}
