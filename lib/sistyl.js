(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.sistyl = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  module.exports = sistyl;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function sistyl(defaults) {
    return new sistyl.Sistyl(defaults);
  }

  sistyl.Sistyl = (function () {

    // sistyl constructor, takes an optional default set of rulesets

    function Sistyl() {
      var defaults = arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Sistyl);

      this._rules = {};

      if (defaults) this.set(defaults);
    }

    _createClass(Sistyl, [{
      key: 'set',

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
      value: function set(sel, props) {
        var _this = this;

        var rules = this._rules;
        if (props) {
          if (props instanceof Sistyl) props = props.rulesets();
          Object.keys(props).forEach(function (prop) {
            var val = props[prop];
            if (typeof val === 'object') {
              // nested rules
              _this.set('' + sel + ' ' + prop, val);
            } else {
              if (!(sel in _this._rules)) {
                _this._rules[sel] = {};
              }
              _this._rules[sel][prop] = val;
            }
          });
        } else {
          if (sel instanceof Sistyl) sel = sel.rulesets();
          Object.keys(sel).forEach(function (selector) {
            _this.set(selector, sel[selector]);
          });
        }

        return this;
      }
    }, {
      key: 'unset',

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
      value: function unset(selector, prop) {
        if (prop !== undefined) {
          delete this._rules[selector][prop];
        } else {
          delete this._rules[selector];
        }
        return this;
      }
    }, {
      key: 'rulesets',

      // returns the flattened rulesets on this sistyl object
      // i.e. after
      //
      //   style.set({ '.parent': { '.child': {} } })
      //
      // `style.rulesets()` will return
      //
      //   { '.parent .child': {} }
      //
      value: function rulesets() {
        return this._rules;
      }
    }, {
      key: 'toString',

      // formats the current rulesets as a valid CSS string
      // (unless you set invalid property values, but then
      // you're to blame!)
      value: function toString() {
        var str = '';
        var rules = this._rules;
        Object.keys(rules).forEach(function (selector) {
          var ruleset = rules[selector];
          str += '' + selector + ' {\n';
          Object.keys(ruleset).forEach(function (property) {
            str += '  ' + property + ': ' + ruleset[property] + ';\n';
          });
          str += '}\n\n';
        });
        return str;
      }
    }]);

    return Sistyl;
  })();
});