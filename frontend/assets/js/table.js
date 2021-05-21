var table = function() {

    const html_table_id = "table_data";
    const html_table_error_id = "table_data_error";

    const table_obj = document.getElementById(html_table_id);
    const table_error_obj = document.getElementById(html_table_error_id);
    const table_title = document.getElementById("table-title");

    function init() {
        load_table()
            .catch((error) => {
                console.error(error);
            })
    }

    function createColumns(row) {
        var jsonData = [];
        var rowWithNumber = ['Row Number'].concat(row);

        rowWithNumber.forEach(function(columnName) {
            var jsonItem = {};
            jsonItem.id = columnName;
            jsonItem.name = columnName;
            jsonData.push(jsonItem);
        });

        return jsonData;
    }

    function parseData(data, columns) {
        var jsonData = [];


        let size = data[Object.keys(data)[0]].length;

        var i;
        for (i = 0; i < size; i++) {
            var jsonItem = {
                'Row Number': i
            };
            columns.forEach(function(columnName) {
                jsonItem[columnName] = data[columnName][i];
            });
            jsonData.push(jsonItem);
        }

        return jsonData;
    }

    function setTableValues(raw_data) {
        isTableVisible(false);

        let columns = createColumns(Object.keys(raw_data));
        let data = parseData(raw_data, Object.keys(raw_data));
        // sort: true,
        new gridjs.Grid({
            columns: columns,
            data: data,
            sort: true,
            fixedHeader: true,
            search: true,
            resizable: true,
            pagination: {
                enabled: true,
                limit: 25,
                summary: true,
            }
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
        const type = page.split("table_")[1];
        const id = sessionStorage.getItem("selectedId");
        let name = type.replace(/^./, type[0].toUpperCase()) + " Table";
        table_title.innerHTML = name;
        document.title = name;

        if (id) {
            const response = await getFile(type, id);

            if (response) {
                setTableValues(response);
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

//# sourceURL=table.js