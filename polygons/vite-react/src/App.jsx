import './App.css'

import shim from "process"
import { useState } from "react"
import { createCompilePhp } from "./worker"


import { createBundler } from "@dev/bundle-document"

import { Buffer } from 'buffer'

window.Buffer = Buffer;

function App() {
  const compilePhp = createCompilePhp("/js/pib/pib-worker-asm.js");
  const [html, setHtml] = useState("");

  const handleChange = (evt) => {
    const bundler = createBundler();

    bundler.addFile("part.php", "<?php \n$name = 'Bobby'; ?>");
    bundler.addFile("style.css", "h1 { color: #f06d06; }");

    // NOTE: doesn't work without html after code
    const value = evt.target.value + " ";
    bundler.addFile("index.php", value);

    const saveBuffer = Buffer;

    window.Buffer = saveBuffer;

    bundler.buildPhp("index.php").then((phpCode) => {
      window.Buffer = undefined;
      return compilePhp(phpCode).then((x) => {
        console.log({ phpCode: x });
        return x;
      });
    }).then((r) => {
      return bundler.buildHtmlFromSource(r);
    }).then((r) => {
      setHtml(r);
    }).catch((err) => {
      console.log({ error: err.toString() });
    });
  }

  return (
    <div className="App">
      <textarea rows="40" cols="80" name="php"
       onChange={ handleChange }></textarea>

      <div dangerouslySetInnerHTML={ { __html: html } } />
    </div>
  )
}

export default App
