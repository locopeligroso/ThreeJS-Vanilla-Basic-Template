import './style.css'

import Experience from './Experience/Experience'
import Stats from 'stats.js'

/* STATS */
var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

function animate() {
    stats.begin()
    stats.end()

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

const experience = new Experience(document.querySelector('canvas.webgl'))
