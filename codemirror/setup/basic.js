import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
} from "../../_snowpack/pkg/@codemirror/view.js";
import { history, historyKeymap } from "../../_snowpack/pkg/@codemirror/history.js";
import { indentOnInput } from "../../_snowpack/pkg/@codemirror/language.js";
import { defaultKeymap, indentMore, indentLess } from "../../_snowpack/pkg/@codemirror/commands.js";
import { bracketMatching } from "../../_snowpack/pkg/@codemirror/matchbrackets.js";
import { closeBrackets, closeBracketsKeymap } from "../../_snowpack/pkg/@codemirror/closebrackets.js";
import { autocompletion, completionKeymap } from "../../_snowpack/pkg/@codemirror/autocomplete.js";
import { defaultHighlightStyle } from "../../_snowpack/pkg/@codemirror/highlight.js";
import { EditorState } from "../../_snowpack/pkg/@codemirror/state.js";

const basicSetup = [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  defaultHighlightStyle.fallback,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  highlightActiveLine(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...completionKeymap,
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
];

export default basicSetup;
