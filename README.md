# Vanilla-Extract, Next Dev

This demonstrates how `@vanilla-extract/babel-plugin-debug-ids` fails to generate consistent debug identifiers between server and client environments when run in `next dev`. This branch is an absolute bare-bones Next.js application – one page, an `_app.tsx`, one vanilla-extract file with `createTheme`, and the `next.config.js`.

To trigger the issue, run `yarn install && yarn dev` and visit http://localhost:3000. Next.js will give an error in the console showing that there is a mismatch from the server rendered code and the client rendered code.

The code generated for the server will correctly generate the debug id as `theme_systemStylesClass__XXXXXXXX`. The code generated on for client however will generate a debug id of `theme_ref__XXXXXXXX`. This means that the generated style sheet has a different class than the class that is applied to the element, causing styles to fail.

The issue involves [this section](https://github.com/vanilla-extract-css/vanilla-extract/blob/9312b66e5bd67942b7929a6b93e0ad2181b2e0ba/packages/babel-plugin-debug-ids/src/index.ts#L77-L99) in `@vanilla-extract/babel-plugin-debug-ids` that is responsible for handling a specific export format of `createTheme`. This code only handles one scenario:

```js
export const [themeClass, vars] = createTheme({});
```

when it's compiled to:

```js
var _createTheme = createTheme({}),
  _createTheme2 = _slicedToArray(_createTheme, 2),
  themeClass = _createTheme2[0],
  vars = _createTheme2[1];
```

But if you look at the generated code output by Next.js' SWC, it is actually:

```js
var ref = _slicedToArray(createTheme({}), 2);
export var themeClass = ref[0],
  vars = ref[1];
```

And if the consumer instead uses:

```js
const [themeClass, vars] = createTheme({});
export { themeClass, vars };
```

then there is yet another permutation:

```js
var ref = _slicedToArray(createTheme({}), 2),
  themeClass = ref[0],
  vars = ref[1];
export { themeClass, vars };
```

TL;DR: `@vanilla-extract/babel-plugin-debug-ids` needs to be updated to handle a wider range of scenarios for `createTheme`.
