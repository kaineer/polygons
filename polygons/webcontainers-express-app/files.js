/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  // res.send('Welcome to a WebContainers app! 🥳');
  res.send("<html><body><a href='/foo'>Hello html</a></body></html>");
});

app.get('/foo', (req, res) => {
  res.send("<html><body><a href='/'>Go back</a></body></html>");
});

app.listen(port, () => {
  console.log(\`App is alive at http://localhost:\${port}\`);
});`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon index.js"
  }
}`,
    },
  },
};
