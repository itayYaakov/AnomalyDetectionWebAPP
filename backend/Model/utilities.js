
class Line {
    constructor(a, b) {
        this.a = a
        this.b = b
    }
    f(x) {
        return this.a * x + this.b
    }
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function avg(x) {
    var sum = 0
    for (var i=0; i<x.length; sum+=x[i], i++);
    return sum / x.length
}

function vari(x) {
    var av = avg(x)
    var sum = 0
    for(var i=0;i<x.length;i++){
        sum+=x[i]*x[i]
    }
    return sum/x.length - av*av
}

function cov(x, y){
    var sum=0, size=x.length;
    for(var i=0;i<size;i++){
        sum+=x[i]*y[i];
    }
    sum/=size;

    return sum - avg(x,size)*avg(y,size)
}

function pearson(x, y){
    return cov(x, y)/(Math.sqrt(vari(x))*Math.sqrt(vari(y)))
}

function linear_reg(points){
    var x = []
    var y = []
    for (var i = 0; i < points.length; i++) {
        x.push(points[i].x)
        y.push(points[i].y)
    }
    var a = cov(x,y)/vari(x)
    var b = avg(y) - a*(avg(x))
    return new Line(a, b)
}

function dev(p, points) {
    var l = linear_reg(points)
    return Math.abs(p.y-l.f(p.x))
}

module.exports = {
    Line, Point,
    dev, linear_reg, pearson
}





















