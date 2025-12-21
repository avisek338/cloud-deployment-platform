const httpProxy = require('http-proxy');

class HttpProxyConfig {
    
    constructor(){
        throw new Error("Use HttpProxyConfig.getInstance()");
    }
    static getInstance() {
        if (!this.proxy) {
            this.proxy = httpProxy.createProxy();
        }
        return this.proxy;
    }
}

module.exports = HttpProxyConfig;