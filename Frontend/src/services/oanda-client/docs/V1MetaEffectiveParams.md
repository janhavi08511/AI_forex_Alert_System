
# V1MetaEffectiveParams

The effective query parameters made after normalizing the input and applying defaults.

## Properties

Name | Type
------------ | -------------
`dataSet` | [Dataset](Dataset.md)
`date` | string
`end` | string
`decimalPlaces` | string
`fields` | Array&lt;string&gt;
`quoteCurrencies` | Array&lt;string&gt;
`start` | string

## Example

```typescript
import type { V1MetaEffectiveParams } from ''

// TODO: Update the object below with actual values
const example = {
  "dataSet": null,
  "date": null,
  "end": null,
  "decimalPlaces": null,
  "fields": null,
  "quoteCurrencies": null,
  "start": null,
} satisfies V1MetaEffectiveParams

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V1MetaEffectiveParams
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


