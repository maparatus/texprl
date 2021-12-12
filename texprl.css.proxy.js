// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".texprl input[type=\"date\"],\n.texprl input[type=\"datetime-local\"] {\n  width: 1em;\n  height: 1em;\n  vertical-align: middle;\n}\n\n.texprl input[type=\"datetime-local\"]::-webkit-datetime-edit-fields-wrapper,\n.texprl input[type=\"date\"]::-webkit-datetime-edit-fields-wrapper {\n  display: none;\n}\n\n.texprl input[type=\"datetime-local\"]::-webkit-calendar-picker-indicator,\n.texprl input[type=\"date\"]::-webkit-calendar-picker-indicator {\n  margin: 0;\n  opacity: 0;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}