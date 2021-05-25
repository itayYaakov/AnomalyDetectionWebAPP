const request = async(url, params = undefined, data = undefined, method = "GET") => {
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
    } else if ("GET" === method && params) {
        url += "?" + new URLSearchParams(params).toString();
    } else if (params) {
        options.body = JSON.stringify(params);
    }

    const response = await fetch(url, options);
    return response;
};

post = (url, params, data) => request(url, params, data, "POST");
get = (url, params, data) => request(url, params, data, "GET");

const getFile = async(type, id) => {
    const name = type + "_" + id;

    // check if item is saved - if so, return it from local storage
    if (localStorage.hasOwnProperty(name)) {
        const raw_string = localStorage.getItem(name);
        const data_json = JSON.parse(raw_string);
        return data_json;
    }

    const url = "/reportData";
    params = {
        type: type,
        id: id
    };

    try {
        const response = await get(url, params);

        if (!response.ok) throw "Not a valid http response";
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error= ", error);
        return null;
    }
};


getAnomalies = (id) => getFile("anomalies", id);
getTrain = (id) => getFile("train", id);
getTest = (id) => getFile("test", id);

function hideElementFlex(elem) {
    $(elem).removeClass("d-flex").addClass("d-none");
}

function showElementFlex(elem) {
    $(elem).removeClass("d-none").addClass("d-flex");
}

function hideElementBlock(elem) {
    $(elem).removeClass("d-block").addClass("d-none");
}

function showElementBlock(elem) {
    $(elem).removeClass("d-none").addClass("d-block");
}

//# sourceURL=utilitiesFunctions.js