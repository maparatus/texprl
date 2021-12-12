import { Decoration, WidgetType } from "../../_snowpack/pkg/@codemirror/view.js";

export default class ReferenceWidget extends WidgetType {
  constructor(id, { parent }) {
    super();
    this.parent = parent;
    this.id = id;
  }

  static treeEnter(view, type, from, to, parent) {
    let value = view.state.doc.sliceString(from, to);

    if (type.name === "Lookup" && value.match(/^(#([^"]*))$/)) {
      const widget = new ReferenceWidget(RegExp.$2, { parent });

      let deco = Decoration.widget({
        widget: widget,
        side: 1,
      });
      return deco.range(from + value.length);
    }
  }

  toDOM(view) {
    let wrap = document.createElement("span");
    wrap.style = `
      color: #555;
      padding: 0 2px;
      font-style: italic;
      background: #eee;
      margin: 0 2px;
      border-radius: 2px;
      border: solid 1px #ccc;
    `;

    const lookupValue = this.parent.checkLookup(this.id);
    if (lookupValue) {
      wrap.innerText = lookupValue.name;
    } else {
      wrap.setAttribute("aria-labal", "invalid");
      wrap.innerText = "???";
    }
    return wrap;
  }

  ignoreEvent(e) {
    return false;
  }
}
