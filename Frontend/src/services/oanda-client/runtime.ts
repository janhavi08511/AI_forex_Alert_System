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

export const BASE_PATH = "https://exchange-rates-api.oanda.com".replace(/\/+$/, "");

export interface ConfigurationParameters {
    basePath?: string; // override base path
    fetchApi?: FetchAPI; // override for fetch implementation
    middleware?: Middleware[]; // middleware to apply before/after fetch requests
    queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
    username?: string; // parameter for basic security
    password?: string; // parameter for basic security
    apiKey?: string | Promise<string> | ((name: string) => string | Promise<string>); // parameter for apiKey security
    accessToken?: string | Promise<string> | ((name?: string, scopes?: string[]) => string | Promise<string>); // parameter for oauth2 security
    headers?: HTTPHeaders; //header params we want to use on every request
    credentials?: RequestCredentials; //value for the credentials param we want to use on each request
}

export class Configuration {
    constructor(private configuration: ConfigurationParameters = {}) {}

    set config(configuration: Configuration) {
        this.configuration = configuration;
    }

    get basePath(): string {
        return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
    }

    get fetchApi(): FetchAPI | undefined {
        return this.configuration.fetchApi;
    }

    get middleware(): Middleware[] {
        return this.configuration.middleware || [];
    }

    get queryParamsStringify(): (params: HTTPQuery) => string {
        return this.configuration.queryParamsStringify || querystring;
    }

    get username(): string | undefined {
        return this.configuration.username;
    }

    get password(): string | undefined {
        return this.configuration.password;
    }

    get apiKey(): ((name: string) => string | Promise<string>) | undefined {
        const apiKey = this.configuration.apiKey;
        if (apiKey) {
            return typeof apiKey === 'function' ? apiKey : () => apiKey;
        }
        return undefined;
    }

    get accessToken(): ((name?: string, scopes?: string[]) => string | Promise<string>) | undefined {
        const accessToken = this.configuration.accessToken;
        if (accessToken) {
            return typeof accessToken === 'function' ? accessToken : async () => accessToken;
        }
        return undefined;
    }

    get headers(): HTTPHeaders | undefined {
        return this.configuration.headers;
    }

    get credentials(): RequestCredentials | undefined {
        return this.configuration.credentials;
    }
}

export const DefaultConfig = new Configuration();

/**
 * This is the base class for all generated API classes.
 */
export class BaseAPI {

    private static readonly jsonRegex = /^(:?application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(:?;.*)?$/i;
    private middleware: Middleware[];

    constructor(protected configuration = DefaultConfig) {
        this.middleware = configuration.middleware;
    }

    withMiddleware<T extends BaseAPI>(this: T, ...middlewares: Middleware[]) {
        const next = this.clone<T>();
        next.middleware = next.middleware.concat(...middlewares);
        return next;
    }

    withPreMiddleware<T extends BaseAPI>(this: T, ...preMiddlewares: Array<Middleware['pre']>) {
        const middlewares = preMiddlewares.map((pre) => ({ pre }));
        return this.withMiddleware<T>(...middlewares);
    }

    withPostMiddleware<T extends BaseAPI>(this: T, ...postMiddlewares: Array<Middleware['post']>) {
        const middlewares = postMiddlewares.map((post) => ({ post }));
        return this.withMiddleware<T>(...middlewares);
    }

    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    protected isJsonMime(mime: string | null | undefined): boolean {
        if (!mime) {
            return false;
        }
        return BaseAPI.jsonRegex.test(mime);
    }

    protected async request(context: RequestOpts, initOverrides?: RequestInit | InitOverrideFunction): Promise<Response> {
        const { url, init } = await this.createFetchParams(context, initOverrides);
        const response = await this.fetchApi(url, init);
        if (response && (response.status >= 200 && response.status < 300)) {
            return response;
        }
        throw new ResponseError(response, 'Response returned an error code');
    }

    private async createFetchParams(context: RequestOpts, initOverrides?: RequestInit | InitOverrideFunction) {
        let url = this.configuration.basePath + context.path;
        if (context.query !== undefined && Object.keys(context.query).length !== 0) {
            // only add the querystring to the URL if there are query parameters.
            // this is done to avoid urls ending with a "?" character which buggy webservers
            // do not handle correctly sometimes.
            url += '?' + this.configuration.queryParamsStringify(context.query);
        }

        const headers = Object.assign({}, this.configuration.headers, context.headers);
        Object.keys(headers).forEach(key => headers[key] === undefined ? delete headers[key] : {});

        const initOverrideFn =
            typeof initOverrides === "function"
                ? initOverrides
                : async () => initOverrides;

        const initParams = {
            method: context.method,
            headers,
            body: context.body,
            credentials: this.configuration.credentials,
        };

        const overriddenInit: RequestInit = {
            ...initParams,
            ...(await initOverrideFn({
                init: initParams,
                context,
            }))
        };

        let body: any;
        if (isFormData(overriddenInit.body)
            || (overriddenInit.body instanceof URLSearchParams)
            || isBlob(overriddenInit.body)) {
          body = overriddenInit.body;
        } else if (this.isJsonMime(headers['Content-Type'])) {
          body = JSON.stringify(overriddenInit.body);
        } else {
          body = overriddenInit.body;
        }

        const init: RequestInit = {
            ...overriddenInit,
            body
        };

        return { url, init };
    }

    private fetchApi = async (url: string, init: RequestInit) => {
        let fetchParams = { url, init };
        for (const middleware of this.middleware) {
            if (middleware.pre) {
                fetchParams = await middleware.pre({
                    fetch: this.fetchApi,
                    ...fetchParams,
                }) || fetchParams;
            }
        }
        let response: Response | undefined = undefined;
        try {
            response = await (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
        } catch (e) {
            for (const middleware of this.middleware) {
                if (middleware.onError) {
                    response = await middleware.onError({
                        fetch: this.fetchApi,
                        url: fetchParams.url,
                        init: fetchParams.init,
                        error: e,
                        response: response ? response.clone() : undefined,
                    }) || response;
                }
            }
            if (response === undefined) {
              if (e instanceof Error) {
                throw new FetchError(e, 'The request failed and the interceptors did not return an alternative response');
              } else {
                throw e;
              }
            }
        }
        for (const middleware of this.middleware) {
            if (middleware.post) {
                response = await middleware.post({
                    fetch: this.fetchApi,
                    url: fetchParams.url,
                    init: fetchParams.init,
                    response: response.clone(),
                }) || response;
            }
        }
        return response;
    }

    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */
    private clone<T extends BaseAPI>(this: T): T {
        const constructor = this.constructor as any;
        const next = new constructor(this.configuration);
        next.middleware = this.middleware.slice();
        return next;
    }
};

function isBlob(value: any): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData(value: any): value is FormData {
    return typeof FormData !== "undefined" && value instanceof FormData;
}

export class ResponseError extends Error {
    override name: "ResponseError" = "ResponseError";
    constructor(public response: Response, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export class FetchError extends Error {
    override name: "FetchError" = "FetchError";
    constructor(public cause: Error, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export class RequiredError extends Error {
    override name: "RequiredError" = "RequiredError";
    constructor(public field: string, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export type Json = any;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type HTTPHeaders = { [key: string]: string };
export type HTTPQuery = { [key: string]: string | number | null | boolean | Array<string | number | null | boolean> | Set<string | number | null | boolean> | HTTPQuery };
export type HTTPBody = Json | FormData | URLSearchParams;
export type HTTPRequestInit = { headers?: HTTPHeaders; method: HTTPMethod; credentials?: RequestCredentials; body?: HTTPBody };
export type ModelPropertyNaming = 'camelCase' | 'snake_case' | 'PascalCase' | 'original';

export type InitOverrideFunction = (requestContext: { init: HTTPRequestInit, context: RequestOpts }) => Promise<RequestInit>

export interface FetchParams {
    url: string;
    init: RequestInit;
}

export interface RequestOpts {
    path: string;
    method: HTTPMethod;
    headers: HTTPHeaders;
    query?: HTTPQuery;
    body?: HTTPBody;
}

export function querystring(params: HTTPQuery, prefix: string = ''): string {
    return Object.keys(params)
        .map(key => querystringSingleKey(key, params[key], prefix))
        .filter(part => part.length > 0)
        .join('&');
}

function querystringSingleKey(key: string, value: string | number | null | undefined | boolean | Array<string | number | null | boolean> | Set<string | number | null | boolean> | HTTPQuery, keyPrefix: string = ''): string {
    const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
    if (value instanceof Array) {
        const multiValue = value.map(singleValue => encodeURIComponent(String(singleValue)))
            .join(`&${encodeURIComponent(fullKey)}=`);
        return `${encodeURIComponent(fullKey)}=${multiValue}`;
    }
    if (value instanceof Set) {
        const valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
    }
    if (value instanceof Date) {
        return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
    }
    if (value instanceof Object) {
        return querystring(value as HTTPQuery, fullKey);
    }
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}

export function exists(json: any, key: string) {
    const value = json[key];
    return value !== null && value !== undefined;
}

export function mapValues(data: any, fn: (item: any) => any) {
    const result: { [key: string]: any } = {};
    for (const key of Object.keys(data)) {
        result[key] = fn(data[key]);
    }
    return result;
}

export function canConsumeForm(consumes: Consume[]): boolean {
    for (const consume of consumes) {
        if ('multipart/form-data' === consume.contentType) {
            return true;
        }
    }
    return false;
}

export interface Consume {
    contentType: string;
}

export interface RequestContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
}

export interface ResponseContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
    response: Response;
}

export interface ErrorContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
    error: unknown;
    response?: Response;
}

export interface Middleware {
    pre?(context: RequestContext): Promise<FetchParams | void>;
    post?(context: ResponseContext): Promise<Response | void>;
    onError?(context: ErrorContext): Promise<Response | void>;
}

export interface ApiResponse<T> {
    raw: Response;
    value(): Promise<T>;
}

export interface ResponseTransformer<T> {
    (json: any): T;
}

export class JSONApiResponse<T> {
    constructor(public raw: Response, private transformer: ResponseTransformer<T> = (jsonValue: any) => jsonValue) {}

    async value(): Promise<T> {
        return this.transformer(await this.raw.json());
    }
}

export class VoidApiResponse {
    constructor(public raw: Response) {}

    async value(): Promise<void> {
        return undefined;
    }
}

export class BlobApiResponse {
    constructor(public raw: Response) {}

    async value(): Promise<Blob> {
        return await this.raw.blob();
    };
}

export class TextApiResponse {
    constructor(public raw: Response) {}

    async value(): Promise<string> {
        return await this.raw.text();
    };
}
