
const Hybrid = require('./HybridDetector')
const Regression = require('./RegressionDetector')
module.exports = {detect}
async function detect(type, train, test, id, threshold) {
    let detector
    if (type === 'regression')
        detector = new Regression.RegressionDetector()
    else
        detector = new Hybrid.HybridDetector()
    detector.setThreshold(threshold)
    detector.learnNormal(train)
    console.log(detector.cf)
    return detector.detect(test, id)
}
