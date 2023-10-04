//
const STATUS_IDLE = 0;
const STATUS_WORKING = 1;

let pibWorker = null;
let pibPromise = null;
let updatePreview = null;
let pibIsLoaded = false;
let pibOutput = "";
let pibTimeout = null;

let pibStatus = STATUS_IDLE;

const defaultWorkerPath = "/js/pib/pib-worker-asm.js";

const closingHTML = '</html>';

const appendPibOutput = (value) => {
  if (pibOutput === '' && value.startsWith(closingHTML)) {
    value = value.slice(closingHTML.length);
  }
  pibOutput = pibOutput + value;
};

const createPIB = (workerPath = defaultWorkerPath) => {
  if (!pibPromise) {
    pibWorker = new Worker(workerPath);
    pibPromise = new Promise((resolve) => {
      pibWorker.onmessage = ({data}) => {
        const actions = {
          'pib.initialized': () => {
            pibIsLoaded = true;
            console.log("PIB is loaded");
            resolve('PHP is loaded');
          },
          'pib.print': () => {
            if (data.type === 'php') {
              appendPibOutput(data.args[0]);
            }
          },
          'pib.error': () => {
            console.error('[PIB] Got error', data.type, data.args);
          },
          'pib.done': () => {
            updatePreview(pibOutput);
            if (pibTimeout) {
              clearTimeout(pibTimeout);
              pibTimeout = null;
            }
            pibOutput = '';
            pibStatus = STATUS_IDLE;
          },
        };

        actions[data.eventType]();
      };

      pibWorker.onerror = (value) => {
        console.error(value);
      };
    });
  }

  return pibPromise;
};

export const createCompilePhp = (workerPath) => {
  const compilePhp = async (code) => {
    if (pibStatus === STATUS_WORKING) {
      return Promise.resolve('<b>PIB is not ready</b>');
    }

    return new Promise((resolve /*, reject */) => {
      updatePreview = (phpCode) => resolve(phpCode);

      const stopWorkerOnTimeout = () => {
        if (pibWorker) {
          pibWorker.terminate();
          pibWorker = null;
          pibStatus = STATUS_IDLE;
          pibIsLoaded = false;
          pibPromise = null;
          createPIB(workerPath);
        }

        pibOutput += '<hr><b>Timeout error</b>';

        updatePreview(pibOutput);

        pibOutput = '';
        pibTimeout = null;
      };

      const runPIB = () => {
        let phpCode = `?>${code}`;

        pibOutput = '';

        if (pibWorker) {
          pibWorker.postMessage({eventType: 'run', code: phpCode, opts: {}});
          pibStatus = STATUS_WORKING;

          pibTimeout = setTimeout(stopWorkerOnTimeout, 1000);
        }
      };

      if (!pibIsLoaded) {
        return createPIB(workerPath).then(runPIB);
      } else {
        return runPIB();
      }
    });
  }

  return compilePhp;
}
