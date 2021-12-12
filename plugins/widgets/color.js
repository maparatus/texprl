import Color from "../../_snowpack/pkg/color.js";
import { Decoration, WidgetType } from "../../_snowpack/pkg/@codemirror/view.js";

export default class ColorWidget extends WidgetType {
  constructor(color, { value, mode }) {
    super();
    this.mode = mode;
    this.color = Color[mode](...color);
    this.value = value;
  }

  static treeEnter(view, type, from, to) {
    let value = view.state.doc.sliceString(from, to);
    if (
      type.name === "FunctionExpr" &&
      (value.match(/^(rgb)\((?:(.*),(.*),(.*))?\)/) ||
        value.match(/^(hsl)\((?:(.*),(.*),(.*))?\)/))
    ) {
      const mode = RegExp.$1;

      let deco = Decoration.widget({
        widget: new ColorWidget(
          [parseInt(RegExp.$2), parseInt(RegExp.$3), parseInt(RegExp.$4)],
          {
            view,
            value,
            mode,
          }
        ),
        side: 1,
      });
      return deco.range(from);
    }
  }

  findSelf(view) {
    for (let decoration of view.docView.decorations) {
      let cursor = decoration.iter();
      while (cursor.value) {
        if (cursor.value && cursor.value.widget === this) {
          return {
            from: cursor.from,
            to: cursor.to,
            value: cursor.value.widget,
          };
        }
        cursor.next();
      }
    }
    return false;
  }

  hexToMode(hex) {
    const obj = Color(hex)[this.mode]().color;
    let out;
    const alpha = Color(hex).alpha();

    if (this.mode === "hsl") {
      const h = parseInt(obj[0]);
      const s = parseInt(obj[1]);
      const l = parseInt(obj[2]);
      if (alpha < 1) {
        out = `hsla(${h}, ${s}, ${l}, ${alpha})`;
      } else {
        out = `hsl(${h}, ${s}, ${l})`;
      }
    } else {
      const [r, g, b] = obj;
      if (alpha < 1) {
        out = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else {
        out = `rgb(${r}, ${g}, ${b})`;
      }
    }

    return out;
    // return this.hexToRgb(hex).replace(/^rgb/, "hsl");
  }

  hexToRgb(hex) {
    const matches = hex.match(/^#(..)(..)(..)$/);
    const r = parseInt(matches[1], 16);
    const g = parseInt(matches[2], 16);
    const b = parseInt(matches[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  asHex(color) {
    return color.hex();
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }

  toDOM(view) {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-boolean-toggle";
    const input = document.createElement("input");
    input.setAttribute("type", "color");

    input.setAttribute("value", this.color.hex());

    input.addEventListener("change", (e) => {
      input.style.backgroundColor = e.target.value;
      input.setAttribute("value", e.target.value);

      const match = this.findSelf(view);

      if (match) {
        const { from, to } = match;

        const changes = {
          from,
          to: to + this.value.length,
          insert: this.hexToMode(e.target.value),
        };
        const update = view.state.update({ changes });
        view.update([update]);
      }
    });

    input.addEventListener("input", (e) => {
      input.style.backgroundColor = e.target.value;
    });

    let box = wrap.appendChild(input);
    const hex = this.color.hex();
    box.style = `
      display: inline-block;
      background: ${hex};
      width: 0.8em;
      height: 0.8em;
      vertical-align: middle;
      border-radius: 2px;
      border: solid 1px #000;
      margin-right: 0.2em;
      margin-left: 0.1em;
    `;
    return wrap;
  }

  ignoreEvent(e) {
    return false;
  }
}
