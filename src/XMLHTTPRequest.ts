export type SuccessStatus = 200 | 201 | 202 | 204 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

export interface IXMLHTTPConfig {
    method: string;
    data?: string;
    url?: string;
    isAsync?: boolean;
    headers: {[k: string]: any};
}

export default class XMLHTTPRequest {
    private url: string = '';
    private async: boolean = true;
    private data: string | null = null;
    private method: string = 'GET';
    private successStatus: number[] = [200, 201, 202, 204, 203, 204, 205, 206, 207, 208, 226];
    constructor(url?: string) {
        this.url = url || this.url;
    }

    public send(config: IXMLHTTPConfig) {
        this.url = config.url || this.url;
        this.data = config.data || this.data;
        this.async = config.isAsync ? config.isAsync : this.async;
        this.method = config.method || this.method;
        return new Promise((resolve: (xhttp: XMLHttpRequest) => void, reject: (xhttp: XMLHttpRequest) => void) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (this.successStatus.indexOf(xhttp.status) > -1) {
                        resolve(xhttp);
                    } else if (xhttp.status >= 400 && xhttp.status <= 600) {
                        reject(xhttp);
                    }
                }
            };
            xhttp.open(this.method, this.url, this.async);
            this.setHeaders(xhttp, config.headers);
            try {
                if (this.data) {
                    xhttp.send(this.data);
                } else {
                    xhttp.send();
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    private setHeaders(xhttp: XMLHttpRequest, headers: {[k: string]: any}) {
        if (headers && typeof headers === 'object') {
            Object.keys(headers).forEach((key: string) => {
                xhttp.setRequestHeader(key, headers[key]);
            });
        }
    }
}
