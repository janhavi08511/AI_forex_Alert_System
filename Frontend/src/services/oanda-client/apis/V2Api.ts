/* tslint:disable */
/* eslint-disable */
/**
 * OANDA Exchange Rates API
 * ## Getting Started  1. Sign up for our API -    [Sign up for a free trial](https://www.oanda.com/fx-for-business/exchange-rates-api)    to join.  2. Get your API key - Log in to our    [Self-Serve Portal](https://fxds.oanda.com/app/login) and look up your API key    or wait for your registration email.  3. Start making requests - Start accessing the OANDA Exchange Rates API with    your API key.  ## Introduction  The OANDA Exchange Rates API (hereafter, the API) is an HTTP API, which provides access to OANDA\'s daily and real-time exchange rate data. Using the API, you may programmatically request rates which you may process and save in a format that works for your organization. For example, you can insert the rates into your own database/caching system or into files, such as a Comma Separated Value file (CSV).  ℹ️ In the following documentation all response schemas are specified as JSON, but the API returns the equivalent data in CSV or XML format depending on the specified filetype (\'ext\') in the request endpoint.  ## API key  Authentication with an API key is required to access all of the API’s endpoints. You can find your API key by logging in to your account at <a href=\"https://fxds.oanda.com/app/login\" target=\"_blank\">https://fxds.oanda.com/app/login</a>, as shown in the screenshot below:  Fig. 1. OANDA FXDS Self-Serve Portal <img src=\"ssp.png\" alt=\"OANDA FXDS Self-Serve Portal with highlighted API key\">  ## Quote Limits  Some subscription plans have quote limits. The limits are not applied to the number of API requests made, but rather to the number of quotes returned by the Rates endpoints. Requests to other endpoints, such as the Remaining Quotes and Currencies endpoints, do not count against your quote limit but will be blocked if the quote limit is reached.  To determine the number of quotes you have remaining for the current billing period, you may either call the Remaing Quotes endpoint or get this information from the Rates endpoints response header.  ## Sample Code  You may generate API clients in your preferred technology using the [OpenAPI Generator](https://openapi-generator.tech/) tool. You will need Node.js and Java installed for the following commands to work:      # List available code generation options:     $ npx @openapitools/openapi-generator-cli list      # Generate a Java client in the \'oanda_ex_rates_api\' directory:     $ npx @openapitools/openapi-generator-cli generate -i openapi.json -g java -o oanda_ex_rates_api  ## API Call Examples  You may try out API calls using the \'Try\' button on each endpoint\'s documentation page. It is also possible to copy the curl command for the request, and the response body, to the clipboard.  ## Troubleshooting  ℹ️ Some of the inputs in this spec are marked with \'*\', meaning they are required inputs. You may omit them to test out the API error scenarios, however, they are all required to make a successful API call.  ### Is The API Up?  You may check the availability of the API on our Dashboard:  <iframe   loading=\"lazy\"   style=\"margin-top: 10px\"   width=\"100%\"   height=\"400\"   src=\"https://oanda-exchange-rates-api.checkly-dashboards.com/\"></iframe>  ### HTTP Errors  The message provided with any particular error may contain additional information to help you determine the cause of the problem, particularly in the case of malformed or invalid query parameters.  ### TLS Connection Errors  The Exchange Rates API enforces TLS v1.2+ with [SNI](https://www.cloudflare.com/learning/ssl/what-is-sni/). This is done to protect your data with strong encryption as it goes over the internet.  #### Root Certificate Trust Store  We _strongly_ advise all clients to use up-to-date versions of software to connect to the API. Among other benefits, updated software automatically manages TLS certificate roots which are needed to connect to the API using the HTTPS protocol. The details vary by system but typically the operating system or application programming environment will provide the updated trusted root certificates.  If your software cannot be updated to use these root certificates, and you need to _manually_ set up the root certificate trust store, then we strongly recommend that you use the most up-to-date root certificate bundle from Mozilla: https://curl.se/docs/caextract.html  We cannot guarantee that our TLS certificate path and root certificate will remain stable over time, only that we will continue to use reputable Certificate Authorities (CAs) for our TLS certificates. Using the root certificate bundle above is to your advantage as it will allow your software to connect to the API for the foreseeable future.  However, it is still important to stay up-to-date with changes in root certificates, despite their longevity, as they may be periodically updated for security reasons. The page linked above shows an example of automating the CA bundle download.  ℹ️ The above recommendations are a \'last resort\' for software applications which can\'t be updated to use their system default trust stores. As these systems have special requirements above and beyond regularly updated software, we are unable to accommodate requests to provide advance notice of certificate changes.  #### Protocol Version  If you are getting an error like:      $ curl --tls-max 1.1 https://exchange-rates-api.oanda.com/health     curl: (35) error:1400442E:SSL routines:CONNECT_CR_SRVR_HELLO:tlsv1 alert protocol version  It may be using older HTTP client software which needs to be updated. Updating the application in such cases is the _best_ option–often security issues are patched in newer versions, which is especially important if the application has internet access.  If updating the application is not possible, you have a couple of other options.  ℹ️ OANDA provides the following recommendations solely on an ‘as-is’ basis, with no warranties of fitness for purpose or promise of support. OANDA is not liable for any issues arising from following the recommendations.  #### Use a Forward Proxy  A proxy like [HAProxy](https://www.haproxy.org/) or [Caddy Server](https://caddyserver.com/) can accept plain HTTP requests from your application, upgrade the request to an encrypted TLS+SNI request, and forward it to the Exchange Rates API. It can also accept the API’s HTTPS response, downgrade it back to a plain HTTP response, and send that back to your application. This way, your application doesn’t even need to know about HTTPS, TLS, etc., and all traffic that goes over the internet is encrypted properly.  A proxy is easy to set up–all you need is a VM (or physical machine) with a recent Linux installed, configure the proxy as described above, and point your application to request rates from there. E.g. if your application is in your network as \'app.domain\', and the proxy is \'proxy.domain\' (listening on 8080), all you need to do is tell the app that the Exchange Rates API URL is http://proxy.domain:8080. The proxy will call the Exchange Rates API correctly, and your application will be insulated from the internet by the proxy layer. Ensure that you also add a firewall rule so that \'proxy.domain\' accepts requests only from \'app.domain\'.  The reason we recommend _recent_ Linux (or FreeBSD/etc.) is that they are free, guaranteed to have up-to-date network certificates and a performant networking stack, which the proxy can take advantage of. You may of course have a different preference.  This is just the start of what proxies can do, and it’s a really good idea to use one even if your application itself can use TLS v1.2. Check [this post](https://www.haproxy.com/user-spotlight-series/haproxy-as-egress-controller/) for more insights into how they can help manage your networked applications.  #### Use (Unencrypted) HTTP  If you can’t update your application or use a forward proxy, another option is to use the plain HTTP URL, http://exchange-rates-api.oanda.com/ . However, we strongly discourage this as it exposes your API key and rate data to the internet in plain text and could have effects such as:  * An attacker can copy and use your API key, using up your API quota  * See what rates you are requesting  * Inject or modify data in your API requests and responses, potentially giving   you incorrect information  We cannot guarantee the integrity of any unencrypted API calls.
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: webservices@oanda.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import {
    type Dataset,
    DatasetFromJSON,
    DatasetToJSON,
} from '../models/Dataset';
import {
    type OandaAndCBDataset,
    OandaAndCBDatasetFromJSON,
    OandaAndCBDatasetToJSON,
} from '../models/OandaAndCBDataset';
import {
    type OandaDataset,
    OandaDatasetFromJSON,
    OandaDatasetToJSON,
} from '../models/OandaDataset';
import {
    type RemainingQuotes,
    RemainingQuotesFromJSON,
    RemainingQuotesToJSON,
} from '../models/RemainingQuotes';
import {
    type SourceDate,
    SourceDateFromJSON,
    SourceDateToJSON,
} from '../models/SourceDate';
import {
    type V1Rates400Response,
    V1Rates400ResponseFromJSON,
    V1Rates400ResponseToJSON,
} from '../models/V1Rates400Response';
import {
    type V1Rates401Response,
    V1Rates401ResponseFromJSON,
    V1Rates401ResponseToJSON,
} from '../models/V1Rates401Response';
import {
    type V1Rates403Response,
    V1Rates403ResponseFromJSON,
    V1Rates403ResponseToJSON,
} from '../models/V1Rates403Response';
import {
    type V1Rates404Response,
    V1Rates404ResponseFromJSON,
    V1Rates404ResponseToJSON,
} from '../models/V1Rates404Response';
import {
    type V2Aggregated200Response,
    V2Aggregated200ResponseFromJSON,
    V2Aggregated200ResponseToJSON,
} from '../models/V2Aggregated200Response';
import {
    type V2Candle200Response,
    V2Candle200ResponseFromJSON,
    V2Candle200ResponseToJSON,
} from '../models/V2Candle200Response';
import {
    type V2Currencies200Response,
    V2Currencies200ResponseFromJSON,
    V2Currencies200ResponseToJSON,
} from '../models/V2Currencies200Response';
import {
    type V2Forward200Response,
    V2Forward200ResponseFromJSON,
    V2Forward200ResponseToJSON,
} from '../models/V2Forward200Response';
import {
    type V2RemainingQuotes200Response,
    V2RemainingQuotes200ResponseFromJSON,
    V2RemainingQuotes200ResponseToJSON,
} from '../models/V2RemainingQuotes200Response';
import {
    type V2Spot200Response,
    V2Spot200ResponseFromJSON,
    V2Spot200ResponseToJSON,
} from '../models/V2Spot200Response';
import {
    type V2Stream200Response,
    V2Stream200ResponseFromJSON,
    V2Stream200ResponseToJSON,
} from '../models/V2Stream200Response';
import {
    type V2SupportedForwards200Response,
    V2SupportedForwards200ResponseFromJSON,
    V2SupportedForwards200ResponseToJSON,
} from '../models/V2SupportedForwards200Response';
import {
    type V2dataset200Response,
    V2dataset200ResponseFromJSON,
    V2dataset200ResponseToJSON,
} from '../models/V2dataset200Response';

export interface V2AggregatedRequest {
    ext: V2AggregatedExtEnum;
    base: Array<string>;
    startTime: string;
    endTime: string;
    apiKey?: string;
    quote?: Array<string>;
    fields?: Array<V2AggregatedFieldsEnum>;
    dataSet?: Dataset;
    decimalPlaces?: V2AggregatedDecimalPlacesEnum;
    interbank?: number;
}

export interface V2CandleRequest {
    ext: V2CandleExtEnum;
    base: Array<string>;
    apiKey?: string;
    quote?: Array<string>;
    dateTime?: string;
    fields?: Array<V2CandleFieldsEnum>;
    dataSet?: Dataset;
    decimalPlaces?: V2CandleDecimalPlacesEnum;
    interbank?: number;
    sourceDate?: SourceDate;
}

export interface V2CandlesRequest {
    ext: V2CandlesExtEnum;
    base: Array<string>;
    startTime: string;
    endTime: string;
    apiKey?: string;
    quote?: Array<string>;
    fields?: Array<V2CandlesFieldsEnum>;
    dataSet?: Dataset;
    decimalPlaces?: V2CandlesDecimalPlacesEnum;
    interbank?: number;
    sourceDate?: SourceDate;
}

export interface V2CurrenciesRequest {
    ext: V2CurrenciesExtEnum;
    apiKey?: string;
    dataSet?: Dataset;
}

export interface V2ForwardRequest {
    ext: V2ForwardExtEnum;
    base: string;
    quote: string;
    apiKey?: string;
    tenor?: Array<string>;
    sourceDate?: SourceDate;
}

export interface V2RemainingQuotesRequest {
    ext: V2RemainingQuotesExtEnum;
    apiKey?: string;
}

export interface V2SpotRequest {
    ext: V2SpotExtEnum;
    base: Array<string>;
    apiKey?: string;
    quote?: Array<string>;
    dateTime?: string;
    interbank?: number;
    dataSet?: Dataset;
    sourceDate?: SourceDate;
}

export interface V2StreamRequest {
    ext: V2StreamExtEnum;
    base: Array<string>;
    apiKey?: string;
    quote?: Array<string>;
    dataSet?: OandaAndCBDataset;
    tenor?: Array<string>;
}

export interface V2SupportedForwardsRequest {
    ext: V2SupportedForwardsExtEnum;
    apiKey?: string;
    base?: Array<string>;
    quote?: Array<string>;
    dataSet?: OandaDataset;
}

export interface V2datasetRequest {
    ext: V2datasetExtEnum;
    dataSet: V2datasetDataSetEnum;
    apiKey?: string;
}

/**
 * 
 */
export class V2Api extends runtime.BaseAPI {

    /**
     * Creates request options for v2Aggregated without sending the request
     */
    async v2AggregatedRequestOpts(requestParameters: V2AggregatedRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Aggregated().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Aggregated().'
            );
        }

        if (requestParameters['startTime'] == null) {
            throw new runtime.RequiredError(
                'startTime',
                'Required parameter "startTime" was null or undefined when calling v2Aggregated().'
            );
        }

        if (requestParameters['endTime'] == null) {
            throw new runtime.RequiredError(
                'endTime',
                'Required parameter "endTime" was null or undefined when calling v2Aggregated().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['startTime'] != null) {
            queryParameters['start_time'] = requestParameters['startTime'];
        }

        if (requestParameters['endTime'] != null) {
            queryParameters['end_time'] = requestParameters['endTime'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        if (requestParameters['decimalPlaces'] != null) {
            queryParameters['decimal_places'] = requestParameters['decimalPlaces'];
        }

        if (requestParameters['interbank'] != null) {
            queryParameters['interbank'] = requestParameters['interbank'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/aggregated.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retrieves one aggregated candle over the given time range for each specified currency pair. The aggregated candle rates are calculated as follows:  - Open rates are the open rates of the first candle in the time range. - Close rates are the close rates of the last candle in the time range. - Average rates are the averages of the average rates of the candles in the time   range. - High rates are the maximums of the high rates of the candles in the time range. - Low rates are the minimums of the low rates of the candles in the time range.
     * Rates / Aggregated
     */
    async v2AggregatedRaw(requestParameters: V2AggregatedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Aggregated200Response>> {
        const requestOptions = await this.v2AggregatedRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Aggregated200ResponseFromJSON(jsonValue));
    }

    /**
     * Retrieves one aggregated candle over the given time range for each specified currency pair. The aggregated candle rates are calculated as follows:  - Open rates are the open rates of the first candle in the time range. - Close rates are the close rates of the last candle in the time range. - Average rates are the averages of the average rates of the candles in the time   range. - High rates are the maximums of the high rates of the candles in the time range. - Low rates are the minimums of the low rates of the candles in the time range.
     * Rates / Aggregated
     */
    async v2Aggregated(requestParameters: V2AggregatedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Aggregated200Response> {
        const response = await this.v2AggregatedRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Candle without sending the request
     */
    async v2CandleRequestOpts(requestParameters: V2CandleRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Candle().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Candle().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['dateTime'] != null) {
            queryParameters['date_time'] = requestParameters['dateTime'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        if (requestParameters['decimalPlaces'] != null) {
            queryParameters['decimal_places'] = requestParameters['decimalPlaces'];
        }

        if (requestParameters['interbank'] != null) {
            queryParameters['interbank'] = requestParameters['interbank'];
        }

        if (requestParameters['sourceDate'] != null) {
            queryParameters['source_date'] = requestParameters['sourceDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/candle.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retrieves one daily candle for each specified currency pair
     * Rates / Candle
     */
    async v2CandleRaw(requestParameters: V2CandleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Candle200Response>> {
        const requestOptions = await this.v2CandleRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Candle200ResponseFromJSON(jsonValue));
    }

    /**
     * Retrieves one daily candle for each specified currency pair
     * Rates / Candle
     */
    async v2Candle(requestParameters: V2CandleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Candle200Response> {
        const response = await this.v2CandleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Candles without sending the request
     */
    async v2CandlesRequestOpts(requestParameters: V2CandlesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Candles().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Candles().'
            );
        }

        if (requestParameters['startTime'] == null) {
            throw new runtime.RequiredError(
                'startTime',
                'Required parameter "startTime" was null or undefined when calling v2Candles().'
            );
        }

        if (requestParameters['endTime'] == null) {
            throw new runtime.RequiredError(
                'endTime',
                'Required parameter "endTime" was null or undefined when calling v2Candles().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['startTime'] != null) {
            queryParameters['start_time'] = requestParameters['startTime'];
        }

        if (requestParameters['endTime'] != null) {
            queryParameters['end_time'] = requestParameters['endTime'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        if (requestParameters['decimalPlaces'] != null) {
            queryParameters['decimal_places'] = requestParameters['decimalPlaces'];
        }

        if (requestParameters['interbank'] != null) {
            queryParameters['interbank'] = requestParameters['interbank'];
        }

        if (requestParameters['sourceDate'] != null) {
            queryParameters['source_date'] = requestParameters['sourceDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/candles.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retrieves all daily candles in the specified time range
     * Rates / Candles
     */
    async v2CandlesRaw(requestParameters: V2CandlesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Candle200Response>> {
        const requestOptions = await this.v2CandlesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Candle200ResponseFromJSON(jsonValue));
    }

    /**
     * Retrieves all daily candles in the specified time range
     * Rates / Candles
     */
    async v2Candles(requestParameters: V2CandlesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Candle200Response> {
        const response = await this.v2CandlesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Currencies without sending the request
     */
    async v2CurrenciesRequestOpts(requestParameters: V2CurrenciesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Currencies().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/currencies.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Use the Currencies endpoint to get a list of valid three-character currency codes for use in the Rates endpoints.
     * Currencies
     */
    async v2CurrenciesRaw(requestParameters: V2CurrenciesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Currencies200Response>> {
        const requestOptions = await this.v2CurrenciesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Currencies200ResponseFromJSON(jsonValue));
    }

    /**
     * Use the Currencies endpoint to get a list of valid three-character currency codes for use in the Rates endpoints.
     * Currencies
     */
    async v2Currencies(requestParameters: V2CurrenciesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Currencies200Response> {
        const response = await this.v2CurrenciesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Forward without sending the request
     */
    async v2ForwardRequestOpts(requestParameters: V2ForwardRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Forward().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Forward().'
            );
        }

        if (requestParameters['quote'] == null) {
            throw new runtime.RequiredError(
                'quote',
                'Required parameter "quote" was null or undefined when calling v2Forward().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['tenor'] != null) {
            queryParameters['tenor'] = requestParameters['tenor'];
        }

        if (requestParameters['sourceDate'] != null) {
            queryParameters['source_date'] = requestParameters['sourceDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/forward.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retrieves one forward curve over the given tenor set for the specified currency pair
     * Rates / Forward
     */
    async v2ForwardRaw(requestParameters: V2ForwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Forward200Response>> {
        const requestOptions = await this.v2ForwardRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Forward200ResponseFromJSON(jsonValue));
    }

    /**
     * Retrieves one forward curve over the given tenor set for the specified currency pair
     * Rates / Forward
     */
    async v2Forward(requestParameters: V2ForwardRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Forward200Response> {
        const response = await this.v2ForwardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2RemainingQuotes without sending the request
     */
    async v2RemainingQuotesRequestOpts(requestParameters: V2RemainingQuotesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2RemainingQuotes().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/remaining_quotes.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * When using the Rates endpoints, the number of remaining quotes in the current billing period is returned in the `X-Rate-Limit-Remaining` header.  The Remaining Quotes endpoint can also be used to get the number of quotes remaining, along with the number of used quotes.
     * Remaining and used Quotes
     */
    async v2RemainingQuotesRaw(requestParameters: V2RemainingQuotesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2RemainingQuotes200Response>> {
        const requestOptions = await this.v2RemainingQuotesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2RemainingQuotes200ResponseFromJSON(jsonValue));
    }

    /**
     * When using the Rates endpoints, the number of remaining quotes in the current billing period is returned in the `X-Rate-Limit-Remaining` header.  The Remaining Quotes endpoint can also be used to get the number of quotes remaining, along with the number of used quotes.
     * Remaining and used Quotes
     */
    async v2RemainingQuotes(requestParameters: V2RemainingQuotesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2RemainingQuotes200Response> {
        const response = await this.v2RemainingQuotesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Spot without sending the request
     */
    async v2SpotRequestOpts(requestParameters: V2SpotRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Spot().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Spot().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['dateTime'] != null) {
            queryParameters['date_time'] = requestParameters['dateTime'];
        }

        if (requestParameters['interbank'] != null) {
            queryParameters['interbank'] = requestParameters['interbank'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        if (requestParameters['sourceDate'] != null) {
            queryParameters['source_date'] = requestParameters['sourceDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/spot.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retrieves the current exchange rate, or the rate at a specified point in time. ℹ️ The minimum update granularity of spot rates is 5 seconds. If you call this endpoint more frequently than that, you will keep getting the same rates until at least 5 seconds have elapsed (more, depending on the currencies).
     * Rates / Spot
     */
    async v2SpotRaw(requestParameters: V2SpotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Spot200Response>> {
        const requestOptions = await this.v2SpotRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Spot200ResponseFromJSON(jsonValue));
    }

    /**
     * Retrieves the current exchange rate, or the rate at a specified point in time. ℹ️ The minimum update granularity of spot rates is 5 seconds. If you call this endpoint more frequently than that, you will keep getting the same rates until at least 5 seconds have elapsed (more, depending on the currencies).
     * Rates / Spot
     */
    async v2Spot(requestParameters: V2SpotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Spot200Response> {
        const response = await this.v2SpotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2Stream without sending the request
     */
    async v2StreamRequestOpts(requestParameters: V2StreamRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2Stream().'
            );
        }

        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v2Stream().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        if (requestParameters['tenor'] != null) {
            queryParameters['tenor'] = requestParameters['tenor'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/rates/stream.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Streams the latest exchange rates directly to you, so you don\'t have to ask for them all the time. ℹ️ Just connect to our rate-streaming service once, and we\'ll send you updates automatically whenever the rates change. If your connection is lost, you\'ll need to reconnect to keep getting the updates.  ### ⚠️️ \"TRY\" button won\'t work with stream endpoint.  #### Streaming Client Example     <!DOCTYPE html>     <html>     <head>     <title>OANDA Streaming Client Example</title>     </head>     <body>        <h1>Rates</h1>       <div id=\"output\"></div>        <script>         const eventSource = new EventSource(\"https://exchange-rates-api.oanda.com/v2/stream.[json/csv/xml]?base=[base currency]&quote=[quote currency(optional)]&api_key=[YOUR API KEY]&data_set=[datasets offered by OANDA(optional)]\");          eventSource.onopen = () => {           console.log(\"Connection established with streaming server.\");           document.getElementById(\"output\").innerHTML += \"<p>Connected</p>\";         };          eventSource.onerror = (error) => {           console.error(\"Error:\", error);           if (error.target.readyState === EventSource.CLOSED) {             console.log(\"Connection closed.\");             document.getElementById(\"output\").innerHTML += \"<p>SSE connection closed.</p>\";             // You might want to attempt reconnection here:             // setTimeout(() => {             //   new EventSource(\"[SAME URL as ABOVE]\");             // }, 5000); // Reconnect after 5 seconds           }         };          eventSource.addEventListener(\"tick\", (e) => { // you only need to read \"tick\" events           // following example is based on the JSON response. You might have to change following code for the XML or CSV.           try {             const data = JSON.parse(event.data);             console.log(\"Received data:\", data);             document.getElementById(\"output\").innerHTML += JSON.stringify(data);           } catch (e) {             console.log(\"Received raw data:\", event.data);             document.getElementById(\"output\").innerHTML += event.data;           }         });       </script>      </body>     </html>
     * Rates / Stream
     */
    async v2StreamRaw(requestParameters: V2StreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2Stream200Response>> {
        const requestOptions = await this.v2StreamRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2Stream200ResponseFromJSON(jsonValue));
    }

    /**
     * Streams the latest exchange rates directly to you, so you don\'t have to ask for them all the time. ℹ️ Just connect to our rate-streaming service once, and we\'ll send you updates automatically whenever the rates change. If your connection is lost, you\'ll need to reconnect to keep getting the updates.  ### ⚠️️ \"TRY\" button won\'t work with stream endpoint.  #### Streaming Client Example     <!DOCTYPE html>     <html>     <head>     <title>OANDA Streaming Client Example</title>     </head>     <body>        <h1>Rates</h1>       <div id=\"output\"></div>        <script>         const eventSource = new EventSource(\"https://exchange-rates-api.oanda.com/v2/stream.[json/csv/xml]?base=[base currency]&quote=[quote currency(optional)]&api_key=[YOUR API KEY]&data_set=[datasets offered by OANDA(optional)]\");          eventSource.onopen = () => {           console.log(\"Connection established with streaming server.\");           document.getElementById(\"output\").innerHTML += \"<p>Connected</p>\";         };          eventSource.onerror = (error) => {           console.error(\"Error:\", error);           if (error.target.readyState === EventSource.CLOSED) {             console.log(\"Connection closed.\");             document.getElementById(\"output\").innerHTML += \"<p>SSE connection closed.</p>\";             // You might want to attempt reconnection here:             // setTimeout(() => {             //   new EventSource(\"[SAME URL as ABOVE]\");             // }, 5000); // Reconnect after 5 seconds           }         };          eventSource.addEventListener(\"tick\", (e) => { // you only need to read \"tick\" events           // following example is based on the JSON response. You might have to change following code for the XML or CSV.           try {             const data = JSON.parse(event.data);             console.log(\"Received data:\", data);             document.getElementById(\"output\").innerHTML += JSON.stringify(data);           } catch (e) {             console.log(\"Received raw data:\", event.data);             document.getElementById(\"output\").innerHTML += event.data;           }         });       </script>      </body>     </html>
     * Rates / Stream
     */
    async v2Stream(requestParameters: V2StreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2Stream200Response> {
        const response = await this.v2StreamRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2SupportedForwards without sending the request
     */
    async v2SupportedForwardsRequestOpts(requestParameters: V2SupportedForwardsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2SupportedForwards().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['base'] != null) {
            queryParameters['base'] = requestParameters['base'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
        }

        if (requestParameters['dataSet'] != null) {
            queryParameters['data_set'] = requestParameters['dataSet'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/supported_forwards.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Use the Supported Forwards endpoint to get a list of valid currency pairs and their associated tenors for use in the Forward rates endpoint. The result is returned as a list of base currency, quote currency and tenor combinations.
     * Supported Forwards
     */
    async v2SupportedForwardsRaw(requestParameters: V2SupportedForwardsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2SupportedForwards200Response>> {
        const requestOptions = await this.v2SupportedForwardsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2SupportedForwards200ResponseFromJSON(jsonValue));
    }

    /**
     * Use the Supported Forwards endpoint to get a list of valid currency pairs and their associated tenors for use in the Forward rates endpoint. The result is returned as a list of base currency, quote currency and tenor combinations.
     * Supported Forwards
     */
    async v2SupportedForwards(requestParameters: V2SupportedForwardsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2SupportedForwards200Response> {
        const response = await this.v2SupportedForwardsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v2dataset without sending the request
     */
    async v2datasetRequestOpts(requestParameters: V2datasetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v2dataset().'
            );
        }

        if (requestParameters['dataSet'] == null) {
            throw new runtime.RequiredError(
                'dataSet',
                'Required parameter "dataSet" was null or undefined when calling v2dataset().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v2/datasets/{data_set}.{ext}`;
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));
        urlPath = urlPath.replace('{data_set}', encodeURIComponent(String(requestParameters['dataSet'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get a dataset metadata (code, description, and cross currency), and the quotables available on this dataset
     * Datasets
     */
    async v2datasetRaw(requestParameters: V2datasetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V2dataset200Response>> {
        const requestOptions = await this.v2datasetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V2dataset200ResponseFromJSON(jsonValue));
    }

    /**
     * Get a dataset metadata (code, description, and cross currency), and the quotables available on this dataset
     * Datasets
     */
    async v2dataset(requestParameters: V2datasetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V2dataset200Response> {
        const response = await this.v2datasetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const V2AggregatedExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2AggregatedExtEnum = typeof V2AggregatedExtEnum[keyof typeof V2AggregatedExtEnum];
/**
 * @export
 */
export const V2AggregatedFieldsEnum = {
    Open: 'open',
    Close: 'close',
    Averages: 'averages',
    Highs: 'highs',
    Lows: 'lows',
    All: 'all'
} as const;
export type V2AggregatedFieldsEnum = typeof V2AggregatedFieldsEnum[keyof typeof V2AggregatedFieldsEnum];
/**
 * @export
 */
export const V2AggregatedDecimalPlacesEnum = {
    _1: '1',
    _2: '2',
    _3: '3',
    _4: '4',
    _5: '5',
    _6: '6',
    _7: '7',
    _8: '8',
    _9: '9',
    _10: '10',
    _11: '11',
    _12: '12',
    _13: '13',
    _14: '14',
    _15: '15',
    All: 'all'
} as const;
export type V2AggregatedDecimalPlacesEnum = typeof V2AggregatedDecimalPlacesEnum[keyof typeof V2AggregatedDecimalPlacesEnum];
/**
 * @export
 */
export const V2CandleExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2CandleExtEnum = typeof V2CandleExtEnum[keyof typeof V2CandleExtEnum];
/**
 * @export
 */
export const V2CandleFieldsEnum = {
    Open: 'open',
    Close: 'close',
    Averages: 'averages',
    Highs: 'highs',
    Lows: 'lows',
    All: 'all'
} as const;
export type V2CandleFieldsEnum = typeof V2CandleFieldsEnum[keyof typeof V2CandleFieldsEnum];
/**
 * @export
 */
export const V2CandleDecimalPlacesEnum = {
    _1: '1',
    _2: '2',
    _3: '3',
    _4: '4',
    _5: '5',
    _6: '6',
    _7: '7',
    _8: '8',
    _9: '9',
    _10: '10',
    _11: '11',
    _12: '12',
    _13: '13',
    _14: '14',
    _15: '15',
    All: 'all'
} as const;
export type V2CandleDecimalPlacesEnum = typeof V2CandleDecimalPlacesEnum[keyof typeof V2CandleDecimalPlacesEnum];
/**
 * @export
 */
export const V2CandlesExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2CandlesExtEnum = typeof V2CandlesExtEnum[keyof typeof V2CandlesExtEnum];
/**
 * @export
 */
export const V2CandlesFieldsEnum = {
    Open: 'open',
    Close: 'close',
    Averages: 'averages',
    Highs: 'highs',
    Lows: 'lows',
    All: 'all'
} as const;
export type V2CandlesFieldsEnum = typeof V2CandlesFieldsEnum[keyof typeof V2CandlesFieldsEnum];
/**
 * @export
 */
export const V2CandlesDecimalPlacesEnum = {
    _1: '1',
    _2: '2',
    _3: '3',
    _4: '4',
    _5: '5',
    _6: '6',
    _7: '7',
    _8: '8',
    _9: '9',
    _10: '10',
    _11: '11',
    _12: '12',
    _13: '13',
    _14: '14',
    _15: '15',
    All: 'all'
} as const;
export type V2CandlesDecimalPlacesEnum = typeof V2CandlesDecimalPlacesEnum[keyof typeof V2CandlesDecimalPlacesEnum];
/**
 * @export
 */
export const V2CurrenciesExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2CurrenciesExtEnum = typeof V2CurrenciesExtEnum[keyof typeof V2CurrenciesExtEnum];
/**
 * @export
 */
export const V2ForwardExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2ForwardExtEnum = typeof V2ForwardExtEnum[keyof typeof V2ForwardExtEnum];
/**
 * @export
 */
export const V2RemainingQuotesExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2RemainingQuotesExtEnum = typeof V2RemainingQuotesExtEnum[keyof typeof V2RemainingQuotesExtEnum];
/**
 * @export
 */
export const V2SpotExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2SpotExtEnum = typeof V2SpotExtEnum[keyof typeof V2SpotExtEnum];
/**
 * @export
 */
export const V2StreamExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2StreamExtEnum = typeof V2StreamExtEnum[keyof typeof V2StreamExtEnum];
/**
 * @export
 */
export const V2SupportedForwardsExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2SupportedForwardsExtEnum = typeof V2SupportedForwardsExtEnum[keyof typeof V2SupportedForwardsExtEnum];
/**
 * @export
 */
export const V2datasetExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V2datasetExtEnum = typeof V2datasetExtEnum[keyof typeof V2datasetExtEnum];
/**
 * @export
 */
export const V2datasetDataSetEnum = {
    Oanda: 'OANDA',
    Crypto: 'CRYPTO',
    Aecb: 'AECB',
    Alcb: 'ALCB',
    Amcb: 'AMCB',
    Ancb: 'ANCB',
    Aocb: 'AOCB',
    Arbn: 'ARBN',
    Arcb: 'ARCB',
    Aucb: 'AUCB',
    Azcb: 'AZCB',
    Bacb: 'BACB',
    Bacm: 'BACM',
    Bceao: 'BCEAO',
    Bdcb: 'BDCB',
    Beac: 'BEAC',
    Bgcb: 'BGCB',
    Bhcb: 'BHCB',
    Bocb: 'BOCB',
    Brcb: 'BRCB',
    Btcb: 'BTCB',
    Cacb: 'CACB',
    Cdcb: 'CDCB',
    Chcb: 'CHCB',
    Clcb: 'CLCB',
    Cncb: 'CNCB',
    Cocb: 'COCB',
    Cous: 'COUS',
    Crcb: 'CRCB',
    Crus: 'CRUS',
    Cucb: 'CUCB',
    Cycb: 'CYCB',
    Czcb: 'CZCB',
    Czcbma: 'CZCBMA',
    Dkcb: 'DKCB',
    Docb: 'DOCB',
    Dzcb: 'DZCB',
    Egcb: 'EGCB',
    Eucb: 'EUCB',
    Gbcb: 'GBCB',
    Gecb: 'GECB',
    Ghcb: 'GHCB',
    Gncb: 'GNCB',
    Gtcb: 'GTCB',
    Gycb: 'GYCB',
    Hkcb: 'HKCB',
    Hncb: 'HNCB',
    Hrcb: 'HRCB',
    Hsvn: 'HSVN',
    Hucb: 'HUCB',
    Idcb: 'IDCB',
    Idfp: 'IDFP',
    Ilcb: 'ILCB',
    Imf: 'IMF',
    Incb: 'INCB',
    Icegate: 'ICEGATE',
    Iscb: 'ISCB',
    Jmcb: 'JMCB',
    Kgcb: 'KGCB',
    Khcb: 'KHCB',
    Krcb: 'KRCB',
    Kzcb: 'KZCB',
    Lacb: 'LACB',
    Macb: 'MACB',
    Mdcb: 'MDCB',
    Mdof: 'MDOF',
    Mkcb: 'MKCB',
    Mncb: 'MNCB',
    Mufg: 'MUFG',
    Mvcb: 'MVCB',
    Mxcb: 'MXCB',
    Mxcl: 'MXCL',
    Mxdo: 'MXDO',
    Mycb: 'MYCB',
    Mzcb: 'MZCB',
    Ngcb: 'NGCB',
    Nicb: 'NICB',
    Nocb: 'NOCB',
    Npcb: 'NPCB',
    Omcb: 'OMCB',
    Pecb: 'PECB',
    Pesbs: 'PESBS',
    Phcb: 'PHCB',
    Phbap: 'PHBAP',
    Pkcb: 'PKCB',
    Plcb: 'PLCB',
    Pycb: 'PYCB',
    Rocb: 'ROCB',
    Rscb: 'RSCB',
    Rucb: 'RUCB',
    Rwcb: 'RWCB',
    Sacb: 'SACB',
    Sbi: 'SBI',
    Sbiref: 'SBIREF',
    Sgcb: 'SGCB',
    Secb: 'SECB',
    Siemxn: 'SIEMXN',
    Slcb: 'SLCB',
    Sscb: 'SSCB',
    Svcb: 'SVCB',
    Thcb: 'THCB',
    Thct: 'THCT',
    Tncb: 'TNCB',
    Trcb: 'TRCB',
    Ttcb: 'TTCB',
    Twcb: 'TWCB',
    Twcpt: 'TWCPT',
    Twcr: 'TWCR',
    Twsr: 'TWSR',
    Tzcb: 'TZCB',
    Uacb: 'UACB',
    Ugit: 'UGIT',
    Ugra: 'UGRA',
    Untr: 'UNTR',
    Usfr: 'USFR',
    Uycb: 'UYCB',
    Uzcb: 'UZCB',
    VecbDicom: 'VECB-DICOM',
    Vncb: 'VNCB',
    Zmcb: 'ZMCB',
    Zmer: 'ZMER',
    Zwcb: 'ZWCB'
} as const;
export type V2datasetDataSetEnum = typeof V2datasetDataSetEnum[keyof typeof V2datasetDataSetEnum];
