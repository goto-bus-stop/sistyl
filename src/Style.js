import assign from 'object-assign'

// Style constructor, takes an optional default set of rulesets
export default function Style(defaults) {
  if (!(this instanceof Style)) return new Style(defaults)
  this._rules = {}

  if (typeof defaults === 'object') {
    this.set(defaults)
  }
}

assign(Style.prototype, {

  // .set() takes a selector name and an object of properties
  // and nested rulesets (passing an object as a property value)
  // Alternatively, it takes an object of rulesets, the keys
  // being selectors and the values being rulesets (incl. nested)
  //
  //   style.set('.selector', { 'css-prop': 'value' })
  //   style.set('.selector', {
  //     '.nested': { 'prop': 'value' },
  //     'sibling-prop': 'sibling'
  //   })
  //   style.set({
  //     '.selector-1': { 'css-prop': 'one' },
  //     '.selector-2': { 'css-prop': 'two' }
  //   })
  set(sel, props) {
    const rules = this._rules
    if (props) {
      Object.keys(props).forEach(prop => {
        const val = props[prop]
        if (typeof val === 'object') {
          // nested rules
          this.set(`${sel} ${prop}`, val)
        }
        else {
          if (!(sel in this._rules)) {
            this._rules[sel] = {}
          }
          this._rules[sel][prop] = val
        }
      })
    }
    else {
      Object.keys(sel).forEach(selector => {
        this.set(selector, sel[selector])
      })
    }

    return this
  },

  // returns the flattened rulesets on this Style object
  // i.e. after
  //
  //   style.set({ '.parent': { '.child': {} } })
  //
  // `style.rulesets()` will return
  //
  //   { '.parent .child': {} }
  //
  rulesets() {
    return this._rules
  },

  // formats the current rulesets as a valid CSS string
  // (unless you set invalid property values, but then
  // you're to blame!)
  toString() {
    let str = ''
    const rules = this._rules
    Object.keys(rules).forEach(selector => {
      const ruleset = rules[selector]
      str += `${selector} {\n`
      Object.keys(ruleset).forEach(property => {
        str += `  ${property}: ${ruleset[property]};\n`
      })
      str += '}\n\n'
    })
    return str
  }

})