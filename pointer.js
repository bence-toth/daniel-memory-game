const setupPointer = () => {
  const body = document.body

  body.classList.add('customCursor')

  window.addEventListener('contextmenu', event => {
    event.preventDefault()
  })

  const pointerImage = document.querySelector('#pointer > img')

  window.addEventListener('mousemove', () => {
    pointerImage.classList.remove('hidden')
  }, {once: true})

  const pointer = document.getElementById('pointer')
  const pointerMaxRotation = 25 // in degrees
  const pointingHandPointerOffset = { // in pixels
    x: 70,
    y: 15
  }

  pointer.style.transformOrigin = `
    ${pointingHandPointerOffset.x}px
    ${pointingHandPointerOffset.y}px
  `

  window.addEventListener('mousemove', event => {
    const viewportWidth = window.innerWidth
    const {clientX: x, clientY: y} = event
    const xFromCenter = ((x / viewportWidth) * 2) - 1 // within [-1, 1]
    const translateX = `${x - pointingHandPointerOffset.x}px`
    const translateY = `${y - pointingHandPointerOffset.y}px`
    const rotation = `${xFromCenter * pointerMaxRotation}deg`
    const vmin = Math.min(window.innerWidth, window.innerHeight)
    const scaleFactor = vmin / 1440

    pointer.style.transform = `
      translate(${translateX}, ${translateY})
      rotate(${rotation})
      scale(${scaleFactor.toFixed(4)})
    `
  })

  window.addEventListener('mousedown', () => {
    pointerImage.src = "./assets/tapping-hand.webp"
  })

  window.addEventListener('mouseup', () => {
    pointerImage.src = "./assets/pointing-hand.webp"
  })
}

if (!('ontouchstart' in window)) {
  setupPointer()
}
