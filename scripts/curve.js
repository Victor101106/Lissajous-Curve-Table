class Curve {
    
    constructor(length = 200) {
        this.points = new Array()
        this.length = length
    }

    add(x, y) {
        this.points.unshift(new Point(x, y))
        if (this.points.length == this.length) {
            this.points.pop()
        }
    }

}