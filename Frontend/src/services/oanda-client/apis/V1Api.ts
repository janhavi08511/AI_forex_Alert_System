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
    type RemainingQuotes,
    RemainingQuotesFromJSON,
    RemainingQuotesToJSON,
} from '../models/RemainingQuotes';
import {
    type V1Rates200Response,
    V1Rates200ResponseFromJSON,
    V1Rates200ResponseToJSON,
} from '../models/V1Rates200Response';
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

export interface V1RatesRequest {
    base: string;
    ext: V1RatesExtEnum;
    apiKey?: string;
    quote?: Array<string>;
    fields?: Array<V1RatesFieldsEnum>;
    dataSet?: Dataset;
    decimalPlaces?: V1RatesDecimalPlacesEnum;
    date?: string;
    start?: string;
    end?: string;
}

/**
 * 
 */
export class V1Api extends runtime.BaseAPI {

    /**
     * Creates request options for v1Rates without sending the request
     */
    async v1RatesRequestOpts(requestParameters: V1RatesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['base'] == null) {
            throw new runtime.RequiredError(
                'base',
                'Required parameter "base" was null or undefined when calling v1Rates().'
            );
        }

        if (requestParameters['ext'] == null) {
            throw new runtime.RequiredError(
                'ext',
                'Required parameter "ext" was null or undefined when calling v1Rates().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['quote'] != null) {
            queryParameters['quote'] = requestParameters['quote'];
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

        if (requestParameters['date'] != null) {
            queryParameters['date'] = requestParameters['date'];
        }

        if (requestParameters['start'] != null) {
            queryParameters['start'] = requestParameters['start'];
        }

        if (requestParameters['end'] != null) {
            queryParameters['end'] = requestParameters['end'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v1/rates/{base}.{ext}`;
        urlPath = urlPath.replace('{base}', encodeURIComponent(String(requestParameters['base'])));
        urlPath = urlPath.replace('{ext}', encodeURIComponent(String(requestParameters['ext'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Use the Rates endpoint to get the quotes for one or more currency pairs. If applicable, the number of quotes returned is charged against the quote limit for your plan.  You may request quotes for a single date, or as an average over a date range. If your plan has a quote limit, each response will include the \'X-Rate-Limit-Remaining\' header containing the number of remaining quotes available for the current billing period.  ## Date ranges  When a date range is specified using \'start\' and \'end\' the returned quotes are slightly different:  - \'bid\' and \'ask\' – The average (mean) bid and ask quotes over the date range.   The date range average is calculated using the average daily bid and ask   quotes over the entire date range, including the \'start\' and \'end\' dates  - \'spot\' – For Central Bank exchange rates only. The average (mean) spot rate   over the date range. This is calculated just as \'bid\' and \'ask\' are.  - \'midpoint\' – The midpoint between the date range average \'bid\' and \'ask\'   quotes. It is _not_ the average of all midpoints  - \'high_bid\' and \'high_ask\' – The highest (maximum) \'high_bid\' and \'high_ask\'   values in the range  - \'low_ask\' and \'low_bid\' – The lowest (minimum) \'low_bid\' and \'low_ask\' values   in the range  ## Specifications and caveats  This section discusses some of the API specifications and how the API handles a number of special cases:  - Rates are updated and posted daily at 00:00 UTC.  - All requested and returned dates and times are UTC.  - Rates are rounded half to even when requesting less number of decimal places   than we have.  - The Central Bank exchange rates consist solely of a spot price. As such, the   \'fields\' option will be ignored when requesting Central Bank exchange rates.  - Quotes availability on certain date of certain currency pair varies on data   set. You may check the Currencies endpoint to see what is available for certain data set.    - When quotes are absent for one or more currencies on specified date or date     range, the API will return quotes for only the currency pairs that have data     available. For example, if you pass a date that is before January 1, 1999,     the API will not return any EUR currency pairs.    - Please note that quotes that are not returned by the API are not counted     against your quote limit.    - If you do not see the rates you are looking for, please contact     FXDS Customer Experience Team at webservices@oanda.com.  - If your API request specifies the \'highs\' and \'lows\' fields (i.e. \'high_bid\',   \'high_ask\', \'low_bid\', \'low_ask\'):    - These fields are only available for instruments that trade on OANDA’s     fxTrade platform    - If these fields are requested and are not available, they are omitted from     the results. If the output format is JSON or XML the fields are not     included in the quote. If the output format is CSV, the columns     corresponding to these fields are left empty    - If only \'highs\' and/or \'lows\' are requested, and there are no quotes for a     particular quote currency, the quote is omitted from the response. If this     results in all quotes being omitted, an error will be thrown  - \'date\' is omitted from a quote response when a date range is requested as the   quotes returned are calculated on-the-fly and not stored by the API  - Not all currency pairs are updated daily. For those currency pairs, requesting   a particular date’s quote returns the most recent quote prior or equal to   that day.  - If you specify a date range, there is a limit of 10,000 on the number of days   in the range combining with the number of quote currencies per request. For   example, if a request specifies 10 quote currencies, its start and end date   may not span over 1,000 days. In other words, the product of number of quote   currencies and number of days between \'start\' and \'end\' may not exceed 10,000.
     * Rates
     */
    async v1RatesRaw(requestParameters: V1RatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V1Rates200Response>> {
        const requestOptions = await this.v1RatesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V1Rates200ResponseFromJSON(jsonValue));
    }

    /**
     * Use the Rates endpoint to get the quotes for one or more currency pairs. If applicable, the number of quotes returned is charged against the quote limit for your plan.  You may request quotes for a single date, or as an average over a date range. If your plan has a quote limit, each response will include the \'X-Rate-Limit-Remaining\' header containing the number of remaining quotes available for the current billing period.  ## Date ranges  When a date range is specified using \'start\' and \'end\' the returned quotes are slightly different:  - \'bid\' and \'ask\' – The average (mean) bid and ask quotes over the date range.   The date range average is calculated using the average daily bid and ask   quotes over the entire date range, including the \'start\' and \'end\' dates  - \'spot\' – For Central Bank exchange rates only. The average (mean) spot rate   over the date range. This is calculated just as \'bid\' and \'ask\' are.  - \'midpoint\' – The midpoint between the date range average \'bid\' and \'ask\'   quotes. It is _not_ the average of all midpoints  - \'high_bid\' and \'high_ask\' – The highest (maximum) \'high_bid\' and \'high_ask\'   values in the range  - \'low_ask\' and \'low_bid\' – The lowest (minimum) \'low_bid\' and \'low_ask\' values   in the range  ## Specifications and caveats  This section discusses some of the API specifications and how the API handles a number of special cases:  - Rates are updated and posted daily at 00:00 UTC.  - All requested and returned dates and times are UTC.  - Rates are rounded half to even when requesting less number of decimal places   than we have.  - The Central Bank exchange rates consist solely of a spot price. As such, the   \'fields\' option will be ignored when requesting Central Bank exchange rates.  - Quotes availability on certain date of certain currency pair varies on data   set. You may check the Currencies endpoint to see what is available for certain data set.    - When quotes are absent for one or more currencies on specified date or date     range, the API will return quotes for only the currency pairs that have data     available. For example, if you pass a date that is before January 1, 1999,     the API will not return any EUR currency pairs.    - Please note that quotes that are not returned by the API are not counted     against your quote limit.    - If you do not see the rates you are looking for, please contact     FXDS Customer Experience Team at webservices@oanda.com.  - If your API request specifies the \'highs\' and \'lows\' fields (i.e. \'high_bid\',   \'high_ask\', \'low_bid\', \'low_ask\'):    - These fields are only available for instruments that trade on OANDA’s     fxTrade platform    - If these fields are requested and are not available, they are omitted from     the results. If the output format is JSON or XML the fields are not     included in the quote. If the output format is CSV, the columns     corresponding to these fields are left empty    - If only \'highs\' and/or \'lows\' are requested, and there are no quotes for a     particular quote currency, the quote is omitted from the response. If this     results in all quotes being omitted, an error will be thrown  - \'date\' is omitted from a quote response when a date range is requested as the   quotes returned are calculated on-the-fly and not stored by the API  - Not all currency pairs are updated daily. For those currency pairs, requesting   a particular date’s quote returns the most recent quote prior or equal to   that day.  - If you specify a date range, there is a limit of 10,000 on the number of days   in the range combining with the number of quote currencies per request. For   example, if a request specifies 10 quote currencies, its start and end date   may not span over 1,000 days. In other words, the product of number of quote   currencies and number of days between \'start\' and \'end\' may not exceed 10,000.
     * Rates
     */
    async v1Rates(requestParameters: V1RatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V1Rates200Response> {
        const response = await this.v1RatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const V1RatesExtEnum = {
    Csv: 'csv',
    Json: 'json',
    Xml: 'xml'
} as const;
export type V1RatesExtEnum = typeof V1RatesExtEnum[keyof typeof V1RatesExtEnum];
/**
 * @export
 */
export const V1RatesFieldsEnum = {
    Averages: 'averages',
    Midpoint: 'midpoint',
    Highs: 'highs',
    Lows: 'lows',
    All: 'all'
} as const;
export type V1RatesFieldsEnum = typeof V1RatesFieldsEnum[keyof typeof V1RatesFieldsEnum];
/**
 * @export
 */
export const V1RatesDecimalPlacesEnum = {
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
export type V1RatesDecimalPlacesEnum = typeof V1RatesDecimalPlacesEnum[keyof typeof V1RatesDecimalPlacesEnum];
