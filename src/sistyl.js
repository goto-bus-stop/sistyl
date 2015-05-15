export default function sistyl(defaults) {
  return new sistyl.Sistyl(defaults)
}

sistyl.Sistyl = class Sistyl {

  // sistyl constructor, takes an optional default set of rulesets
  constructor(defaults = {}) {
    this._rules = {}

    if (defaults) this.set(defaults)
  }

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
      if (props instanceof Sistyl) props = props.rulesets()
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
      if (sel instanceof Sistyl) sel = sel.rulesets()
      Object.keys(sel).forEach(selector => {
        this.set(selector, sel[selector])
      })
    }

    return this
  }

  // .unset() removes a ruleset from the sistyl instance, that
  // corresponds to the given selector.
  // Note that it removes *just* the given selector, and not
  // other rulesets that also match the selector. Specifically,
  // .unset('.rem') does *not* remove a '.keep, .rem' selector.
  //
  // style.unset('.selector') // removes the `.selector {}`
  //                          // ruleset
  // style.unset('.selector', // removes the `color` property
  //             'color')     // from the `.selector` ruleset.
  unset(selector, prop) {
    if (prop !== undefined) {
      delete this._rules[selector][prop]
    }
    else {
      delete this._rules[selector]
    }
    return this
  }

  // returns the flattened rulesets on this sistyl object
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
  }

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

}