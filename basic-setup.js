import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine} from "@codemirror/view"
import {history, historyKeymap} from "@codemirror/history"
import {indentOnInput} from "@codemirror/language"
import {defaultKeymap} from "@codemirror/commands"
import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {defaultHighlightStyle} from "@codemirror/highlight"
import {EditorState} from "@codemirror/state";

export const basicSetup = [
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
  ])
]
