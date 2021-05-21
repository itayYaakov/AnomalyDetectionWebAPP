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

// !!!!! do this
const isHtmlResponseValid = async(response) => {
    return true;
};

const getFile = async(type, id) => {
    const name = type + "_" + id;

    // check if item is saved - if so, return it from local storage
    if (localStorage.hasOwnProperty(name)) {
        return localStorage.getItem(name);
    }

    const url = "/reportData";
    params = {
        type: type,
        id: id
    };

    try {
        const response = await get(url, params);
        if (!isHtmlResponseValid) {
            console.log("isHtmlResponseValid==false, response=", response);
            throw "html response not valid";
        }
        let json = JSON.parse(response.js);
        return json;
    } catch (error) {
        console.log("error= ", error);
        return null;
    }
};

post = (url, params, data) => request(url, params, data, "POST");
get = (url, params) => request(url, params, undefined, "GET");
get = (url, params) => request(url, params, undefined, "GET");
get = (url, params) => request(url, params, undefined, "GET");