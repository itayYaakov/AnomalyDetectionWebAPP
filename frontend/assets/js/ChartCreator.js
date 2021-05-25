chartCol1;
chartCol2;
chartCorrelation;

class ChartsCreator {
    static singleFeatureConfig = {
        type: "line",
        data: undefined,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontColor: "black",
                    fontSize: 18,
                },
            },
            responsive: false,
            elements: {
                line: {
                    tension: 0,
                    fill: false,
                },
            },
        },
    };
    static doubleFeatureConfig = {
        type: "scatter",
        data: undefined,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontColor: "black",
                    fontSize: 18,
                },
            },
            responsive: false,
            elements: {
                line: {
                    tension: 0,
                    fill: false,
                },
            },
        },
    };

    constructor(featuresJson, anomaliesJson) {
        this.features = featuresJson;
        this.anomalies = ChartsCreator.parseAnomalies(anomaliesJson);
    }

    getRange(begin, end) {
        let range = [];
        for (; begin < end; begin++) {
            range.push(String(begin));
        }
        return range;
    }

    static parseAnomalies(anomaliesData) {
        let anomalies = anomaliesData.anomalies;
        let anomaliesDict = {};
        for (let i = 0; i < anomalies.length; i++) {
            let entry = anomalies[i];
            anomaliesDict[entry.col_1 + "-" + entry.col_2] = entry.data;
        }
        return anomaliesDict;
    }

    setGraphData(ctx, data, graph) {

    }

    createFeaturesChart(featureName) {
        // let canvas = document.getElementById(chartId);
        // let ctx = canvas.getContext("2d");
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        const featureDictionary = this.features;
        const labels = this.getRange(0, featureDictionary[featureName].length);
        const data = {
            labels: labels,
            datasets: [{
                label: featureName,
                backgroundColor: "green",
                borderColor: "green",
                data: featureDictionary[featureName],
            }, ],
        };

        return data;
    }

    createCorrelationChart(feature1, feature2) {
        // let canvas = document.getElementById(chartId);
        // let ctx = canvas.getContext("2d");
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        let f1 = this.features[feature1];
        let f2 = this.features[feature2];
        let ano = this.anomalies[feature1 + "-" + feature2];

        let dataSet = [];

        for (let i = 0; i < f1.length; ++i) {
            dataSet.push({ x: f1[i], y: f2[i] });
        }


        // set charts.js parameters
        const data = {
            datasets: [{
                label: feature1 + "-" + feature2,
                backgroundColor: "black",
                borderColor: "black",
                data: dataSet,
            }, ],
        };

        //  set anomalies points as red
        data.datasets[0].pointBackgroundColor = [];
        data.datasets[0].pointBorderColor = [];

        for (let i = 0; i < ano.length; ++i) {
            data.datasets[0].pointBackgroundColor[ano[i]] = "red";
            data.datasets[0].pointBorderColor[ano[i]] = "red";
        }

        return data;
    }
}

function updateData(chart, id, data, config) {
    if (chart instanceof Chart) {
        removeData(chart);
        addData(chart, data.labels, data.datasets);
    } else {
        chart = new Chart(document.getElementById(id), config);
        chart['data'] = data;
    }
    chart.update();
    return chart;
}

function removeData(chart) {
    if (chart.data.labels)
        while (chart.data.labels.length) { chart.data.labels.pop(); }
    if (chart.data.datasets)
        while (chart.data.datasets.length) { chart.data.datasets.pop(); }
    chart.update();
}

function addData(chart, labels, datasets) {
    if (labels) {
        labels.forEach((item) => {
            chart.data.labels.push(item);
        });
    }
    if (datasets) {
        datasets.forEach((item) => {
            chart.data.datasets.push(item);
        });
    }
    chart.update();
}

async function createCharts(id, feature1, feature2) {
    const anomalies = await getAnomalies(id);
    const train = await getTrain(id);
    let creator = new ChartsCreator(train, anomalies);

    chartCol1Data = creator.createFeaturesChart(feature1);
    chartCol2Data = creator.createFeaturesChart(feature2);
    chartCorrelationData = creator.createCorrelationChart(feature1, feature2);

    chartCol1 = updateData(chartCol1, "chartCol1", chartCol1Data, ChartsCreator.singleFeatureConfig);
    chartCol2 = updateData(chartCol2, "chartCol2", chartCol2Data, ChartsCreator.singleFeatureConfig);
    chartCorrelation = updateData(chartCorrelation, "chartCorrelation", chartCorrelationData, ChartsCreator.doubleFeatureConfig);

    chartsError = document.getElementById('charts-error');
    charts = document.getElementById('charts');
    showElementBlock(charts);
    hideElementBlock(chartsError);
}

async function resetCharts() {
    chartsError = document.getElementById('charts-error');
    charts = document.getElementById('charts');
    showElementBlock(chartsError);
    hideElementBlock(charts);

    removeData(chartCol1);
    removeData(chartCol2);
    removeData(chartCorrelation);
}

//# sourceURL=ChartCreator.js