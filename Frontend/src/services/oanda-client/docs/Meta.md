
# Meta

Metadata on the original request. Only returned when `json` or `xml` are specified for the output format.

## Properties

Name | Type
------------ | -------------
`effectiveParams` | [MetaEffectiveParams](MetaEffectiveParams.md)
`endpoint` | string
`requestTime` | string
`skippedCurrencyPairs` | [Array&lt;MetaSkippedCurrencyPairsInner&gt;](MetaSkippedCurrencyPairsInner.md)
`skippedTenors` | Array&lt;string&gt;

## Example

```typescript
import type { Meta } from ''

// TODO: Update the object below with actual values
const example = {
  "effectiveParams": null,
  "endpoint": null,
  "requestTime": null,
  "skippedCurrencyPairs": null,
  "skippedTenors": null,
} satisfies Meta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Meta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


