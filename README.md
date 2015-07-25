# sistyl
Simple JSON-to-CSS style sheet library.

[![NPM](https://nodei.co/npm/sistyl.png?compact=true)](https://nodei.co/npm/sistyl)

## Usage

```javascript
const sistyl = require('sistyl')

let st = sistyl({

  '.selector': {
    'color': '#111',
    'background': '#333',

    '.larger': { 'font-size': '125%' }
  },

  '.hidden': { 'display': 'none !important' }

})

// #111 on a #333 background is kind of hard to read…
st.set('.selector', { 'color': '#eee' })

st.toString()
/* →
 * .selector {
 *   color: #eee;
 *   background: #333;
 * }
 *
 * .selector .larger {
 *   font-size: 125%;
 * }
 *
 * .hidden {
 *   display: none !important;
 * }
 */
```

## API

### let st = sistyl(rulesets={})

Creates a sistyl object with an optional default bunch of rulesets.

### st.set(selector, properties)

Sets some CSS properties for a selector. `properties` can contain
nested rulesets as objects or sistyl instances. Properties are merged
if the selector already exists.

```javascript
st.set('.selector', {
  'background': 'pink',
  '.nested': { 'background': 'orange' }
})
```

### st.set(rulesets)

Adds rulesets. Takes an object where keys are selectors and values
are css properties, or a sistyl instance, just like in
`st.set(selector, properties)`.

### st.unset(selector)

Removes a ruleset. Takes a CSS selector, and removes the associated
ruleset. Note that it removes *just* the given selector, and not
other rulesets that also match the selector. Specifically,
`.unset('.rem')` does *not* remove a `.keep, .rem` selector.

### st.unset(selector, property)

Removes a property from a ruleset. The same notes apply as above:
only properties on the *exact* selector string will be removed.

### st.toString()

Returns the CSS string for this sistyl object. Rulesets are separated
by a newline, and are indented by two spaces.

```css
.selector {
  background: pink;
}

.selector .nested {
  background: orange;
}

```

## License

[MIT](./LICENSE)
