import { Nodebox } from '@codesandbox/nodebox';

const emulator = new Nodebox({
  iframe: document.getElementById('preview'),
});

await emulator.connect();

await emulator.fs.init({
  'package.json': JSON.stringify({
    name: 'my-app',
  }),
  'index.js': `
import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.write('Hello world')
  res.end()
})

server.listen(3000, () => {
  console.log('Server is ready!')
})
  `,
});

const shell = emulator.shell.create();
await shell.runCommand('node', ['index.js']);

