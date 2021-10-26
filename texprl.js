import basicSetup from "./codemirror/setup/basic";
import parserPlugin from "./plugins/parser";
import widgetsPlugin from "./plugins/widgets";
import runtimePlugin from "./plugins/runtime/index.js";

export { basicSetup };
export { RuntimeError } from "./errors";
export { toArrayAst, fromArrayAst } from "./parser/index.js";


class TexprlEditor {

  constructor(opts = {}) {
    this.lookup = opts.lookup ? opts.lookup : [];
    this.runtime = opts.runtime ? opts.runtime: (() => {});
    this.runtimeEnabled = false;

    // Initialize plugins...
    this._widgetPlugin = widgetsPlugin(this);
    this._parserPlugin = parserPlugin(this.onLookup);
    this._runtimePlugin = runtimePlugin(this);
  }

  setRuntimeEnabled (bool) {
    this.runtimeEnabled = !!bool;
  }

  checkLookupFromBackendId = (key) => {
    const arr = [];
    const found = this.lookup().find((item) => {
      return item.backendId === key;
    });
    return found;
  };

  checkLookup = (key) => {
    const arr = [];
    const found = this.lookup().find((item) => {
      return item.editorId === key;
    });
    return found;
  };

  onLookup = () => {
    return this.lookup();
  };

  plugin = () => {
    return [
      this._widgetPlugin,
      this._parserPlugin,
      this._runtimePlugin,
    ];
  }
}

export default function texprl (opts) {
  return new TexprlEditor(opts);
}
