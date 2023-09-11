import './style.css'

import { WebContainer } from "@webcontainer/api";
import { files } from "./files";

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('.preview iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('.editor textarea');

const installDependencies = async (container) => {
  const installProcess = await container.spawn('npm', ['install']);

  return installProcess.exit;
};

const startDevServer = async (container) => {
  const devProcess = await container.spawn("npm", ["start"]);

  devProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));

  container.on("server-ready", (port, url) => {
    console.log({ msg: "server-ready" });
    iframeEl.src = url;
    console.log({ port, url });
  });

  container.on("error", (error) => {
    console.error("Got error: " + error.message);
  });

  container.on("port", (port) => {
    console.log("Got port: " + port);
  });
}

const writeIndexJs = async (container) => {
  await container.fs.writeFile("/index.js", textareaEl.value);
}

window.addEventListener('load', async () => {
  textareaEl.value = files["index.js"].file.contents;

  const container = await WebContainer.boot();

  await container.mount(files);

  const exitCode = await installDependencies(container);
  if (exitCode !== 0) {
    throw new Error("Installation failed");
  }

  textareaEl.addEventListener('input', () => {
    writeIndexJs(container);
  });

  startDevServer(container);
});

