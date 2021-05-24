class ChartsCreator {
    constructor(featuresJson, anomaliesJson) {
        // TODO : NEED TO CHECK IF JSON.PARSE IS NECCESARY
        this.features = JSON.parse(featuresJson);
        this.anaomalies = ChartsCreator.parseAnomalies(anomaliesJson);
        console.log("anomalies", this.anaomalies);
        console.log("features", this.features);
    }

    getRange(begin, end) {
        var range = [];
        for (; begin < end; begin++) {
            range.push(String(begin));
        }
        return range;
    }

    static parseAnomalies(anomaliesJson) {
        var anomaliesData = JSON.parse(anomaliesJson);
        var anomalies = anomaliesData.anomalies;
        var anomaliesDict = {};
        for (var i = 0; i < anomalies.length; i++) {
            var entry = anomalies[i];
            anomaliesDict[entry.col_1 + "-" + entry.col_2] = entry.data;
        }
        return anomaliesDict;
    }

    createFeaturesChart(featureName, chartId) {
        const featureDictionary = this.features;
        var ctx = document.getElementById(chartId).getContext("2d");
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

        const config = {
            type: "line",
            data: data,
            options: {
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
        console.log(config);

        return new Chart(ctx, config);
    }

    createCorolationChart(chartId, feature1, feature2) {
        var ctx = document.getElementById(chartId).getContext("2d");
        var f1 = this.features[feature1];
        var f2 = this.features[feature2];
        var ano = this.anaomalies[feature1 + "-" + feature2];

        var dataSet = [];

        for (var i = 0; i < f1.length; ++i) {
            dataSet.push({ x: f1[i], y: f2[i] });
        }

        const data = {
            datasets: [{
                label: feature1 + "-" + feature2,
                backgroundColor: "black",
                borderColor: "black",
                data: dataSet,
            }, ],
        };

        const config = {
            type: "scatter",
            data: data,
            options: {
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

        var chart = new Chart(ctx, config);
        console.log("check", chart.data.datasets);
        chart.data.datasets[0].pointBackgroundColor = [];
        chart.data.datasets[0].pointBorderColor = [];

        for (var i = 0; i < ano.length; ++i) {
            chart.data.datasets[0].pointBackgroundColor[ano[i]] = "red";
            chart.data.datasets[0].pointBorderColor[ano[i]] = "red";
        }
        chart.update();
        return chart;
    }
}


function createCharts(id, feature1, feature2) {
    // var creator = new ChartsCreator(jsonResponse3, anomalies);
    var creator = new ChartsCreator(getTrain(id), getAnomalies(id));
    var myChart = creator.createFeaturesChart(feature1, "myChart");
    var myChart2 = creator.createFeaturesChart(feature2, "myChart2");
    var myChart3 = creator.createCorolationChart("myChart3", feature1, feature2);
}

// console.log(getTrain(11581578175));
// createCharts(54654, "A", "B");