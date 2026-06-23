
# V2Candle

ℹ️ The \'open_time\' and \'close_time\' of the candle may be earlier than the \'start_time\' and \'end_time\' requested because the data may have been collected at an earlier date and applied to later candles.  Other fields in each candle are dependent on the requested fields parameter.

## Properties

Name | Type
------------ | -------------
`baseCurrency` | string
`quoteCurrency` | string
`startTime` | string
`openTime` | string
`closeTime` | string
`openBid` | string
`openAsk` | string
`openMidpoint` | string
`closeBid` | string
`closeAsk` | string
`closeMidpoint` | string
`averageBid` | string
`averageAsk` | string
`averageMidpoint` | string
`highBid` | string
`highAsk` | string
`highMidpoint` | string
`lowBid` | string
`lowAsk` | string
`lowMidpoint` | string
`sourecDate` | string

## Example

```typescript
import type { V2Candle } from ''

// TODO: Update the object below with actual values
const example = {
  "baseCurrency": null,
  "quoteCurrency": null,
  "startTime": null,
  "openTime": null,
  "closeTime": null,
  "openBid": null,
  "openAsk": null,
  "openMidpoint": null,
  "closeBid": null,
  "closeAsk": null,
  "closeMidpoint": null,
  "averageBid": null,
  "averageAsk": null,
  "averageMidpoint": null,
  "highBid": null,
  "highAsk": null,
  "highMidpoint": null,
  "lowBid": null,
  "lowAsk": null,
  "lowMidpoint": null,
  "sourecDate": null,
} satisfies V2Candle

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V2Candle
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


