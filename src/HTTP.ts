
import XMLHTTPRequest from './XMLHTTPRequest';

export interface HTTPPromise<T = any> extends Promise<HTTPResponse<T>> {
}

export interface HTTPConfig {
    baseUrl?: string;
    headers: {[k: string]: any};
    authTokenResolver?: (config: HTTPConfig) => void;
    [k: string]: any;
}

export interface IHTTP {
    config: HTTPConfig;
    get: (url: string, params?: object) => Promise<HTTPResponse>;
    post: (url: string, params?: object) => Promise<HTTPResponse>;
    put: (url: string, params?: object) => Promise<HTTPResponse>;
    patch: (url: string, params?: object) => Promise<HTTPResponse>;
    delete: (url: string, params?: object) => Promise<HTTPResponse>;
    beforeRequest?: (config: HTTPConfig) => void;
}

export interface HTTPResponse<T = any>  {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: HTTPConfig;
    request?: any;
  }

export default class HTTP extends XMLHTTPRequest implements IHTTP {
    public config: HTTPConfig = {
        headers: {
            'Content-type': 'application/json',
        },
    };
    private request: any = this.config;

    constructor(config: HTTPConfig) {
        super(config.baseUrl);
        this.config = config;
    }

    public interceptor() {
        if (this.config.authTokenResolver) {
            this.config.authTokenResolver(this.config);
        }
    }

    public get(url: string, params?: object): Promise<HTTPResponse> {
        this.interceptor();
        let fullUrl = `${this.config.baseUrl ? this.config.baseUrl : ''}/${url}`;
        fullUrl = this.appendParams(fullUrl, params || {});
        return this.send({
            method: 'GET',
            url: fullUrl,
            headers: this.config.headers,
        }).then((xhttp: XMLHttpRequest) => this.formatRespone(xhttp, fullUrl));
    }

    public post(url: string, params?: object): Promise<HTTPResponse> {
        this.interceptor();
        const fullUrl = `${this.config.baseUrl ? this.config.baseUrl : ''}/${url}`;
        return this.send({
            method: 'POST',
            url: fullUrl,
            data: JSON.stringify(params),
            headers: this.config.headers,
        }).then((xhttp: XMLHttpRequest) => this.formatRespone(xhttp, fullUrl));
    }

    public delete(url: string, params?: object): Promise<HTTPResponse> {
        this.interceptor();
        let fullUrl = `${this.config.baseUrl ? this.config.baseUrl : ''}/${url}`;
        fullUrl = this.appendParams(fullUrl, params || {});
        return this.send({
            method: 'DELETE',
            url: fullUrl,
            headers: this.config.headers,
        }).then((xhttp: XMLHttpRequest) => this.formatRespone(xhttp, fullUrl));
    }

    public patch(url: string, params?: object): Promise<HTTPResponse> {
        this.interceptor();
        const fullUrl = `${this.config.baseUrl ? this.config.baseUrl : ''}/${url}`;
        return this.send({
            method: 'PATCH',
            url: fullUrl,
            data: JSON.stringify(params),
            headers: this.config.headers,
        }).then((xhttp: XMLHttpRequest) => this.formatRespone(xhttp, fullUrl));
    }

    public put(url: string, params?: object): Promise<HTTPResponse> {
        this.interceptor();
        const fullUrl = `${this.config.baseUrl ? this.config.baseUrl : ''}/${url}`;
        return this.send({
            method: 'PUT',
            url: fullUrl,
            data: JSON.stringify(params),
            headers: this.config.headers,
        }).then((xhttp: XMLHttpRequest) => this.formatRespone(xhttp, fullUrl));
    }

    private formatRespone(xhttp: XMLHttpRequest, fullUrl: string): HTTPResponse {
        let data: any;
        const request =  Object.assign(this.config, {fullUrl});
        if (xhttp) {
            if (xhttp.responseType === '' || xhttp.responseType === 'json') {
                data = xhttp.responseText;
                if (data.length > 0) {
                    try {
                        data = JSON.parse(xhttp.responseText);
                    } catch (e) {
                        throw new Error('Unable to parse response content');
                    }
                }
            }
        }
        return {
            config: this.config,
            data,
            headers: this.config.headers,
            status: xhttp.status,
            statusText: String(xhttp.statusText),
            request,
        };
    }

    private appendParams(url: string, params: {[k: string]: any}) {
        const paramsStr = Object.keys(params).map((key) => (`${key}=${params[key]}`)).join('&');
        const paramidentifier = (url.indexOf('?') > -1 || paramsStr.length === 0 ) ? '' : '?';
        return  `${url}${paramidentifier}${paramsStr}`;
    }
}
