import { plugin, fromArrayAst, toArrayAst } from "./parser/index.js";
import { widgetsPlugin } from "./widgets";
import runtimeMarks from "./marks/runtime.js";

export { RuntimeError } from "./errors";
export { toArrayAst, fromArrayAst };


class TexprlEditor {

  constructor(opts = {}) {
    this.lookup = opts.lookup ? opts.lookup : [];
    this.runtime = opts.runtime ? opts.runtime: (() => {});
    this._widgetPlugin = widgetsPlugin(this);
    this._parserPlugin = plugin(this.onLookup);
    this._runtimePlugin = runtimeMarks(this);
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
