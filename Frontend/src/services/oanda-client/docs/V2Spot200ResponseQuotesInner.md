
# V2Spot200ResponseQuotesInner


## Properties

Name | Type
------------ | -------------
`baseCurrency` | string
`quoteCurrency` | string
`dateTime` | string
`bid` | string
`ask` | string
`midpoint` | string
`sourceDate` | string

## Example

```typescript
import type { V2Spot200ResponseQuotesInner } from ''

// TODO: Update the object below with actual values
const example = {
  "baseCurrency": null,
  "quoteCurrency": null,
  "dateTime": null,
  "bid": null,
  "ask": null,
  "midpoint": null,
  "sourceDate": null,
} satisfies V2Spot200ResponseQuotesInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V2Spot200ResponseQuotesInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


