import { Nodebox } from "@codesandbox/nodebox";

const previewIframe = document.getElementById("preview-iframe");
const nodeboxIframe = document.getElementById("nodebox-iframe");

(async () => {
  // Set up Nodebox and assign a bridge iframe
  const nodebox = new Nodebox({ iframe: nodeboxIframe });

  // Connect to the nodebox environment
  await nodebox.connect();

  // Write files to the node filesystem inside Nodebox
  await nodebox.fs.init({
    "package.json": JSON.stringify({
      dependencies: {
        express: "4.18.2",
      },
    }),
    "index.js": `const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello, hello, nodebox')
})

app.listen(port, () => {
  console.log(\`Example app listening on port \${port}\`)
})`,
  });

  // Create a shell interface to listen to events and start a command
  const shell = nodebox.shell.create();

  // Start a node command executing the index.js file (our Express.js server)
  // If there are any missing node_modules, Nodebox will automatically install them
  const { id } = await shell.runCommand("node", ["index.js"]);

  // Get the first URL the shell started and display it on an iframe
  const { url } = await nodebox.preview.getByShellId(id);
  previewIframe.src = url;
})();

