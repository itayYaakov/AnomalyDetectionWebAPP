var formHandler = function () {
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
  //var csv is the CSV file with headers
  function csvJSON(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
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

    let trainFileJson = csvJSON(trainFileCsv);
    let testFileJson = csvJSON(testFileCsv);
    const requestTime = Date.now();

    const config = {
      algorithm: algorithmType,
      threshold: thresholdSliderValue,
      time: requestTime,
      trainFileName: trainFile.name,
      testFileName: testFile.name,
    };
    const files = {
      train: trainFileJson,
      test: testFileJson,
    };
    const request = {
      config: config,
      files: files,
    };

    postData("/detect", request)
      .then((data) => {
        clearForm();
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        //   alert("Error in sending request to server:", error)
        clearForm();
      });

    return false;
  }

  var that = {};
  that.init = init;
  that.thresholdSliderOnInput = thresholdSliderOnInput;
  that.submitAnalyzeRequest = submitAnalyzeRequest;

  return that;
};

$(document).ready(function () {
  var pg = formHandler();
  pg.init();
});
