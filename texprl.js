import {EditorState, SelectionRange, Compartment} from "@codemirror/state";
import {keymap, Decoration} from "@codemirror/view";
import {basicSetup, EditorView} from "@codemirror/basic-setup"
import {defaultKeymap} from "@codemirror/commands";
import {indentMore, indentLess} from "@codemirror/commands";
import {PluginField, WidgetType, ViewUpdate, ViewPlugin} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {wast, fromArrayAst, toArrayAst} from './parser/index.js';
import {h, render} from 'preact';
import { v4 as uuidv4 } from 'uuid';
import Color from 'color';
import stringify from 'json-stringify-pretty-compact';
import {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget
} from './widgets';

export {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget
};

export {
  toArrayAst,
  fromArrayAst,
};

// export {
//   TexprlLanguageSupport,
//   texprlCompletion,
//   texprlParser,
//   texprl,
// }

function generatePluginFromWidgets (widgets) {
  return null;
}

function checkboxes(view, texprl) {
  let widgets = []
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (type, from, to) => {
        [
          BooleanWidget,
          ColorWidget,
          DateTimeWidget,
          DateWidget,
          ReferenceWidget
        ].forEach(widgetClass => {
          const widget = widgetClass.treeEnter(view, type, from, to, texprl);
          if (widget) {
            widgets.push(widget);
          }
        });
      }
    })
  }
  return Decoration.set(widgets);
}

const checkboxPlugin = (texprl) => {
  return ViewPlugin.fromClass(class {
    constructor(view) {
      this.decorations = checkboxes(view, texprl);
    }

    update(update) {
      console.log("this.decorations", this.decorations);
      this.decorations.chunk.forEach(chunk => {
        chunk.value.forEach(v => {
          if (v.widget.update) {
            v.widget.update(update);
          }
        })
      });

      if (update.docChanged || update.viewportChanged) {
        this.decorations = checkboxes(update.view, texprl);
      }
    }
  }, {
    decorations: (v) => {
      return v.decorations
    },
    provide: EditorView.updateListener.of(update => {
      console.log("foobar", update)
    }),
  })
}

export class TexprlEditor {
  constructor (container, initialDoc, opts={}) {
    this.container = container;
    this.element = document.createElement('div');
    this.element.classList.add("texprl");
    this.container.appendChild(this.element);
    this.widgets = [].concat(opts.widgets);
    this.functions = [].concat(opts.functions);
    this.lookup = opts.lookup ? opts.lookup : [];
    this._setupCodemirror(initialDoc);
    this.onDispatch = opts.onDispatch;
  }

  _onDispatch = (transaction) => {
    this.view.update([transaction]);
    this.onDispatch(this);
  }

  autoFormat = () => {
    const formattedText = fromArrayAst(toArrayAst(this.view, this), this);
    console.log("autoFormat", {formattedText});
    const state = this.view.state;
    this.view.dispatch({
      changes: [
        {
          from: 0,
          to: state.doc.length,
          insert: formattedText,
        }
      ]
    });
  }

  checkLookupFromBackendId = (key) => {
    // TODO: This should be contextual.
    const arr = [];
    console.log(this.lookup);
    const found = this.lookup.flatMap(i => i.values).find(item => {
      return item.backendId === key;
    })
    return found;
  };

  checkLookup = (key) => {
    // TODO: This should be contextual.
    const arr = [];
    console.log(this.lookup);
    const found = this.lookup.flatMap(i => i.values).find(item => {
      return item.editorId === key;
    })
    return found;
  };

  _setupCodemirror (initialDoc) {
    const language = new Compartment;
    const tabSize = new Compartment;

    let startState = EditorState.create({
      doc: initialDoc || '',
      extensions: [
        checkboxPlugin(this),
        basicSetup,
        language.of(wast(() => {
          return this.lookup.flatMap(i => i.values);
        })),
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
      ],
    })

    this.view = new EditorView({
      state: startState,
      parent: this.element,
      dispatch: this._onDispatch,
    });
  }

  setLookup (lookup) {
    this.lookup = [].concat(lookup);
  }
}
