import * as assert from 'assert'
import { removeWhiteSpace } from './util/index'
import JsonToTS from '../src/index'

describe('Multiple interfaces', function () {

  it('should create separate interface for nested objects', function() {
    const json = {
      a: {
        b: 42
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        a: A;
      }`,
      `export interfaceA {
        b: number;
      }`,
    ].map(removeWhiteSpace)

    JsonToTS(json)
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })
  })

  it('should not create duplicate on same type object fields', function() {
    const json = {
      a: {
        b: 42
      },
      c: {
        b: 24
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        a: A;
        c: A;
      }`,
      `export interfaceA {
        b: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })

    assert(interfaces.length === 2)
  })

  it('should have multi keyword interfaces created without space', function() {
    const json = {
      'hello world': {
        b: 42
      }
    }

    const expectedTypes = [
`export interfaceRootObject {
  'hello world': HelloWorld;
}`,
`export interfaceHelloWorld {
  b: number;
}`,
    ].map(_ => _.trim())

    const interfaces = JsonToTS(json)
    interfaces.forEach( typeInterface => {
      assert(expectedTypes.includes(typeInterface))
    })
  })

  it('should have unique names for nested objects since they ', function() {
    const json = {
      name: 'Larry',
      parent: {
        name: 'Garry',
        parent: {
          name: 'Marry',
          parent: null
        }
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        name: string;
        parent: Parent2;
      }`,
      `export interfaceParent {
        name: string;
        parent?: any;
      }`,
      `export interfaceParent2 {
        name: string;
        parent: Parent;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should support multi nested arrays', function() {
    const json = {
      cats: [
        [
          {name: 'Kittin'},
          {name: 'Kittin'},
          {name: 'Kittin'},
        ],
        [
          {name: 'Kittin'},
          {name: 'Kittin'},
          {name: 'Kittin'},
        ],
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[][];
      }`,
      `export interfaceCat {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    JsonToTS(json)
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })
  })

  it('should singularize array types (dogs: [...] => dogs: Dog[] )', function() {
    const json = {
      dogs: [
        { name: 'sparky' },
        { name: 'goodboi' },
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        dogs: Dog[];
      }`,
      `export interfaceDog {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should not singularize if not array type (dogs: {} => dogs: Dogs )', function() {
    const json = {
      cats: {
        popularity: 'very popular'
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cats;
      }`,
      `export interfaceCats {
        popularity: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should capitalize interface names', function() {
    const json = {
      cat: {}
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cat: Cat;
      }`,
      `export interfaceCat {
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should start unique names increment with 2', function() {
    const json = {
      a: {
        human: {legs : 4}
      },
      b: {
        human: {arms : 2}
      },
    }

    const expectedTypes = [
      `export interfaceRootObject {
        a: A;
        b: B;
      }`,
      `export interfaceA {
        human: Human;
      }`,
      `export interfaceB {
        human: Human2;
      }`,
      `export interfaceHuman {
        legs: number;
      }`,
      `export interfaceHuman2 {
        arms: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should normalize invalid interface names 1', function() {
    const json = {
      '#@#123#@#': {
        name: 'dummy string'
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        '#@#123#@#': _123;
      }`,
      `export interface_123 {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should normalize invalid interface names 2', function() {
    const json = {
      'hello#@#123#@#': {
        name: 'dummy string'
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        'hello#@#123#@#': Hello123;
      }`,
      `export interfaceHello123 {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should normalize invalid interface names to pascal case', function() {
    const json = {
      '%#hello#@#123#@#': {
        name: 'dummy string'
      }
    }

    const expectedTypes = [
      `export interfaceRootObject {
        '%#hello#@#123#@#': Hello123;
      }`,
      `export interfaceHello123 {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should have question mark after optional invalid interface name', function() {
    const json = [
      { 'hello#123': 'sample' },
      {}
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        'hello#123'?: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should have question mark after null value invalid interface name', function() {
    const json = {
      'hello#123': null
    }

    const expectedTypes = [
      `export interfaceRootObject {
        'hello#123'?: any;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should have question mark after null value invalid optional interface name', function() {
    const json = [
      { 'hello#123': null },
      {}
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        'hello#123'?: any;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })


})