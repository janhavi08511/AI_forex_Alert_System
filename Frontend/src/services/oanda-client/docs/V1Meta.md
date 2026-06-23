
# V1Meta

Metadata on the original request. Only returned when `json` or `xml` are specified for the output format.

## Properties

Name | Type
------------ | -------------
`effectiveParams` | [V1MetaEffectiveParams](V1MetaEffectiveParams.md)
`requestTime` | string
`skippedCurrencies` | Array&lt;string&gt;

## Example

```typescript
import type { V1Meta } from ''

// TODO: Update the object below with actual values
const example = {
  "effectiveParams": null,
  "requestTime": null,
  "skippedCurrencies": null,
} satisfies V1Meta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V1Meta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


