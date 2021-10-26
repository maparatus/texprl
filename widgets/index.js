import { ViewPlugin } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Decoration, EditorView } from "@codemirror/view";
import BooleanWidget from "./boolean.js";
import ColorWidget from "./color.js";
import DateTimeWidget from "./datetime.js";
import DateWidget from "./date.js";
import ReferenceWidget from "./reference.js";

export {
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget,
};

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

export function widgetsPlugin (texprl) {
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
}

