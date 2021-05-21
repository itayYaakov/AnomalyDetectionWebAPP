var reportHistoryItem = function() {
    function init() {
        document.querySelector("#event-manager").addEventListener("newReport", (event) => {
            console.log("I'm listening on a custom event");
            updateReportsHistory();
        });
        updateReportsHistory();
    }

    const myHTMLTemplate = (item) => `
	<button type="button" id="reports_list_item_${item.id}" class="list-group-item list-group-item-action flex-column mb-1 shadow-lg align-items-start">
        <div class="row d-flex w-100 justify-content-between">
            <div class="col-9 p-0 m-0">
                <h5 class="mb-1">Test File: <font class="text-variable">${item.testFileName}</font></h5>
                <h5 class="mb-1">Train File: <font class="text-variable">${item.trainFileName}</font></h5>
            </div>
            <div class="col-3 p-0 m-0">
                <h6 class="text-right text-muted">response: ${item.responseTime}</h6>
            </div>            
        </div>
        <div class="row d-flex w-100 justify-content-between">
            <p class="mb-1">Algorithm: <font class="text-variable">${item.algorithm}</font></p>
            <p class="mb-1">Threshold: <font class="text-variable">${item.threshold}</font></p>
        </div>
        <div class="row d-flex w-100 justify-content-between">
		    <h6 class="text-muted">request: ${item.requestTime}</h6>
        </div>
	</button>
	`;

    const formatTime = (time) => {
        let time_parts = new Date(parseInt(time)).toLocaleString("he-IL").split(",");
        let date = time_parts[0].replaceAll(".", "/");
        let hour = time_parts[1];
        return date + " " + hour;
    };

    const formatTimeToData = (time) => {
        let time_parts = new Date(parseInt(time)).toLocaleString("he-IL").split(",");
        let date = time_parts[0].replaceAll(".", "/");
        return date;
    };

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

    function updateReportsStatics(data) {
        let response_time = 0;
        let request_time = 0;
        let response_date = 0;
        try {
            const last_report = Object.keys(data).pop();
            response_time = last_report;
            request_time = data[last_report].time;
            response_date = formatTimeToData(response_time);
        } catch (error) {
            debugger;
            console.log("Error", error);
        }
        $("#statics-last-report-date").text(response_date);
        $("#statics-last-report-duration").text((response_time - request_time) + " ms");
        // $("#statics-anomalies-in-report").text();
        $("#statics-total-reports").text(Object.keys(data).length);
    }

    async function updateReportsHistory() {
        let list = document.getElementById("reports_history");
        let list_error = document.getElementById("reports_history_error");


        while (list.firstChild) {
            list.firstChild.remove();
        }

        try {
            const response = await get("/reportsConfigHistory");
            if (response.status != 200) throw "Not a valid http response";
            const dataJson = await response.json();

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

                item_html.addEventListener("click", setHistoryItemActive, false);

                if (!list.firstChild) {
                    list.appendChild(item_html);
                } else {
                    list.insertBefore(item_html, list.childNodes[0]);
                }
                $(list).removeClass("d-none").addClass("d-flex");
                $(list_error).removeClass("d-flex").addClass("d-none");
                updateReportsStatics(dataJson);
            }
        } catch (error) {
            debugger;
            console.log(error);
            $(list_error).removeClass("d-none").addClass("d-flex");
            $(list).removeClass("d-flex").addClass("d-none");
        }
    }

    function setHistoryItemActive(event) {
        var buttonList = document.querySelectorAll("#reports_history > button");
        buttonList.forEach(function(button) {
            var smallTexts = button.querySelectorAll("h6");
            var valueTexts = button.querySelectorAll(".text-variable");
            var valueActiveTexts = button.querySelectorAll(".text-variable-active");
            if (button === event.currentTarget && !button.classList.contains("active")) {
                smallTexts.forEach(function(text) {
                    text.classList.replace("text-muted", "text-white");
                });
                valueTexts.forEach(function(text) {
                    text.classList.replace("text-variable", "text-variable-active");
                });
                return button.classList.add("active");
            }
            if (button.classList.contains("active")) {
                smallTexts.forEach(function(text) {
                    text.classList.replace("text-white", "text-muted");
                });
                valueActiveTexts.forEach(function(text) {
                    text.classList.replace("text-variable-active", "text-variable");
                });
                return button.classList.remove("active");
            }
        });
    }

    var that = {};
    that.init = init;
    that.setHistoryItemActive = setHistoryItemActive;

    return that;
};

$(document).ready(function() {
    var pg = reportHistoryItem();
    pg.init();
});

//# sourceURL=reportHistoryItem.js
//# sourceMappingURL=reportHistoryItem.js