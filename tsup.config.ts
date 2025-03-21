import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  format: ['cjs'],
  shims: true,
  dts: false,
  external: [
    'vscode',
  ],
  noExternal: [
    'font-list',
  ],
  clean: true,
  minify: false,
  sourcemap: true,
})
