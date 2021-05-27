chartFeatures;
chartCorrelation;
let color1 = getComputedStyle(document.documentElement).getPropertyValue('--material-color-cyan-400');
let color2 = getComputedStyle(document.documentElement).getPropertyValue('--material-color-light-green-400');
class ChartsCreator {

    static singleFeatureConfig = {
        type: "line",
        data: undefined,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                        drag: {
                            enabled: true,
                        },
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        },
                    },
                },
            },
            legend: {
                labels: {
                    fontColor: "black",
                    fontSize: 18,
                },
            },
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color'),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-border-color'),
            // borderWidth: getComputedStyle(document.documentElement).getPropertyValue('--chart-border-width'),
            responsive: true,
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
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                        drag: {
                            enabled: true,
                        },
                    },
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    },
                },
            },
            pointRadius: 2,
            pointHoverRadius: 10,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontColor: "black",
                    fontSize: 18,
                },
            },
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

    static parseAnomalies(anomaliesData) {
        let anomalies = anomaliesData.anomalies;
        let anomaliesDict = {};
        for (let i = 0; i < anomalies.length; i++) {
            let entry = anomalies[i];
            anomaliesDict[entry.col_1 + "-" + entry.col_2] = entry.data;
        }
        return anomaliesDict;
    }

    createFeatureData(featureName, color) {
        const featureDictionary = this.features;
        return {
            label: featureName,
            backgroundColor: color,
            borderColor: color,
            data: featureDictionary[featureName],
        };
    }

    createFeaturesChart(data1, data2) {
        const data = {
            datasets: [data1, data2],
        };

        return data;
    }

    createCorrelationChart(feature1, feature2) {
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
                backgroundColor: "grey",
                label: feature1 + "-" + feature2,
                data: dataSet,
            }, ],
        };

        data.datasets[0].pointBackgroundColor = [];
        data.datasets[0].pointBorderColor = [];

        //  set all points as black
        for (let i = 0; i < f1.length; ++i) {
            data.datasets[0].pointBackgroundColor[i] = "grey";
            data.datasets[0].pointBorderColor[i] = "grey";
        }

        //  set anomalies points as red
        for (let i = 0; i < ano.length; ++i) {
            data.datasets[0].pointBackgroundColor[ano[i]] = "red";
            data.datasets[0].pointBorderColor[ano[i]] = "red";
        }
        return data;
    }
}

function getRange(begin, end) {
    let range = [];
    for (; begin < end; begin++) {
        range.push(String(begin));
    }
    return range;
}

function updateData(chart, id, data, config) {
    let labels = undefined;
    let length = data.datasets.length;
    if (length > 1) {
        let x_max = 0;
        for (let i = 0; i < length; i++) {
            x_max = Math.max(x_max, data.datasets[i].data.length);
        }
        labels = getRange(0, x_max);
    }

    if (chart instanceof Chart) {
        removeData(chart);
        addData(chart, labels, data.datasets);
    } else {

        chart = new Chart(document.getElementById(id), config);
        data['labels'] = labels;
        chart['data'] = data;
    }

    chart.update();
    chart.resize();
    chart.resetZoom()
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
    const test = await getTest(id);
    let creator = new ChartsCreator(test, anomalies);

    feature1Data = creator.createFeatureData(feature1, color1);
    feature2Data = creator.createFeatureData(feature2, color2);

    featuresDatasets = creator.createFeaturesChart(feature1Data, feature2Data);
    chartCorrelationDatasets = creator.createCorrelationChart(feature1, feature2);

    chartFeatures = updateData(chartFeatures, "chartFeatures", featuresDatasets, ChartsCreator.singleFeatureConfig);
    chartCorrelation = updateData(chartCorrelation, "chartCorrelation", chartCorrelationDatasets, ChartsCreator.doubleFeatureConfig);

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

    removeData(chartFeatures);
    // removeData(chartCol2);
    removeData(chartCorrelation);
}

//# sourceURL=ChartCreator.js