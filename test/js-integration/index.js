const assert = require('assert')

describe("Javascript integration", function () {

  it("should work with default require statement", function () {
    const JsonToTS = require('../../build/index')

    const expected = `
export interface RootObject {
  cats: Cat[];
  favoriteNumber: number;
  favoriteWord: string;
}
export interface Cat {
  name: string;
}`

    const json = {
      cats: [
        {name: 'Kittin'},
        {name: 'Mittin'},
      ],
      favoriteNumber: 42,
      favoriteWord: 'Hello'
    }

    const output = JsonToTS(json)
      .reduce((type1, type2) => {
        return `${type1}\n${type2}`
      })
      .trim()

    assert.strictEqual(output, expected.trim())
  })

})
