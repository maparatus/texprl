import { StateEffect, StateField, EditorState, SelectionRange, Compartment } from "@codemirror/state";
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

export {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget,
};

export { toArrayAst, fromArrayAst };

export class RuntimeError extends Error {
  constructor (message, opts={}) {
    super(message);
    this.path = opts.path;
  }
}

const nullFunction = () => {};

const addUnderline = StateEffect.define();
const underlineMark = Decoration.mark({class: "cm-underline"})

const underlineField = StateField.define({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)

    for (let e of tr.effects) if (e.is(addUnderline)) {
      underlines = underlines.update({
        add: [underlineMark.range(e.value.from, e.value.to)],
        // filter: (from, to, value) => {
        //   return false;
        // }
      })
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f)
})

const underlineTheme = EditorView.baseTheme({
  ".cm-underline": {
    "border-bottom": "1px dotted #ff0000",
  }
})

function addWidgets(view, texprl) {
  let widgets = [];
  console.log("==================================================");

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
        console.log("this.decorations", this.decorations);
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
      provide: EditorView.updateListener.of((update) => {
        console.log("foobar", update);
      }),
    }
  );
};

function walk (arr, path) {
  let out = arr;
  let idx = 0;
  let len = path.length;
  while (idx < len) {
    out = out.children[path[idx]];
    idx++;
  }
  return out;
}

// Effects can be attached to transactions to communicate with the extension
const addMarks = StateEffect.define(), filterMarks = StateEffect.define()

function toJson (obj) {
  if (Array.isArray(obj.value)) {
    return obj.value.concat(obj.children.map(toJson))
  }
  else {
    return obj.value;
  }
}

// This value must be added to the set of extensions to enable this
const markField = (texprl) => {
  return StateField.define({
    // Start with an empty set of decorations
    create() { return Decoration.none },
    // This is called whenever the editor updates—it computes the new set
    update(value, tr) {
      console.log("markField:update", value, tr, tr.state);

      const ast = toArrayAst(tr.state, texprl);
      const json = toJson(ast);
      const result = texprl.runtime(json[0]);

      // Move the decorations to account for document changes
      value = value.map(tr.changes);

      const ev = [
        addMarks.of([strikeMark.range(1, 4)]),
        addMarks.of([strikeMark.range(10, 14)]),
      ];

      console.log("markField:ev", ev);
      value = value.update({
        filter: () => false,
      });

      result.errors.forEach(error => {
        const node = walk(ast, error.path);
        const {from, to} = node;
        console.log("markField:e=", error, node)

        const mark = addMarks.of([
          strikeMark.range(
            from < to ? from : from-1,
            to
          ),
        ]);
        value = value.update({
          add: mark.value,
        });
      });

      // If this transaction adds or removes decorations, apply those changes
      // for (let effect of tr.effects) {
      //   if (effect.is(addMarks)) value = value.update({add: effect.value, sort: true})
      //   else if (effect.is(filterMarks)) value = value.update({filter: effect.value})
      // }
      return value
    },
    // Indicate that this field provides a set of decorations
    provide: f => EditorView.decorations.from(f)
  })
};

const strikeMark = Decoration.mark({
  attributes: {
    style: "border-bottom: dotted 2px red;"
  }
})

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

  setRuntimeErrors (errors) {
    const ast = toArrayAst(this.view, this);

    console.log("TODO: setRuntimeErrors", errors, ast, this.view);
    return;

    let effects = [];
    effects.push(addUnderline.of({
      from: 0,
      to: 2,
    }));

    errors.forEach(error => {
      const node = walk(ast, error.path);
      console.log("TODO: node", node);
      if (node.to < ast.to-1 && node.from < node.to) {
        effects.push(addUnderline.of({
          from: node.from,
          to: node.to,
        }));
      }
      else {
        console.log("!!!!! skipping");
      }
    });

    console.log("???? effects", effects);
    effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]));
    this._runtimeEffects = effects;
    // this.view.dispatch({effects});
  }

  _onDispatch = (transaction) => {
    this.onDispatch(this);
    // console.log("transaction.effects", transaction, transaction.effects);
    // transaction.effects = this._runtimeEffects;
    // transaction.effects = transaction.effects.concat(this._runtimeEffects);
    console.log("_onDispatch", transaction);
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
    console.log(this.lookup);
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
    console.log(this.lookup);
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
        EditorView.updateListener.of((update) => {
          // this.setRuntimeErrors([]);
          console.log("updateListener", update);
        }),
        markField(this),
      ],
    });

    this.view = new EditorView({
      state: startState,
      parent: this.element,
      dispatch: this._onDispatch,
    });

    // this.view.dispatch({
    //   effects: addMarks.of([strikeMark.range(1, 4)])
    // });

    this.onDispatch(this);
  }

  setLookup(lookup) {
    this.lookup = [].concat(lookup);
  }
}
