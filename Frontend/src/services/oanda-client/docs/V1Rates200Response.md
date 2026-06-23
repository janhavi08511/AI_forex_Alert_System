
# V1Rates200Response


## Properties

Name | Type
------------ | -------------
`baseCurrency` | string
`meta` | [V1Meta](V1Meta.md)
`quotes` | [{ [key: string]: V1Rates200ResponseQuotesValue; }](V1Rates200ResponseQuotesValue.md)

## Example

```typescript
import type { V1Rates200Response } from ''

// TODO: Update the object below with actual values
const example = {
  "baseCurrency": null,
  "meta": null,
  "quotes": null,
} satisfies V1Rates200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V1Rates200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


