//

const { rollup } = require("rollup/dist/rollup.browser");

const hypothetical = require("rollup-plugin-hypothetical");
const jsx = require("rollup-plugin-jsx");

const files = {
  "./index.js": "import { Foo as Bar } from './d/foo.jsx'; ReactDOM.render(<Bar/>, document.getElement('body'));",
  "./d/foo.jsx": "export const Foo = () => (<h1>Hello, title</h1>);"
};

const plugins = [
  hypothetical({
    files
  }),
  jsx({ factory: 'React.createElement' }),
];

const options = {
  input: "./index.js",
  plugins,
};

rollup(options).then((bundle) => {
  return bundle.generate({ format: 'esm' });
}).then(({ output }) => {
  console.log(output[ 0 ].code);
});
