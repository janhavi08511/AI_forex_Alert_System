
# V2Stream200ResponseOneOf

Spot Rates

## Properties

Name | Type
------------ | -------------
`dataset` | [OandaAndCBDataset](OandaAndCBDataset.md)
`base` | string
`quote` | string
`timestamp` | string
`bid` | string
`ask` | string

## Example

```typescript
import type { V2Stream200ResponseOneOf } from ''

// TODO: Update the object below with actual values
const example = {
  "dataset": null,
  "base": null,
  "quote": null,
  "timestamp": null,
  "bid": null,
  "ask": null,
} satisfies V2Stream200ResponseOneOf

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V2Stream200ResponseOneOf
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


