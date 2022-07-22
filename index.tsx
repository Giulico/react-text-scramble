import React from 'react'
import ReactDOM from 'react-dom/client'

// Components
import TextScramble, { ScrambleTexts } from './src/TextScramble'

const rootElement = document.getElementById('home')

if (!rootElement) throw new Error('Failed to find the root element')

const texts: ScrambleTexts = [
  ['mi chiamo giulio', 'e sono uno sviluppatore'],
  ['secondo blocco con una frase'],
]

const root = ReactDOM.createRoot(rootElement)
root.render(<TextScramble texts={texts} letterSpeed={16} nextLetterSpeed={100} pauseTime={1500} />)
