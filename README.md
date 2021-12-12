# texprl

**T**iny **expr**ession **l**anguage, is a very small language similar to languages found in spreadsheets. Designed to create really simple expressions, no loops, function definition or complex control flow. Like spreadsheet formulas it's designed to be easy to learn.

The language doesn't have a runtime but rather generates the _json-expression_ syntax as an output. This is designed to be run by a backend like [maplibre][maplibre-expressions]/[mapbox-gl][mapbox-gl-expressions] expression engines or a custom runtime of your creation.

Rather than storing the textual representation of the code, it is expected you just store the _json-expression_ instead. There are methods to convert between the JSON and text representation.

## Features

Features
The features of the language include

- Numbers — `1`, `-1`, `3.14`, `-9.2`
- Strings — `"hello world"`
- Booleans — `true`, `false`
- Functions — `like_me(…)`
- References — `#130`, `#foobar`

References are fairly unique to texprl and not found in many other languages. They are a way to look up information from a known lookup table in an editor. For example if I have a function called `read` which accepts a UUID for a remote resource on a server, for example `read("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d")` it makes the code editor really verbose and messy/hard to read. The UUID will likely have a more human readable name somewhere in the system.

## Editor

The language comes bundled with a codemirror editor which is designed to make it easy for beginners to get started with. The aims align with the aims of the texprl language. The main feature is adding widgets next to key functions to allow them to be edited in a structured way.

For example if we encounter a string of the format `2020-10-02` we add a date picker next to the date. The user will then know what `2020-10-02` means by opening the picker. The idea is to educate the user with small UI hints.

Another example is the function `hsl(0,100,50)`. Developers might be well aware that the args to that function are `hue`, `saturation` and `lightness` however a user may be very inexperienced with this syntax. We display a color preview to let the user know that this represents a color and on click we allow the user to edit that color with the parts of the color labeled. The same is also true of `rgb(255, 0, 0)`

A full list of widgets in the editor so far are

- `color` — hsl/rgb/hex support to add color preview/picker
- `boolean` -
- `date` -
- `reference` -

The editor plugin also supports contextual autocomplete, we can define arguments on named functions. In [maplibre-expressions][maplibre-expressions] we have a [`get`][maplibre-expressions-get] method which returns data from the map feature properties. We can make the autocomplete for that function context aware and show the list of available properties. See [TODO]() for a demo of this.

## Install

Install the library

```
npm install orangemug/texprl --save
```

## Usage

...

[mapbox-gl-expressions]: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
[maplibre-expressions]: https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/
[maplibre-expressions-get]: https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/#get
