
const Hybrid = require('./HybridDetector')
const Regression = require('./RegressionDetector')
module.exports = {detect}
async function detect(type, train, test, time) {
    let detector
    if (type === 'regression')
        detector = new Regression.RegressionDetector()
    else
        detector = new Hybrid.HybridDetector()
    detector.learnNormal(train)
    return detector.detect(test, time)
}
