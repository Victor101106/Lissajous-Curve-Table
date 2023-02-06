import { Curve } from './curve.js'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const curves = new Array()
const increment = 0.025
const highRadius = 30
const lowRadius = 5
const padding = 20

let columns = 0
let rows = 0

let angle = 0
let x = 0
let y = 0

function draw() {

    context.beginPath()
    context.fillStyle = '#090E1A'
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = '#2F364F'
    context.globalAlpha = 0.25
    context.roundRect(x + highRadius + padding / 2, y - highRadius - padding / 2, (2 * highRadius + padding) * columns, 2 * highRadius + padding, 10)
    context.fill()
    context.globalAlpha = 1.00
    context.closePath()
    
    context.beginPath()
    context.fillStyle = '#274B4C'
    context.globalAlpha = 0.25
    context.roundRect(x - highRadius - padding / 2, y + highRadius + padding / 2, 2 * highRadius + padding, (2 * highRadius + padding) * rows, 10)
    context.fill()
    context.globalAlpha = 1.00
    context.closePath()

    let max1 = columns > rows ? columns : rows
    let max2 = columns < rows ? columns : rows

    for (let index = 0; index < max1; index++) {
        
        if (max1 == columns) {
            drawColumn(index)
        } else {
            drawRows(index)
        }

        if (index < max2) {
            if (max2 == rows) {
                drawRows(index)
            } else {
                drawColumn(index)
            }
        }

    }

    angle += increment
    requestAnimationFrame(draw)


}

function drawColumn(column) {

    context.beginPath()
    context.strokeStyle = '#fff'
    context.lineWidth = 1.0
    context.arc(x + 2 * highRadius * (column + 1) + padding * (column + 1), y, highRadius, 0, 2 * Math.PI)
    context.stroke()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = '#fff'
    context.arc(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), y + highRadius * Math.sin(angle * (column + 1)), lowRadius, 0, 2 * Math.PI)
    context.fill()
    context.closePath()

    context.beginPath()
    context.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    context.moveTo(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 0)
    context.lineTo(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), canvas.height)
    context.stroke()
    context.closePath()

    for (let row = 0; row < rows; row++) {

        const curve = curves[column][row]
        curve.add(
            2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 
            2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius, 0, 2 * Math.PI
        )

        context.beginPath()
        context.fillStyle = '#fff'
        context.arc(
            x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 
            y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius / 1.5, 0, 2 * Math.PI
        )
        context.fill()
        context.closePath()
        
        context.beginPath()
        context.strokeStyle = '#fff'
        context.globalAlpha = 0.50
        context.lineWidth = 1
        context.moveTo(x + curve.points[0].x, y + curve.points[0].y)
        
        for (let point of curve.points) {
            context.lineTo(point.x + x, point.y + y)
            context.moveTo(point.x + x, point.y + y)
        }

        context.stroke()
        context.globalAlpha = 1.00
        context.closePath()

    }

}

function drawRows(row) {

    context.beginPath()
    context.strokeStyle = '#fff'
    context.lineWidth = 1.0
    context.arc(x, y + 2 * highRadius * (row + 1) + padding * (row + 1), highRadius, 0, 2 * Math.PI)
    context.stroke()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = '#fff'
    context.arc(x + highRadius * Math.cos(angle * (row + 1)), y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius, 0, 2 * Math.PI)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    context.moveTo(0, y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)))
    context.lineTo(canvas.width, y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)))
    context.stroke()
    context.closePath()

}

function calculate() {
    columns = Math.floor(window.innerWidth / (2 * highRadius + padding)) - 1
    rows = Math.floor(window.innerHeight / (2 * highRadius + padding)) - 1
}

function toCenter() {
    y = highRadius + window.innerHeight / 2 - ((rows + 1) * (2 * highRadius + padding) - padding) / 2
    x = highRadius + window.innerWidth / 2 - ((columns + 1) * (2 * highRadius + padding) - padding) / 2
}

function adjust() {
    canvas.style.height = window.innerHeight
    canvas.style.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
}

function resize() {

    curves.length = columns
    
    for (let column = 0; column < columns; column++) {
        if (!curves[column]) {
            curves[column] = new Array(rows)
        }
        curves[column].length = rows
        for (let row = 0; row < rows; row++) {
            if (!curves[column][row]) {
                curves[column][row] = new Curve(300)
            }
        }
    }

}

window.onresize = () => {
    adjust()
    calculate()
    toCenter()
    resize()
}

window.onload = () => {
    window.onresize()
    draw()
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }