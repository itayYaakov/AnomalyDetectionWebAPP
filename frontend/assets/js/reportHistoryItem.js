var reportHistoryItem = function() {
    let button_name = "reports_list_item_";

    function init() {
        document.querySelector("#event-manager").addEventListener("newReport", (event) => {
            updateReportsHistory();
        });
        updateReportsHistory();
    }

    const myHTMLTemplate = (item) => `
	<button type="button" id="${button_name}${item.id}" class="list-group-item list-group-item-action flex-column mb-1 shadow-lg align-items-start">
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

    function restoreLastActiveReport() {
        const id = sessionStorage.getItem("selectedId");
        if (id) {
            const button_id = button_name + id;
            $("#" + button_id).addClass("active");
            createButtons(id);
        }
    }

    function updateReportsStatics(data) {
        let total_reports = 0;
        let response_date = "";
        let report_duration = "";
        if (data && Object.keys(data).length !== 0) {
            try {
                const last_report = Object.keys(data).pop();
                let response_time = last_report;
                let request_time = data[last_report].time;
                report_duration = response_time - request_time + " ms";
                response_date = formatTimeToData(response_time);
                total_reports = Object.keys(data).length
            } catch (error) {
                debugger;
                console.log("Error", error);
            }
        }
        $("#statics-last-report-date").text(response_date);
        $("#statics-last-report-duration").text(report_duration);
        $("#statics-total-reports").text(total_reports);
    }

    async function updateReportsHistory() {
        let list = document.getElementById("reports_history");
        let list_error = document.getElementById("reports_history_error");


        while (list.firstChild) {
            list.firstChild.remove();
        }

        try {
            const response = await get("/reportsConfigHistory");
            if (!response.ok) throw "Not a valid http response";
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
            }
            updateReportsStatics(dataJson);
            restoreLastActiveReport();
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
            if (button === event.currentTarget && !button.classList.contains("active")) {
                var valueTexts = button.querySelectorAll(".text-variable");
                smallTexts.forEach(function(text) {
                    text.classList.replace("text-muted", "text-white");
                });
                valueTexts.forEach(function(text) {
                    text.classList.replace("text-variable", "text-variable-active");
                });
                return button.classList.add("active");
            }
            if (button.classList.contains("active")) {
                var valueActiveTexts = button.querySelectorAll(".text-variable-active");
                smallTexts.forEach(function(text) {
                    text.classList.replace("text-white", "text-muted");
                });
                valueActiveTexts.forEach(function(text) {
                    text.classList.replace("text-variable-active", "text-variable");
                });
                return button.classList.remove("active");
            }
        });
        updateSelectedReport(event.currentTarget);
    }

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    async function createButtons(id) {
        try {
            const buttonHolder = document.getElementById("columns-buttons");
            const buttonHolderError = document.getElementById("columns-buttons-error");

            buttonHolder.innerHTML = '';

            const response = await getAnomalies(id);
            const anomalies = response['anomalies'];
            const size = anomalies.length;
            $("#statics-anomalies-in-report").text(size);

            var i = 0;
            while (i < size) {
                let row = document.createElement("div");
                $(row).addClass("row").addClass("justify-content-center").addClass("mx-auto");
                for (var k = 0; k < 4; k++) {
                    if (i == size) break;
                    const col_1 = anomalies[i]['col_1'];
                    const col_2 = anomalies[i]['col_2'];
                    i++;
                    let button = document.createElement("button");
                    button.setAttribute("col_1", col_1);
                    button.setAttribute("col_2", col_2);
                    button.addEventListener("click", setColumnsButtonActive, false);
                    $(button).text(col_1 + "-" + col_2);
                    $(button).addClass("btn").addClass("btn-gradient").addClass("col-auto").addClass("btn-sm").addClass("mx-2").addClass("my-2");
                    row.appendChild(button);
                }
                buttonHolder.appendChild(row);
            }

            hideElement(buttonHolderError);
        } catch (error) {
            console.log(error);
            hideElement(buttonHolderError);
            buttonHolder.innerHTML = '';
        }
        return;
    }

    async function updateGraphs(id, col_1, col_2) {
        console.log(`id=${id} col_1=${col_1} col_2=${col_2}`);
    }

    async function setColumnsButtonActive(event) {
        // debugger;
        const buttonHolder = document.getElementById("columns-buttons");
        buttonHolder.querySelectorAll(".btn").forEach(function(button) {
            // remove active class from all buttons
            $(button).removeClass("active");
        });
        // add active class to the selected button
        let event_button = event.currentTarget;
        event_button.classList.add("active");
        const col_1 = event_button.getAttribute("col_1");
        const col_2 = event_button.getAttribute("col_2");
        const id = sessionStorage.getItem("selectedId");
        if (id) {
            updateGraphs(id, col_1, col_2);
        }
    }

    async function updateSelectedReport(button) {
        const id = button.id.split('_').pop();
        sessionStorage.setItem("selectedId", id);
        createButtons(id);
        return
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