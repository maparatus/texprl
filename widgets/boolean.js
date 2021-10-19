import {Decoration, WidgetType} from "@codemirror/view";

export default class BooleanWidget extends WidgetType {
  constructor(checked, {value}) {
    super();
    this.value = value;
    this.checked = checked;
  }

  static treeEnter (view, type, from, to) {
    if (type.name == "Bool") {
      let value = view.state.doc.sliceString(from, to);
      let isTrue = value == "true";

      let deco = Decoration.widget({
        widget: new BooleanWidget(isTrue, {value}),
        side: 1
      })
      return deco.range(from);
    }
  }

  eq(other) {
    return other.checked == this.checked
  }

  toDOM(view) {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-boolean-toggle"
    const input = document.createElement("input");
    input.style = `
      margin: 0;
      margin-right: 0.2em;
      margin-left: 0.1em;
      vertical-align: middle;
      user-select: none;
    `;
    wrap.appendChild(input);
    input.type = "checkbox";
    input.checked = this.checked;
    input.addEventListener("change", (e) => {
      const el = e.target;
      const pos = view.posAtDOM(wrap);
      const change = {
        from: pos,
        to: pos + this.value.length,
        insert: el.checked ? "true" : "false",
      };
      view.dispatch({changes: change});
    })
    return wrap
  }

  ignoreEvent (e) {
    return false;
  }
}
