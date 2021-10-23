import {
  StateEffect,
  StateField,
  EditorState,
  SelectionRange,
  Compartment,
} from "@codemirror/state";
import { keymap, Decoration } from "@codemirror/view";
import { basicSetup, EditorView } from "@codemirror/basic-setup";
import { defaultKeymap } from "@codemirror/commands";
import { indentMore, indentLess } from "@codemirror/commands";
import {
  PluginField,
  WidgetType,
  ViewUpdate,
  ViewPlugin,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { parser, wast, fromArrayAst, toArrayAst } from "./parser/index.js";
import { h, render } from "preact";
import { v4 as uuidv4 } from "uuid";
import Color from "color";
import stringify from "json-stringify-pretty-compact";
import {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget,
} from "./widgets";
import runtimeMarks from "./marks/runtime.js";

export {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget,
};

export { toArrayAst, fromArrayAst };

export class RuntimeError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.path = opts.path;
  }
}

const nullFunction = () => {};

function addWidgets(view, texprl) {
  let widgets = [];

  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (type, from, to) => {
        [
          BooleanWidget,
          ColorWidget,
          DateTimeWidget,
          DateWidget,
          ReferenceWidget,
        ].forEach((widgetClass) => {
          const widget = widgetClass.treeEnter(view, type, from, to, texprl);
          if (widget) {
            widgets.push(widget);
          }
        });
      },
    });
  }

  return Decoration.set(widgets);
}

const widgetsPlugin = (texprl) => {
  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = addWidgets(view, texprl);
      }

      update(update) {
        this.decorations.chunk.forEach((chunk) => {
          chunk.value.forEach((v) => {
            if (v.widget.update) {
              v.widget.update(update);
            }
          });
        });

        if (update.docChanged || update.viewportChanged) {
          this.decorations = addWidgets(update.view, texprl);
        }
      }
    },
    {
      decorations: (v) => {
        return v.decorations;
      },
      provide: EditorView.updateListener.of((update) => {}),
    }
  );
};

export class TexprlEditor {
  constructor(container, initialDoc, opts = {}) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.classList.add("texprl");
    this.container.appendChild(this.element);
    this.widgets = [].concat(opts.widgets);
    this.functions = [].concat(opts.functions);
    this.lookup = opts.lookup ? opts.lookup : [];
    this.onDispatch = opts.onDispatch || nullFunction;
    this._runtimeEffects = [];
    this.runtime = opts.runtime;

    this._setupCodemirror(initialDoc);
  }

  _onDispatch = (transaction) => {
    this.onDispatch(this);
    // console.log("transaction.effects", transaction, transaction.effects);
    // transaction.effects = this._runtimeEffects;
    // transaction.effects = transaction.effects.concat(this._runtimeEffects);
    this.view.update([transaction]);
  };

  autoFormat = () => {
    const formattedText = fromArrayAst(toArrayAst(this.view, this), this);
    console.log("autoFormat", { formattedText });
    const state = this.view.state;
    this.view.dispatch({
      changes: [
        {
          from: 0,
          to: state.doc.length,
          insert: formattedText,
        },
      ],
    });
  };

  checkLookupFromBackendId = (key) => {
    // TODO: This should be contextual.
    const arr = [];
    const found = this.lookup
      .flatMap((i) => i.values)
      .find((item) => {
        return item.backendId === key;
      });
    return found;
  };

  checkLookup = (key) => {
    // TODO: This should be contextual.
    const arr = [];
    const found = this.lookup
      .flatMap((i) => i.values)
      .find((item) => {
        return item.editorId === key;
      });
    return found;
  };

  _setupCodemirror(initialDoc) {
    const language = new Compartment();
    const tabSize = new Compartment();

    let startState = EditorState.create({
      doc: initialDoc || "",
      extensions: [
        widgetsPlugin(this),
        basicSetup,
        language.of(
          wast(() => {
            return this.lookup.flatMap((i) => i.values);
          })
        ),
        keymap.of([
          ...defaultKeymap,
          {
            key: "Tab",
            preventDefault: true,
            run: indentMore,
          },
          {
            key: "Shift-Tab",
            preventDefault: true,
            run: indentLess,
          },
        ]),
        runtimeMarks(this),
      ],
    });

    this.view = new EditorView({
      state: startState,
      parent: this.element,
      dispatch: this._onDispatch,
    });

    this.onDispatch(this);
  }

  setLookup(lookup) {
    this.lookup = [].concat(lookup);
  }
}
