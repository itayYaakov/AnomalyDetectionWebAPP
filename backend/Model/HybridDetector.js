const makeCircle = require('./MinimumCircle.js').makeCircle;
const distance = require('./MinimumCircle.js').distance;
const reg = require('./RegressionDetector');

class HybridDetector extends reg.RegressionDetector {
    constructor() {
        super();
        this.threshold = 0.5;
    }

    isAnomaly(x, y, c) {
        return (c.correlation >= 0.9 && super.isAnomaly(x, y, c)) ||
            (c.correlation < 0.9 && c.correlation > 0.5 &&
                (distance(x, y, c.circle.x, c.circle.y) > c.circle.r))
    }

    learnNormal(json) {
        super.learnNormal(json);
        for (var c of this.cf) {
            if (c.correlation > this.threshold && c.correlation < 0.9) {
                c.circle = makeCircle(super.makePoints(json, c.feature1, c.feature2));
                c.circle.r *= 1.1;
            }
        }
    }
}

module.exports = { HybridDetector };