import {
  getTypeStructure,
  optimizeTypeStructure
} from './src/get-type-structure'
import { Options } from './src/model'
import { shim } from 'es7-shim/es7-shim'
import { getInterfaceDescriptions, getInterfaceStringFromDescription } from './src/get-interfaces'
import { getNames } from './src/get-names'
import { isArray, isObject } from './src/util'
shim()

export default function JsonToTS(json: any, userOptions?: Options): string[] {
  const defaultOptions: Options = {
    rootName: 'RootObject'
  }
  const options = {
    ...defaultOptions,
    ...userOptions
  }

  /**
   * Parsing currently works with (Objects) and (Array of Objects) not and primitive types and mixed arrays etc..
   * so we shall validate, so we dont start parsing non Object type
   */
  const isArrayOfObjects = isArray(json) && json.length > 0 && json.reduce(
    (a, b) => a && isObject(b),
    true
  )

  if (!(isObject(json) || isArrayOfObjects)) {
    throw new Error('Only (Object) and (Array of Object) are supported')
  }

  const typeStructure = getTypeStructure(json)
  /**
   * due to merging array types some types are switched out for merged ones
   * so we delete the unused ones here
   */
  optimizeTypeStructure(typeStructure)

  const names = getNames(typeStructure, options.rootName)

  return getInterfaceDescriptions(typeStructure, names)
    .map(getInterfaceStringFromDescription)
}

(<any>JsonToTS).default = JsonToTS
module.exports = JsonToTS