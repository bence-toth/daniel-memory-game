const getRandomElementFromArray = array => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const voiceFiles = {
  positive: [
    'hurrah1', 'hurrah2', 'hurrah3', 'hurrah4', 'hurrah5', 'hurrah6', 'hurrah7',
    'super1', 'super2', 'super3', 'super4', 'super5', 'super6',
    'yay1', 'yay2', 'yay3', 'yay4'
  ],
  negative: [
    'oh-oh1', 'oh-oh2', 'oh-oh3', 'oh-oh4'
  ],
  applause: [
    'wow1', 'wow2', 'wow3', 'wow4', 'wow5',
    'woo-hoo1', 'woo-hoo2', 'woo-hoo3', 'woo-hoo4',
  ]
}

const playSound = (type = 'positive') => {
  const voiceFile = getRandomElementFromArray(voiceFiles[type])
  const audio = new Audio(`./assets/sound/${voiceFile}.mp3`)
  audio.play()
}

const configuration = {
  colors: ["#2f5755", "#54c6be", "#f7b15c", "#f65c51", "#e5243f"],
  decks: [
    ["steam-locomotive", "bulldozer", "bus", "mine-truck", "ambulance"],
    ["dimetrodon", "diplodocus", "pterodactylus", "triceratops-head", "velociraptor"],
    ["hand-saw", "spade", "3d-hammer", "drill", "spanner"],
    ["shiny-apple", "grapes", "pear", "banana", "cherry"],
    ["travel-dress", "underwear-shorts", "socks", "winter-gloves", "winter-hat"],
    ["rocket", "space-suit", "earth-africa-europe", "rainbow-star", "moon"]
  ]
}

const {colors, decks} = configuration

// Deck selection
const handleDeckSelection = selectedDeckIndex => {
  document.querySelectorAll('.card').forEach(card => {
    card.dataset.transition = "fadingOut"
  })
  setTimeout(() => {
    setupBoard(selectedDeckIndex)
  }, 815)
}

const setupDeckSelection = () => {
  const renderDeckSelector = card => `
    <button
      class="card"
      data-state="selected"
      data-deck-index="${card.index}"
    >
      <div class="front">
        <img
          src="./assets/faces/${card.face}.svg"
          draggable="false"
        />
      </div>
    </button>
  `
  const selectors = (
    decks
      .map(([firstCard]) => firstCard)
      .map((card, cardIndex) => ({
        index: cardIndex,
        face: card
      }))
  )
  const row1 = document.getElementById("row1")
  const row2 = document.getElementById("row2")
  const row3 = document.getElementById("row3")

  row1.innerHTML = selectors.slice(0, 3).map(renderDeckSelector).join('')
  row2.innerHTML = ''
  row3.innerHTML = selectors.slice(3, 6).map(renderDeckSelector).join('')
  document.querySelectorAll('.card').forEach(card => {
    const selectedDeckIndex = +(card.dataset.deckIndex)

    card.addEventListener('click', () => handleDeckSelection(selectedDeckIndex))
    card.addEventListener('contextmenu', () => handleDeckSelection(selectedDeckIndex))
    card.addEventListener('auxclick', () => handleDeckSelection(selectedDeckIndex))
  })
}

// Game
const shuffleArray = array => {
  // Fisher–Yates shuffle
  for (let iterator = array.length - 1; iterator > 0; iterator--) {
    const switchWith = Math.floor(Math.random() * (iterator + 1));

    [array[iterator], array[switchWith]] = [array[switchWith], array[iterator]]
  }
  return array
}

const handleCardClick = event => {
  event.preventDefault()

  const cardClicked = event.composedPath().find(element => (
    [...element.classList].includes("card"))
  )

  if (cardClicked.dataset.state === "hidden") {
    const selectedCards = [...document.querySelectorAll('.card[data-state="selected"]')]

    if (selectedCards.length < 2) {
      cardClicked.dataset.state = "selected"
    }
    if (selectedCards.length === 1) {
      const [selectedCard] = selectedCards

      if (selectedCard.dataset.value === cardClicked.dataset.value) {
        setTimeout(() => {
          [cardClicked, selectedCard].forEach(card => {
            card.dataset.state = "found"
            card.disabled = "disabled"
          })

          const foundCards = [...document.querySelectorAll('.card[data-state="found"]')]

          if (foundCards.length === 10) {
            setTimeout(() => {
              setupDeckSelection()
            }, 5000)
            playSound('applause')
          }
          else {
            playSound('positive')
          }
        }, 1000)
      }
      else {
        setTimeout(() => {
          playSound('negative')
        }, 1000)
        setTimeout(() => {
          [cardClicked, selectedCard].forEach(card => {
            card.dataset.state = "hidden"
          })
        }, 3000)
      }
    }
  }
}

const setupBoard = (selectedDeckIndex) => {
  const faces = decks[selectedDeckIndex]
  const renderCard = card => `
    <button
      class="card"
      data-value="${card.face}"
      data-state="hidden"
    >
      <div
        class="front"
        style="background-color: ${card.color};"
      >
        <img
          src="./assets/faces/${card.face}.svg"
          draggable="false"
        />
      </div>
      <div class="back">
        <img
          src="./assets/faces/perspective-dice-six-faces-random.svg"
          draggable="false"
        />
      </div>
    </button>
  `
  const deck = faces.map((card, cardIndex) => ({
    id: cardIndex,
    face: card,
    color: colors[cardIndex]
  }))
  const fullDeck = [...deck, ...deck]
  const shuffledDeck = shuffleArray(fullDeck)
  const row1 = document.getElementById("row1")
  const row2 = document.getElementById("row2")
  const row3 = document.getElementById("row3")

  row1.innerHTML = shuffledDeck.slice(0, 3).map(renderCard).join('')
  row2.innerHTML = shuffledDeck.slice(3, 7).map(renderCard).join('')
  row3.innerHTML = shuffledDeck.slice(7, 10).map(renderCard).join('')
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', handleCardClick)
    card.addEventListener('contextmenu', handleCardClick)
    card.addEventListener('auxclick', handleCardClick)
  })
}

setupDeckSelection()
