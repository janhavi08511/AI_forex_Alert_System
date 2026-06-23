# V3Api

All URIs are relative to *https://exchange-rates-api.oanda.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v3InstrumentsOrderBook**](V3Api.md#v3instrumentsorderbook) | **GET** /v3/instruments/{instrument}/orderBook | Orderbook |
| [**v3InstrumentsPositionBook**](V3Api.md#v3instrumentspositionbook) | **GET** /v3/instruments/{instrument}/positionBook | Positionbook |



## v3InstrumentsOrderBook

> V3InstrumentsOrderBook200Response v3InstrumentsOrderBook(instrument, apiKey, date)

Orderbook

Fetch all orderbook snapshots for the given instrument and day.

### Example

```ts
import {
  Configuration,
  V3Api,
} from '';
import type { V3InstrumentsOrderBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: apiKey
    apiKey: "YOUR API KEY",
  });
  const api = new V3Api(config);

  const body = {
    // string | Instrument name with following format {base}_{quote}. e.g base=EUR and quote=USD will be EUR_USD.
    instrument: instrument_example,
    // string | **Not recommended.** Use the `Authorization` header instead.  This method is not recommended, as it is insecure. As the API key is within the URL, it may be logged. This method should only be used if the client you use to access the API is unable to set headers. (optional)
    apiKey: apiKey_example,
    // BookDate | The date of the snapshots to fetch. Must be in format yyyy-MM-dd eg 2025-09-01. If missing, fetches the latest 5-minute snapshot. (optional)
    date: ...,
  } satisfies V3InstrumentsOrderBookRequest;

  try {
    const data = await api.v3InstrumentsOrderBook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **instrument** | `string` | Instrument name with following format {base}_{quote}. e.g base&#x3D;EUR and quote&#x3D;USD will be EUR_USD. | [Defaults to `undefined`] |
| **apiKey** | `string` | **Not recommended.** Use the &#x60;Authorization&#x60; header instead.  This method is not recommended, as it is insecure. As the API key is within the URL, it may be logged. This method should only be used if the client you use to access the API is unable to set headers. | [Optional] [Defaults to `undefined`] |
| **date** | `BookDate` | The date of the snapshots to fetch. Must be in format yyyy-MM-dd eg 2025-09-01. If missing, fetches the latest 5-minute snapshot. | [Optional] [Defaults to `undefined`] |

### Return type

[**V3InstrumentsOrderBook200Response**](V3InstrumentsOrderBook200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Orderbook response for the given instrument.  ⚠️ Note that the body of the response is a series of one-line JSON objects, each with the following schema, and separated by a newline character. |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **429** | Too Many Requests |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v3InstrumentsPositionBook

> V3InstrumentsPositionBook200Response v3InstrumentsPositionBook(instrument, apiKey, date)

Positionbook

Fetch all positionbook snapshots for the given instrument and day.

### Example

```ts
import {
  Configuration,
  V3Api,
} from '';
import type { V3InstrumentsPositionBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: apiKey
    apiKey: "YOUR API KEY",
  });
  const api = new V3Api(config);

  const body = {
    // string | Instrument name with following format {base}_{quote}. e.g base=EUR and quote=USD will be EUR_USD.
    instrument: instrument_example,
    // string | **Not recommended.** Use the `Authorization` header instead.  This method is not recommended, as it is insecure. As the API key is within the URL, it may be logged. This method should only be used if the client you use to access the API is unable to set headers. (optional)
    apiKey: apiKey_example,
    // BookDate | The date of the snapshots to fetch. Must be in format yyyy-MM-dd eg 2025-09-01. If missing, fetches the latest 5-minute snapshot. (optional)
    date: ...,
  } satisfies V3InstrumentsPositionBookRequest;

  try {
    const data = await api.v3InstrumentsPositionBook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **instrument** | `string` | Instrument name with following format {base}_{quote}. e.g base&#x3D;EUR and quote&#x3D;USD will be EUR_USD. | [Defaults to `undefined`] |
| **apiKey** | `string` | **Not recommended.** Use the &#x60;Authorization&#x60; header instead.  This method is not recommended, as it is insecure. As the API key is within the URL, it may be logged. This method should only be used if the client you use to access the API is unable to set headers. | [Optional] [Defaults to `undefined`] |
| **date** | `BookDate` | The date of the snapshots to fetch. Must be in format yyyy-MM-dd eg 2025-09-01. If missing, fetches the latest 5-minute snapshot. | [Optional] [Defaults to `undefined`] |

### Return type

[**V3InstrumentsPositionBook200Response**](V3InstrumentsPositionBook200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Positionbook response for the given instrument.  ⚠️ Note that the body of the response is a series of one-line JSON objects, each with the following schema, and separated by a newline character. |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **429** | Too Many Requests |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

