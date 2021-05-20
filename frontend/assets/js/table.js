import {get, post } from './utilitiesFunctions.js';

var table = function() {

    const html_table_id = "table_data";
    const html_table_error_id = "table_data_error";

    const table_obj = document.getElementById(html_table_id);
    const table_error_obj = document.getElementById(html_table_error_id);
    const table_title = document.getElementById("table-title");

    function init() {
        load_table().catch(error => { console.error(error) });
    }

    function createColumns(row) {
        var jsonData = [];

        Object.keys(row).forEach(function(columnName) {
            console.log(columnName);
            var jsonItem = {};
            jsonItem.id = columnName;
            jsonItem.name = columnName;
            jsonData.push(jsonItem);
        });

        return jsonData;
    }

    function setTableValues(data) {
        isTableVisible(false);

        new gridjs.Grid({
            columns: createColumns(data[0]),
            data: data,
        }).render(table_obj);
    }

    function isTableVisible(state) {
        table_error_obj.hidden = !state;
        table_obj.hidden = state;
        if (state) {
            table_title.innerHTML = "";
        }
    }

    async function load_table() {
        if (!table_obj) return;
        isTableVisible(true);

        const path = window.location.pathname;
        const page = path.split("/").pop();


        // parameters for http get request
        console.log("page=", page)
        const type = page.split("table_")[1];
        const id = sessionStorage.getItem("selectedId");
        console.log("type=", type)
        table_title.innerHTML = type.replace(/^./, type[0].toUpperCase()) + " Table";

        if (id) {
            const url = "/table";
            const params = {
                type: type,
                id: id,
            };
            const response = await get(url, params);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} url:${url} params:${params}`);
            }

            const response_json = await response.json();

            if (response_json.data) {
                setTableValues(table_json_obj);
            }
        }
    }

    var that = {};
    that.init = init;

    return that;
};

$(document).ready(function() {
    var pg = table();
    pg.init();
});