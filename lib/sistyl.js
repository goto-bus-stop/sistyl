var splitSelector = require('split-selector');

module.exports = sistyl;

function sistyl(defaults) {
  var rules = {};
  var api = {
    set: set,
    unset: unset,
    rulesets: rulesets,
    toString: toString
  };

  if (defaults) set(defaults);

  return api;

  // concats and regroups selectors. Deals with nested groups like
  //
  //   expand('#a, #b', '.x, .y')
  //
  // returns:
  //
  //   '#a .x, #a .y, #b .x, #b .y'
  function expand(base, sub) {
    var children = splitSelector(sub);
    return splitSelector(base).reduce(function (selectors, parent) {
      return selectors.concat(children.map(function (child) {
        return parent + ' ' + child;
      }));
    }, []).join(', ');
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
  function set(sel, props) {
    if (props) {
      if (props && typeof props.rulesets === 'function') props = props.rulesets();
      Object.keys(props).forEach(function (prop) {
        var val = props[prop];
        if (typeof val === 'object') {
          // nested rules
          set(expand(sel, prop), val);
        } else {
          if (!(sel in rules)) {
            rules[sel] = {};
          }
          rules[sel][prop] = val;
        }
      });
    } else {
      if (sel && typeof sel.rulesets === 'function') sel = sel.rulesets();
      Object.keys(sel).forEach(function (selector) {
        set(selector, sel[selector]);
      });
    }

    return api;
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
  function unset(selector, prop) {
    if (prop !== undefined) {
      delete rules[selector][prop];
    } else {
      delete rules[selector];
    }
    return api;
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
  function rulesets() {
    return rules;
  }

  // formats the current rulesets as a valid CSS string
  // (unless you set invalid property values, but then
  // you're to blame!)
  function toString() {
    var str = '';
    Object.keys(rules).forEach(function (selector) {
      var ruleset = rules[selector];
      str += selector + ' {\n';
      Object.keys(ruleset).forEach(function (property) {
        str += '  ' + property + ': ' + ruleset[property] + ';\n';
      });
      str += '}\n\n';
    });
    return str;
  }
}