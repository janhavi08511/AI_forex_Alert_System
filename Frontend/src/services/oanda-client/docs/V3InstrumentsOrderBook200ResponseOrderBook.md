
# V3InstrumentsOrderBook200ResponseOrderBook


## Properties

Name | Type
------------ | -------------
`instrument` | string
`price` | string
`bucketWidth` | string
`time` | string
`buckets` | [Array&lt;BookBucketsInner&gt;](BookBucketsInner.md)

## Example

```typescript
import type { V3InstrumentsOrderBook200ResponseOrderBook } from ''

// TODO: Update the object below with actual values
const example = {
  "instrument": null,
  "price": null,
  "bucketWidth": null,
  "time": null,
  "buckets": null,
} satisfies V3InstrumentsOrderBook200ResponseOrderBook

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V3InstrumentsOrderBook200ResponseOrderBook
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


