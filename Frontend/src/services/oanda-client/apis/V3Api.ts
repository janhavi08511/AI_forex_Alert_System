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
    type BookDate,
    BookDateFromJSON,
    BookDateToJSON,
} from '../models/BookDate';
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
    type V3InstrumentsOrderBook200Response,
    V3InstrumentsOrderBook200ResponseFromJSON,
    V3InstrumentsOrderBook200ResponseToJSON,
} from '../models/V3InstrumentsOrderBook200Response';
import {
    type V3InstrumentsOrderBook429Response,
    V3InstrumentsOrderBook429ResponseFromJSON,
    V3InstrumentsOrderBook429ResponseToJSON,
} from '../models/V3InstrumentsOrderBook429Response';
import {
    type V3InstrumentsPositionBook200Response,
    V3InstrumentsPositionBook200ResponseFromJSON,
    V3InstrumentsPositionBook200ResponseToJSON,
} from '../models/V3InstrumentsPositionBook200Response';

export interface V3InstrumentsOrderBookRequest {
    instrument: string;
    apiKey?: string;
    date?: BookDate;
}

export interface V3InstrumentsPositionBookRequest {
    instrument: string;
    apiKey?: string;
    date?: BookDate;
}

/**
 * 
 */
export class V3Api extends runtime.BaseAPI {

    /**
     * Creates request options for v3InstrumentsOrderBook without sending the request
     */
    async v3InstrumentsOrderBookRequestOpts(requestParameters: V3InstrumentsOrderBookRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['instrument'] == null) {
            throw new runtime.RequiredError(
                'instrument',
                'Required parameter "instrument" was null or undefined when calling v3InstrumentsOrderBook().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['date'] != null) {
            queryParameters['date'] = requestParameters['date'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v3/instruments/{instrument}/orderBook`;
        urlPath = urlPath.replace('{instrument}', encodeURIComponent(String(requestParameters['instrument'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Fetch all orderbook snapshots for the given instrument and day.
     * Orderbook
     */
    async v3InstrumentsOrderBookRaw(requestParameters: V3InstrumentsOrderBookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V3InstrumentsOrderBook200Response>> {
        const requestOptions = await this.v3InstrumentsOrderBookRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V3InstrumentsOrderBook200ResponseFromJSON(jsonValue));
    }

    /**
     * Fetch all orderbook snapshots for the given instrument and day.
     * Orderbook
     */
    async v3InstrumentsOrderBook(requestParameters: V3InstrumentsOrderBookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V3InstrumentsOrderBook200Response> {
        const response = await this.v3InstrumentsOrderBookRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for v3InstrumentsPositionBook without sending the request
     */
    async v3InstrumentsPositionBookRequestOpts(requestParameters: V3InstrumentsPositionBookRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['instrument'] == null) {
            throw new runtime.RequiredError(
                'instrument',
                'Required parameter "instrument" was null or undefined when calling v3InstrumentsPositionBook().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['apiKey'] != null) {
            queryParameters['api_key'] = requestParameters['apiKey'];
        }

        if (requestParameters['date'] != null) {
            queryParameters['date'] = requestParameters['date'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }


        let urlPath = `/v3/instruments/{instrument}/positionBook`;
        urlPath = urlPath.replace('{instrument}', encodeURIComponent(String(requestParameters['instrument'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Fetch all positionbook snapshots for the given instrument and day.
     * Positionbook
     */
    async v3InstrumentsPositionBookRaw(requestParameters: V3InstrumentsPositionBookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V3InstrumentsPositionBook200Response>> {
        const requestOptions = await this.v3InstrumentsPositionBookRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V3InstrumentsPositionBook200ResponseFromJSON(jsonValue));
    }

    /**
     * Fetch all positionbook snapshots for the given instrument and day.
     * Positionbook
     */
    async v3InstrumentsPositionBook(requestParameters: V3InstrumentsPositionBookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V3InstrumentsPositionBook200Response> {
        const response = await this.v3InstrumentsPositionBookRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
