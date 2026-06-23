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


/**
 * 
 * @export
 */
export const Dataset = {
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
export type Dataset = typeof Dataset[keyof typeof Dataset];


export function instanceOfDataset(value: any): boolean {
    for (const key in Dataset) {
        if (Object.prototype.hasOwnProperty.call(Dataset, key)) {
            if (Dataset[key as keyof typeof Dataset] === value) {
                return true;
            }
        }
    }
    return false;
}

export function DatasetFromJSON(json: any): Dataset {
    return DatasetFromJSONTyped(json, false);
}

export function DatasetFromJSONTyped(json: any, ignoreDiscriminator: boolean): Dataset {
    return json as Dataset;
}

export function DatasetToJSON(value?: Dataset | null): any {
    return value as any;
}

export function DatasetToJSONTyped(value: any, ignoreDiscriminator: boolean): Dataset {
    return value as Dataset;
}

