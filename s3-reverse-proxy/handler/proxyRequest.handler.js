function proxyReqHandler(proxyReq, req, res) {
   const url = req.url;
   if (url === '/')
    proxyReq.path += 'index.html';
}
module.exports = { proxyReqHandler };