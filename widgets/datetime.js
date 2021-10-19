import {Decoration} from "@codemirror/view";
import DateGenericWidget from "./date-generic.js";

export default class DateTimeWidget extends DateGenericWidget {
  constructor(value) {
    super(value, {includeTime: true});
  }

  static treeEnter (view, type, from, to) {
    let value = view.state.doc.sliceString(from, to);

    if (
      type.name === "String" &&
      value.match(/^"([0-9]{4,4}-[0-9]{2,2}-[0-9]{2,2}T[0-9]{2,2}:[0-9]{2,2})"$/)
    ) {
      const widget = new DateTimeWidget(RegExp.$1, {view, includeTime: true});

      let deco = Decoration.widget({
        widget: widget,
        side: 1,
      })
      return deco.range(to);
    }
  }
}
