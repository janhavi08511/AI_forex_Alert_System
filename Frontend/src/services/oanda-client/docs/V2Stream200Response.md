
# V2Stream200Response

The Streaming API returns either spot rates or forward rates depending on the provided query parameters.  If the tenor query parameter is present, the API returns forward rates; otherwise, it returns spot rates.  The structure of the response also varies depending on whether spot or forward rates are returned.  Consequently, applications consuming this API must handle these distinct response formats.

## Properties

Name | Type
------------ | -------------
`dataset` | [OandaAndCBDataset](OandaAndCBDataset.md)
`base` | string
`quote` | string
`timestamp` | string
`bid` | string
`ask` | string
`spotBid` | string
`spotAsk` | string
`tenor` | string
`forwardPointsBid` | string
`forwardPointsAsk` | string

## Example

```typescript
import type { V2Stream200Response } from ''

// TODO: Update the object below with actual values
const example = {
  "dataset": null,
  "base": null,
  "quote": null,
  "timestamp": null,
  "bid": null,
  "ask": null,
  "spotBid": null,
  "spotAsk": null,
  "tenor": null,
  "forwardPointsBid": null,
  "forwardPointsAsk": null,
} satisfies V2Stream200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V2Stream200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


