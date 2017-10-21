var assert = require('assert')
var sistyl = require('../')

describe('sistyl', () => {
  it('can be created with the sistyl constructor', () => {
    assert.deepEqual(
      sistyl({ '.selector': { 'property': 'value' } }).rulesets(),
      { '.selector': { 'property': 'value' } }
    )
  })

  it('converts a JSON rulesets object into a valid CSS string', () => {
    assert.strictEqual(
      sistyl({ '.selector': { 'property': 'value' } }).toString(),
      '.selector {\n' +
      '  property: value;\n' +
      '}\n' +
      '\n'
    )
  })

  it('separates rulesets by two newlines', () => {
    assert.strictEqual(
      sistyl({ 'a': { 'prop': 'val', 'prop2': 'val2' }
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
    assert.deepEqual(
      sistyl({
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
    assert.deepEqual(
      sistyl({
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
    assert.strictEqual(
      sistyl({
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

  it('treats sistyl instances as nested rulesets', () => {
    const red = sistyl({ '.text': { 'color': 'red' } })
    assert.deepEqual(
      sistyl({ '.warning': red
             , '.error': red }).rulesets(),
      { '.warning .text': { 'color': 'red' }
      , '.error .text'  : { 'color': 'red' } }
    )
  })

  it('regroups nested grouped selectors', () => {
    assert.deepEqual(
      sistyl({
        '.warning, .error': {
          '.text': { 'color': 'red' }
        }
      }).rulesets(),
      { '.warning .text, .error .text': { 'color': 'red' } }
    )
  })

  it('regroups silly/difficult-er nested grouped selectors', () => {
    assert.deepEqual(
      sistyl({
        'a.modal[title*="This, Is A \\"Title\\"."]': {
          '.title, .message': {
            'span': {
              'font-size': '17pt'
            }
          }
        }
      }).rulesets(),
      {
        [`a.modal[title*="This, Is A \\"Title\\"."] .title span, ` +
         `a.modal[title*="This, Is A \\"Title\\"."] .message span`]: {
          'font-size': '17pt'
        }
      }
    )
  })

})

describe('Mutation', () => {

  it('supports adding rulesets through a .set() method', () => {
    const st = sistyl({ 'body': { 'color': '#222' } })
    assert.deepEqual(
      st.rulesets(),
      { 'body': { 'color': '#222' } }
    )

    st.set('.warning', { 'color': '#f00' })

    assert.deepEqual(
      st.rulesets(),
      { 'body': { 'color': '#222' }
      , '.warning': { 'color': '#f00' } }
    )
  })

  it('merges rulesets in the .set() method', () => {
    const st = sistyl({ 'body': { 'color': '#222' } })
    st.set('body', { 'background': '#f0f' })

    assert.deepEqual(
      st.rulesets(),
      { 'body': { 'color': '#222'
                , 'background': '#f0f' } }
    )
  })

  it('overrides duplicate properties in the .set() method', () => {
    const st = sistyl({ 'body': { 'color': '#222'
                                , 'background': 'gray'
                                , 'font-family': 'Comic Sans' } })

    st.set('body', { 'background': 'pink', 'font-size': '75%' })

    assert.deepEqual(
      st.rulesets(),
      { 'body': { 'color': '#222'
                , 'background': 'pink'
                , 'font-family': 'Comic Sans'
                , 'font-size': '75%' } }
    )
  })

  it('accepts sistyl instances in .set()', () => {
    const blue = sistyl({ '.text': { 'color': 'blue' } })
    assert.deepEqual(
      sistyl().set('.info', blue)
              .set(blue)
              .rulesets(),
      { '.info .text': { 'color': 'blue' }
      , '.text'  : { 'color': 'blue' } }
    )
  })

  it('removes rulesets with .unset(sel)', () => {
    assert.deepEqual(
      sistyl({ '.blue': { 'color': 'blue' }
             , '.pink': { 'color': 'pink' } })
        .unset('.blue')
        .rulesets(),
      { '.pink': { 'color': 'pink' } }
    )
  })

  it('removes properties with .unset(sel, prop)', () => {
    assert.deepEqual(
      sistyl({ '.blue': { 'color': 'blue' } })
        .set('.blue', { 'font-size': '10pt' })
        .unset('.blue', 'font-size')
        .rulesets(),
      { '.blue': { 'color': 'blue' } }
    )
  })
})
