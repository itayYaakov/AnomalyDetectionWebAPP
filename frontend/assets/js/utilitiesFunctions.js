const request = async(url, params = {}, data = {}, method = "GET") => {
    let options = {
        method,
    };

    if (params && data) {
        url += "?" + new URLSearchParams(params).toString();
        options.body = JSON.stringify(data);
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    } else if ("GET" === method) {
        url += "?" + new URLSearchParams(params).toString();
    } else {
        options.body = JSON.stringify(params);
    }

    const response = await fetch(url, options);
    return response;
};
get = (url, params) => request(url, params, undefined, "GET");
post = (url, params) => request(url, params, undefined, "POST");
get = (url, params, data) => request(url, params, data, "GET");
post = (url, params, data) => request(url, params, data, "POST");