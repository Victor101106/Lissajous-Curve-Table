import { Curve } from './curve.js'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const curves = new Array()
const highRadius = 30
const lowRadius = 5
const padding = 20

let columns = 0
let rows = 0

let angle = 0
let x = 0
let y = 0

function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height)    

    for (let column = 0; column < columns; column++) {
        
        context.beginPath()
        context.strokeStyle = '#000'
        context.lineWidth = 1.0
        context.arc(x + 2 * highRadius * (column + 1) + padding * (column + 1), y, highRadius, 0, 2 * Math.PI)
        context.stroke()
        context.closePath()
        
        context.beginPath()
        context.fillStyle = '#000'
        context.arc(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), y + highRadius * Math.sin(angle * (column + 1)), lowRadius, 0, 2 * Math.PI)
        context.fill()
        context.closePath()

        context.beginPath()
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
        context.moveTo(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 0)
        context.lineTo(x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), canvas.height)
        context.stroke()
        context.closePath()

    }

    for (let row = 0; row < rows; row++) {
        
        context.beginPath()
        context.strokeStyle = '#000'
        context.lineWidth = 1.0
        context.arc(x, y + 2 * highRadius * (row + 1) + padding * (row + 1), highRadius, 0, 2 * Math.PI)
        context.stroke()
        context.closePath()
        
        context.beginPath()
        context.fillStyle = '#000'
        context.arc(x + highRadius * Math.cos(angle * (row + 1)), y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius, 0, 2 * Math.PI)
        context.fill()
        context.closePath()
        
        context.beginPath()
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
        context.moveTo(0, y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)))
        context.lineTo(canvas.width, y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)))
        context.stroke()
        context.closePath()

    }

    for (let column = 0; column < columns; column++) {

        for (let row = 0; row < rows; row++) {

            const curve = curves[column][row]
            curve.add(
                2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 
                2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius, 0, 2 * Math.PI
            )

            context.beginPath()
            context.fillStyle = '#000'
            context.arc(
                x + 2 * highRadius * (column + 1) + padding * (column + 1) + highRadius * Math.cos(angle * (column + 1)), 
                y + 2 * highRadius * (row + 1) + padding * (row + 1) + highRadius * Math.sin(angle * (row + 1)), lowRadius, 0, 2 * Math.PI
            )
            context.fill()
            context.closePath()

            context.beginPath()
            context.strokeStyle = '#000'
            context.lineWidth = 1
            context.moveTo(x + curve.points[0].x, y + curve.points[0].y)
            
            for (let point of curve.points) {
                context.lineTo(point.x + x, point.y + y)
                context.moveTo(point.x + x, point.y + y)
            }

            context.stroke()
            context.closePath()

        }

    }

    angle = angle + 0.025
    requestAnimationFrame(draw)


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