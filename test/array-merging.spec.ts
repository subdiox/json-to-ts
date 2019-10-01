import * as assert from 'assert'
import { removeWhiteSpace } from './util/index'
import JsonToTS from '../src/index'

describe('Array type merging', function () {

  it('should work with arrays with same inner types', function() {
    const json = {
      cats: [
        {name: 'Kittin'},
        {name: 'Sparkles'},
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[];
      }`,
      `export interfaceCat {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('union null type should be emited and field should be marked as optional', function() {
    const json = [
      { age: 42},
      { age: null},
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        age?: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

  it('null should stay if it is part of array elements', function() {
    const json = {
      arr: [
        42, '42', null
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        arr: (null | number | string)[];
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

  it('array types should be merge even if they are nullable', function() {
    const json = [
      {
        field: ['string']
      },
      {
        field: [42]
      },
      {
        field: null
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        field?: (number | string)[];
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

  it('object types should be merge even if they are nullable', function() {
    const json = [
      {
        field: { tag: 'world'}
      },
      {
        field: { tag: 42}
      },
      {
        field: null
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        field?: Field;
      }`,
      `export interfaceField {
        tag: number | string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)
    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should work with arrays with inner types that has optinal field', function() {
    const json = {
      cats: [
        {name: 'Kittin'},
        {name: 'Sparkles', age: 20},
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[];
      }`,
      `export interfaceCat {
        name: string;
        age?: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should work with arrays with inner types that has no common fields', function() {
    const json = {
      cats: [
        { name: 'Kittin' },
        { age: 20},
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[];
      }`,
      `export interfaceCat {
        name?: string;
        age?: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should work with arrays with inner types that have common field that has different types', function() {
    const json = {
      cats: [
        { age: '20'},
        { age: 20},
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[];
      }`,
      `export interfaceCat {
        age: number | string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should solve edge case 1', function() {
    const json = {
      cats: [
        { age: [42]},
        { age: ['42']},
      ],
      dads: [
        'hello', 42
      ]
    }

    const expectedTypes = [
      `export interfaceRootObject {
        cats: Cat[];
        dads: (number | string)[];
      }`,
      `export interfaceCat {
        age: (number | string)[];
      }`,
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should solve edge case 2', function() {
    const json = {
      items: [
        {
          billables: [
            {
              'quantity': 2,
              'price': 0
            }
          ]
        },
        {
          billables: [
            {
              'priceCategory': {
                'title': 'Adult',
                'minAge': 0,
                'maxAge': 99
              },
              'quantity': 2,
              'price': 226
            }
          ]
        }
      ],
    }

    const expectedTypes = [
      `export interfaceRootObject {
        items: Item[];
      }`,
      `export interfaceItem {
        billables: Billable[];
      }`,
      `export interfaceBillable {
        quantity: number;
        price: number;
        priceCategory?: PriceCategory;
      }`,
      `export interfacePriceCategory {
        title: string;
        minAge: number;
        maxAge: number;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 4)
  })

  it('should solve edge case 3', function() {
    const json = [
      {
        nestedElements: [
          {
            commonField: 42,
            optionalField: 'field'
          },
          {
            commonField: 42,
            optionalField3: 'field3'
          }
        ]
      },
      {
        nestedElements: [
          {
            commonField: '42',
            optionalField2: 'field2'
          }
        ]
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        nestedElements: NestedElement[];
      }`,
      `export interfaceNestedElement {
        commonField: number | string;
        optionalField?: string;
        optionalField3?: string;
        optionalField2?: string;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should merge empty array with primitive types', function() {
    const json = [
      {
        nestedElements: []
      },
      {
        nestedElements: ['kittin']
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        nestedElements: string[];
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

  it('should merge empty array with object types', function() {
    const json = [
      {
        nestedElements: []
      },
      {
        nestedElements: [{name: 'kittin'}]
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        nestedElements: NestedElement[];
      }`,
      `export interfaceNestedElement {
        name: string;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 2)
  })

  it('should merge empty array with array types', function() {
    const json = [
      {
        nestedElements: []
      },
      {
        nestedElements: [['string']]
      }
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        nestedElements: string[][];
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

  it('should merge union types with readable names ', function() {
    const json = [
      {
        marius: 'marius'
      },
      {
        marius: [42]
      },
    ]

    const expectedTypes = [
      `export interfaceRootObject {
        marius: number[] | string;
      }`
    ].map(removeWhiteSpace)

    const interfaces = JsonToTS(json)

    interfaces
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })

    assert.strictEqual(interfaces.length, 1)
  })

})