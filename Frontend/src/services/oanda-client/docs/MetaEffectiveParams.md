
# MetaEffectiveParams

Information on how the API interpreted the parameters in the request. Parameters may or may not be present depending on the allowed parameters for an endpoint.

## Properties

Name | Type
------------ | -------------
`dataSet` | [Dataset](Dataset.md)
`baseCurrencies` | Array&lt;string&gt;
`quoteCurrencies` | Array&lt;string&gt;
`dateTime` | string

## Example

```typescript
import type { MetaEffectiveParams } from ''

// TODO: Update the object below with actual values
const example = {
  "dataSet": null,
  "baseCurrencies": null,
  "quoteCurrencies": null,
  "dateTime": null,
} satisfies MetaEffectiveParams

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MetaEffectiveParams
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


