import { basicSetup } from "../codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import maplibreDefinition from "../maplibre";
import maplibregl from 'maplibre-gl'

import "maplibre-gl/dist/maplibre-gl.css"
import "../texprl.css";
import texprl, { toArrayAst } from "../texprl.js";

const map = new maplibregl.Map({
  container: document.querySelector(".main__map"),
  style: 'https://demotiles.maplibre.org/style.json',
  center: [-149.4937, 0],
  zoom: 0.1
});

let loaded;
map.on('load', function () {
  loaded = true;

  map.addSource('earthquakes', {
    "type": "geojson",
    "data": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  });

  updateLayers();
});

const expressions = {
  "circle-radius": [
    "interpolate", ["linear"], ["get", "mag"],
    2, 2,
    7, 4,
  ],
  "circle-color": [
    "interpolate-hcl", ["linear"], ["get", "mag"],
    -1, "blue",
    7, "red"
  ],
};

function updateLayers (id, val) {
  if (!loaded) return;

  if (id && val && val.length === 1) {
    expressions[id] = val[0];
  }

  if (map.getLayer('earthquakes')) {
    map.removeLayer('earthquakes');
  }

  console.log("expressions=", expressions);

  map.addLayer({
    'id': 'earthquakes',
    'type': 'circle',
    'source': 'earthquakes',
    'layout': {
      "circle-sort-key": ["get", "mag"],
    },
    'paint': {
      ...expressions,
    }
  });
}

const circleRadiusEl = document.querySelector(".texprl__radius");
const circleColorEl = document.querySelector(".texprl__color");

function toJson(obj) {
  if (Array.isArray(obj.value)) {
    return obj.value.concat(obj.children.map(toJson));
  } else {
    return obj.value;
  }
}

function createEditor (el, onChange, doc) {
  const texprlInstance = texprl({
    ...maplibreDefinition,
    lookup: () => {
      return [
        {backendId: "mag", editorId: "mag", name: "mag"},
        {backendId: "place", editorId: "place", name: "place"},
        {backendId: "time", editorId: "time", name: "time"},
        {backendId: "updated", editorId: "updated", name: "updated"},
        {backendId: "tz", editorId: "tz", name: "tz"},
        {backendId: "url", editorId: "url", name: "url"},
        {backendId: "detail", editorId: "detail", name: "detail"},
        {backendId: "felt", editorId: "felt", name: "felt"},
        {backendId: "cdi", editorId: "cdi", name: "cdi"},
        {backendId: "mmi", editorId: "mmi", name: "mmi"},
        {backendId: "alert", editorId: "alert", name: "alert"},
        {backendId: "status", editorId: "status", name: "status"},
        {backendId: "tsunami", editorId: "tsunami", name: "tsunami"},
        {backendId: "sig", editorId: "sig", name: "sig"},
        {backendId: "net", editorId: "net", name: "net"},
        {backendId: "code", editorId: "code", name: "code"},
        {backendId: "ids", editorId: "ids", name: "ids"},
        {backendId: "sources", editorId: "sources", name: "sources"},
        {backendId: "types", editorId: "types", name: "types"},
        {backendId: "nst", editorId: "nst", name: "nst"},
        {backendId: "dmin", editorId: "dmin", name: "dmin"},
        {backendId: "rms", editorId: "rms", name: "rms"},
        {backendId: "gap", editorId: "gap", name: "gap"},
        {backendId: "magType", editorId: "magType", name: "magType"},
        {backendId: "type", editorId: "type", name: "type"},
      ];
    }
  });

  function onChangeTexprl (v) {
    const ast = toArrayAst(v.view.state.doc, syntaxTree(v.view.state), texprlInstance);
    const json = toJson(ast);
    onChange(json);
  }

  const view = new EditorView({
    state: EditorState.create({
      doc: doc,
      extensions: [
        basicSetup,
        texprlInstance.plugin(),
        EditorView.updateListener.of(onChangeTexprl),
      ],
    }),
    parent: el,
  });
}

function onChangeRadius (json) {
  updateLayers("circle-radius", json);
}

function onChangeColor (json) {
  updateLayers("circle-color", json);
}

createEditor(circleRadiusEl, onChangeRadius, `interpolate(
  linear(), get("mag"),
  2, 2,
  7, 4,
)`);

createEditor(circleColorEl, onChangeColor, `interpolate_hcl(
  linear(), get("mag"),
  -1, rgb(0, 0, 255),
  7, rgb(255, 0, 0),
)`);

