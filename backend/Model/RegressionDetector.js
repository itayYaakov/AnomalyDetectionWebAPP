
const util = require('./utilities.js')

class CorrelatedFeatures {
    constructor() {
        this.feature1 = null
        this.feature2 = null
        this.correlation = null
        this.line = null
        this.threshold = null
        this.circle = null
    }
}

class RegressionDetector{
    constructor() {
        this.cf = []
        this.threshold = 0.9
    }

    getNormalData() {
        return this.cf
    }

    setThreshold(n) {
        this.threshold = n
    }

    getCorrelatedFeature(f1) {
        this.cf.forEach((c) => {
            if (c.feature1 == f1)
                return c.feature2
        })
        return null
    }

    makePoints(json, f1, f2) {
        var x = json[f1]
        var y = json[f2]
        var points = []
        for(var i = 0 ; i < x.length; i++)
            points.push(new util.Point(x[i], y[i]))
        return points
    }

    isAnomaly(x, y, c) {
        return (Math.abs(y - c.line.f(x)) > c.threshold)
    }

    findThreshold(l, points) {
        var max = 0
        points.forEach((p) => {
            var d = util.dev(p, points)
            if (d > max) max = d
        })
        return max
    }

    findStandard(f1, f2, correlation, json){
        var c = new CorrelatedFeatures()
        c.feature1 = f1
        c.feature2 = f2
        c.correlation = correlation
        if (f2 !== null) {
            var points = this.makePoints(json, f1 ,f2)
            if (c.correlation >= this.threshold) {
                c.line = util.linear_reg(points)
                c.threshold = this.findThreshold(c.line, points) * 1.1
            }
        }
        this.cf.push(c)
    }

    learnNormal(json) {
        var attributes = Object.keys(json)
        for (var i = 0; i < attributes.length; i++) {
            var f1 = attributes[i]
            var f2 = null
            var max = -1
            for (var j = 0; j < attributes.length; j++){
                if (j === i) continue
                var p = util.pearson(json[f1], json[attributes[j]])
                if (p > max && p >= this.threshold) {
                    f2 = attributes[j]
                    max = p
                }
            }
            this.findStandard(f1, f2, max, json)
        }
    }



    detect(json, id) {
        var anomalies = []
        for (var c of this.cf) {
            if (c.feature2 === null) continue
            var cf = {
                'col_1' : c.feature1,
                'col_2' : c.feature2,
                'data' : []
            }
            for (var i = 0; i < json[Object.keys(json)[0]].length; i++) {
                var xs = json[c.feature1]
                var ys = json[c.feature2]
                if(this.isAnomaly(xs[i], ys[i], c)) {
                    cf.data.push(i)
                }
            }
            anomalies.push(cf)
        }
        return { 'id' : id, 'anomalies' : anomalies }
    }

}


module.exports = {RegressionDetector}