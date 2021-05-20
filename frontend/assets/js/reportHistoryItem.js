var reportHistoryItem = function () {
  function init() {
    updateReportsHistory(config_obj);
  }

  const myHTMLTemplate = (item) => `
	<button type="button" id="reports_list_item_${item.id}" class="list-group-item list-group-item-action flex-column mb-1 shadow-lg align-items-start">
		<div class="row d-flex w-100 justify-content-between">
		<h5 class="col-xs-12 col-lg-6 mb-1">${item.testFileName} & ${item.trainFileName}</h5>
		<h6 class="col-xs-12 col-lg-6 text-right text-muted">response: ${item.responseTime}</h6>
		</div>
		<p class="mb-1">Algorithm: ${item.algorithm}</p>
		<p class="mb-1">Threshold: ${item.threshold}</p>
		<h6 class="text-muted">request: ${item.requestTime}</h6>
	</button>
	`;

  const formatTime = (time) => {
    let time_parts = new Date(parseInt(time) * 1000).toLocaleString("he-IL").split(",");
    let date = time_parts[0].replaceAll(".", "/");
    let hour = time_parts[1];
    return date + " " + hour;
  };

  // !!! delete later
  let config_json_raw = `{
	  "1621289575" : {
		  "algorithm" : "hybrid",
		  "threshold" : 0.8,
		  "time" : 1621289175,
		  "trainFileName" : "train.csv",
		  "testFileName" : "test.csv"
	  },
	  "1621289555" : {
		  "algorithm" : "regression",
		  "threshold" : 0.95,
		  "time" : 1621269555,
		  "trainFileName" : "train2.csv",
		  "testFileName" : "test2.csv"
	  },
	  "1621289435" : {
		  "algorithm" : "regression",
		  "threshold" : 0.25,
		  "time" : 1621289430,
		  "trainFileName" : "train_hekk.csv",
		  "testFileName" : "testds.csv"
	  },
	  "1621287575" : {
		  "algorithm" : "regression",
		  "threshold" : 0.25,
		  "time" : 1621287375,
		  "trainFileName" : "train254.csv",
		  "testFileName" : "test2211.csv"
	  },
	  "1621269575" : {
		  "algorithm" : "regression",
		  "threshold" : 0.285,
		  "time" : 1621269475,
		  "trainFileName" : "tra21in2.csv",
		  "testFileName" : "tes2t2.csv"
	  }
  }`;

  const config_obj = JSON.parse(config_json_raw);
  // !!! delete later

  /**
   * @param {String} HTML representing a single element
   * @return {Element}
   */
  function htmlToElement(html) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

  /**
   * @param {String} HTML representing any number of sibling elements
   * @return {NodeList}
   */
  function htmlToElements(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }

  function updateReportsHistory(dataJson) {
    let list = document.getElementById("reports_history");
    let list_error = document.getElementById("reports_history_error");

    list_error.remove();

    while (list.firstChild) {
      list.firstChild.remove();
    }

    for (const report in dataJson) {
      item = {
        id: report,
        testFileName: dataJson[report].testFileName,
        trainFileName: dataJson[report].trainFileName,
        algorithm: dataJson[report].algorithm,
        threshold: dataJson[report].threshold,
        responseTime: formatTime(report),
        requestTime: formatTime(dataJson[report].time),
      };

      let item_html_raw = myHTMLTemplate(item);
      let item_html = htmlToElement(item_html_raw);

      item_html.addEventListener("click", setActive, false);

      if (!list.firstChild) {
        list.appendChild(item_html);
      } else {
        list.insertBefore(item_html, list.childNodes[0]);
      }
    }
  }

  function setActive(event) {
    var buttonList = document.querySelectorAll("#reports_history > button");
    buttonList.forEach(function (button) {
      var smallTexts = button.querySelectorAll("h6");
      if (button === event.currentTarget && !button.classList.contains("active")) {
        smallTexts.forEach(function (text) {
          text.classList.replace("text-muted", "text-white");
        });
        return button.classList.add("active");
      }
      if (button.classList.contains("active")) {
        smallTexts.forEach(function (text) {
          text.classList.replace("text-white", "text-muted");
        });
        return button.classList.remove("active");
      }
    });
  }

  var that = {};
  that.init = init;
  that.setActive = setActive;

  return that;
};

$(document).ready(function () {
  var pg = reportHistoryItem();
  pg.init();
});
