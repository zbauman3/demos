const { readdir } = require('fs/promises');

const result = await readdir('../')

console.log("Hello via Node?");
console.log(result);