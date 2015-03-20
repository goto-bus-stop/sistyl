import { strictEqual, deepEqual } from 'assert'
import Style from '../src/Style'

describe('Style', () => {

  it('can be created with the Style constructor', () => {
    deepEqual(
      Style({ '.selector': { 'property': 'value' } }).rulesets(),
      { '.selector': { 'property': 'value' } }
    )
  })

  it('converts a JSON rulesets object into a valid CSS string', () => {
    strictEqual(
      Style({ '.selector': { 'property': 'value' } }).toString(),
      '.selector {\n' +
      '  property: value;\n' +
      '}\n' +
      '\n'
    )
  })

  it('rulesets are separated by two newlines', () => {
    strictEqual(
      Style({ 'a': { 'prop': 'val', 'prop2': 'val2' }
            , 'b': { 'prop3': 'val3', 'prop4': 'val4' } }).toString(),
      'a {\n' +
      '  prop: val;\n' +
      '  prop2: val2;\n' +
      '}\n' +
      '\n' +
      'b {\n' +
      '  prop3: val3;\n' +
      '  prop4: val4;\n' +
      '}\n' +
      '\n'
    )
  })

  it('supports nested rulesets', () => {
    deepEqual(
      Style({
        'parent': {
          'child': { 'property': 'value' }
        }
      }).rulesets(),
      {
        'parent child': { 'property': 'value' }
      }
    )
  })

  it('supports nested rulesets next to properties', () => {
    deepEqual(
      Style({
        '.panel': {
          'background': '#eee',
          '.header': {
            'font-size': '125%'
          }
        }
      }).rulesets(),
      {
        '.panel': { 'background': '#eee' },
        '.panel .header': { 'font-size': '125%' }
      }
    )
  })

  it('generates valid css for nested rulesets', () => {
    strictEqual(
      Style({
        '.panel': {
          'background': '#eee',
          '.header': {
            'font-size': '125%'
          }
        }
      }).toString(),
      '.panel {\n' +
      '  background: #eee;\n' +
      '}\n' +
      '\n' +
      '.panel .header {\n' +
      '  font-size: 125%;\n' +
      '}\n' +
      '\n'
    )
  })

})