var formHandler = function() {
    let button;
    let threshold;

    function init() {
        button = document.getElementById("submit_request_btn");
        threshold = document.getElementById("threshold_range");

        if (button) {
            button.addEventListener("click", submitAnalyzeRequest, false);
        } else {
            console.error("can't find submit_request_btn");
        }

        if (threshold) {
            threshold.addEventListener("input", thresholdSliderOnInput, false);
        } else {
            console.error("can't find threshold_range");
        }
    }

    function thresholdSliderOnInput(event) {
        let forObj = event.target.getAttribute("for");
        if (forObj) document.getElementById(forObj).innerText = event.target.value;
    }

    function csvToJson(text) {
        var json = {}
        var lines = text.split('\n')
        var attributes = lines[0].split(',')
        attributes.forEach(attr => {
            json[attr] = []
        })
        var values;
        for (var i = 1; i < lines.length; i++) {
            values = lines[i].split(',')
            if (values[0] == "")
                continue
            for (var j = 0; j < values.length; j++) {
                json[attributes[j]].push(parseFloat(values[j]))
            }
        }
        return json
    }

    const readCsv = (inputFile) => {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(inputFile);
        });
    };

    function clearForm() {
        document.getElementById("formCheck-hybrid").checked = false;
        document.getElementById("formCheck-regression").checked = false;
        resetDropZone(document.getElementById("drap-drop-train").getElementsByClassName("drop-zone")[0]);
        resetDropZone(document.getElementById("drap-drop-test").getElementsByClassName("drop-zone")[0]);
    }

    async function postData(url = "", data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    async function submitAnalyzeRequest() {
        let hybridButtonState = document.getElementById("formCheck-hybrid").checked;
        let regressionButtonState = document.getElementById("formCheck-regression").checked;

        let algorithmType = "";
        if (hybridButtonState == regressionButtonState) {
            alert("Both Hybrid and Regression are " + (hybridButtonState ? "ON" : "OFF"));
            return false;
        } else if (hybridButtonState) {
            algorithmType = "hybrid";
        } else if (regressionButtonState) {
            algorithmType = "regression";
        } else {
            return false;
        }

        const thresholdSliderValue = threshold.value;

        let trainFiles = document.getElementById("drap-drop-train").getElementsByTagName("input")[0].files;
        let testFiles = document.getElementById("drap-drop-test").getElementsByTagName("input")[0].files;

        if (trainFiles.length == 0) {
            alert("Please select train .csv file");
            return false;
        }
        if (testFiles.length == 0) {
            alert("Please select test .csv file");
            return false;
        }

        const trainFile = trainFiles[0];
        const testFile = testFiles[0];

        let trainFileCsv;
        try {
            trainFileCsv = await readCsv(trainFile);
        } catch (e) {
            alert("Error in reading", trainFile.name);
        }

        let testFileCsv;
        try {
            testFileCsv = await readCsv(testFile);
        } catch (e) {
            alert("Error in reading", testFile.name);
        }

        let trainFileJson = csvToJson(trainFileCsv);
        let testFileJson = csvToJson(testFileCsv);
        const requestTime = Date.now();

        const config = {
            algorithm: algorithmType,
            threshold: thresholdSliderValue,
            time: requestTime,
            trainFileName: trainFile.name,
            testFileName: testFile.name,
        };
        const body = {
            train: trainFileJson,
            test: testFileJson,
        };

        try {
            const response = await post("/detect", config, body);
            if (!response.ok) throw "Not a valid http response";
            const data = await response.json();
            console.log(data);
            const id = data['id'];
            let name = "anomalies_" + id;

            // store latest detect result
            try {
                localStorage.setItem(name, JSON.stringify(data));
            } catch (error) {
                console.log("Can't store anomalies, error:", error)
            }

            // check if item is saved - if not, clear storage and try again
            if (!localStorage.hasOwnProperty(name)) {
                localStorage.clear();
                localStorage.setItem(name, data)
            }
            // try to store train and test json as well
            name = "train_" + id;
            try {
                localStorage.setItem(name, JSON.stringify(trainFileJson));
            } catch (error) {
                console.log("Can't store trainFileJson, error:", error)
            }
            name = "test_" + id;
            try {
                localStorage.setItem(name, JSON.stringify(testFileJson));
            } catch (error) {
                console.log("Can't store testFileJson, error:", error)
            }

            const newReport = new CustomEvent("newReport");
            document.querySelector("#event-manager").dispatchEvent(newReport);
            clearForm();
        } catch (error) {
            console.log("Error in sending request to server:", error);
        }

        return false;
    }

    var that = {};
    that.init = init;
    that.thresholdSliderOnInput = thresholdSliderOnInput;
    that.submitAnalyzeRequest = submitAnalyzeRequest;

    return that;
};

$(document).ready(function() {
    var pg = formHandler();
    pg.init();
});

//# sourceURL=formHandler.js