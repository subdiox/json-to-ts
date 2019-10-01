![JSON TO TS](https://image.ibb.co/fTb60k/icon.png)

# Json to TS

### Convert json object to typescript interfaces

# Example

### [Try it Online](http://www.jsontots.com)
### Code

```javascript
const JsonToTS = require('json2ts')

const json = {
  cats: [
    {name: 'Kittin'},
    {name: 'Mittin'}
  ],
  favoriteNumber: 42,
  favoriteWord: 'Hello'
}

JsonToTS(json).forEach( typeInterface => {
  console.log(typeInterface)
})
```

### Output:

```typescript
export interface RootObject {
  cats: Cat[];
  favoriteNumber: number;
  favoriteWord: string;
}
export interface Cat {
  name: string;
}
```

## Converter
- Array type merging (**Big deal**)
- Union types
- Duplicate type prevention
- Optional types
- Array types

# Setup

```sh
$ npm install --save json2ts
```
