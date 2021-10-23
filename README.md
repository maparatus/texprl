# texprl

**T**iny **expr**ession **l**anguage, is a very small language similar to languages found in speadsheets. Designed to create really simple expressions, no loops, function definition or complex control flow. Like spreadsheet formulas it's designed to be easy to learn.

The language doesn't have a runtime but rather generates the _json-expression_ syntax as an output. This is designed to be run by a backend like [maplibre][maplibre-expressions]/[mapbox-gl][mapbox-gl-expressions] expression engines or a custom runtime of your creation.

Rather than storing the textual representation of the code, it is expected you just store the _json-expression_ instead. There are methods to convert between the JSON and text representation.


## Install
Install the library

```
npm i orangemug/texprl --save
```


## Usage
...



## Developer setup

Steps

1.  `npm install`
2.  `npm run dev`

Go to <http://localhost:8000/demo/> to see a demo.


[mapbox-gl-expressions]: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
[maplibre-expressions]: https://docs.maptiler.com/gl-style-specification/expressions
