var table = function () {

  const html_table_id = "table_data";
  const html_table_error_id = "table_data_error";

  const table_obj = document.getElementById(html_table_id);
  const table_error_obj = document.getElementById(html_table_error_id);
  const table_title = document.getElementById("table_data_title");

  function init() {
    load_table().catch(error=> {console.error(error)});
  }

  const request = async (url, params = {}, method = "GET") => {
    let options = {
      method,
    };
    if ("GET" === method) {
      url += "?" + new URLSearchParams(params).toString();
    } else {
      options.body = JSON.stringify(params);
    }

    const response = await fetch(url, options);
    return response;
  };
  const get = (url, params) => request(url, params, "GET");
  const post = (url, params) => request(url, params, "POST");

  function createColumns(row) {
    var jsonData = [];

    Object.keys(row).forEach(function (columnName) {
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
    const type = page.split("Table")[0];
    const id = sessionStorage.getItem("selectedId") || 4548;

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
        table_title.innerHTML = "response_json";
      }
    }
  }

  var that = {};
  that.init = init;

  return that;
};

$(document).ready(function () {
  var pg = table();
  pg.init();
});
