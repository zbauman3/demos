# Bun Demo

This is a test showing that there is an error in the `require` setup for the Bun bundler when `target` is `node`.

To test the code:

- Run `bun install` (with bun version 1.0.1)
- Open [./compile.ts](./compile.ts) to see the config – it is minimal, mostly targeting `node`
- Run `bun run compile.ts`
- Open [./dist/index.js](./dist/index.js) to see the output
  - The body of `__require` tries to access `import.meta.require` – _this is not a Node.js API_
- Run `node ./dist/index.js` with _any_ version of node.
  - This fails with `TypeError: (intermediate value).require is not a function`
