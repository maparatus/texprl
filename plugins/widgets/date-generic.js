import { WidgetType } from "../../_snowpack/pkg/@codemirror/view.js";

export default class DateGenericWidget extends WidgetType {
  constructor(value, { includeTime }) {
    super();
    this.value = value;
    this.includeTime = includeTime;
  }

  toDOM(view) {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-boolean-toggle";

    const input = document.createElement("input");
    input.setAttribute("type", this.includeTime ? "datetime-local" : "date");
    input.setAttribute("value", this.value);
    input.style = `
      background: #c1c1c1;
      border: solid 1px #333;
      border-radius: 2px;
    `;

    input.addEventListener("change", (e) => {
      input.style.backgroundColor = e.target.value;
      input.setAttribute("value", e.target.value);

      const from = view.posAtDOM(wrap);

      if (from) {
        const changes = {
          from: from - this.value.length - 2,
          to: from,
          insert: `"${e.target.value}"`,
        };
        const update = view.state.update({ changes });
        view.update([update]);
      }
    });

    let box = wrap.appendChild(input);
    return wrap;
  }

  ignoreEvent(e) {
    return false;
  }
}
