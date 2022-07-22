import { useState, useEffect, useRef, useCallback } from 'react'
import { setInterval, setTimeout, clearInterval, clearTimeout } from 'requestanimationframe-timer'

import { TextScrambleProps } from './types'
import { randomItem, nextItem } from './utils'

const symbols: string[] = '!<>-_\\/[]{}—=+*^?#'.split('')

function TextScramble({
  texts,
  className,
  letterSpeed = 5,
  nextLetterSpeed = 100,
  paused = false,
  pauseTime = 1500,
  dudClassName = 'dud',
  lineClassName = 'text-scramble-line',
  parallel = true,
  lineDelay = 0,
}: TextScrambleProps) {
  const [currentText, setCurrentText] = useState<string>(texts[0])
  const bakeLetterInterval = useRef()
  const bakeTextInterval = useRef()

  const initSymbols: string[] = Array(currentText.length)
    .fill(0)
    .map(() => randomItem(symbols))

  const [displayedText, setDisplayedText] = useState<string[]>(initSymbols)

  const leftIndexes: number[][] = []

  const setDefaultLeftIndexes = useCallback<void>(() => {
    for (let index = 0; index < currentText.length; index++) {
      const line = currentText[index]
      line.split('').forEach((char: string, i: number) => {
        if (i === 0) {
          leftIndexes[index] = []
        }
        leftIndexes[index].push(i)
      })
    }
  }, [currentText, leftIndexes])

  const bakeLetter = useCallback<void>(() => {
    bakeLetterInterval.current = setInterval(() => {
      if (!paused) {
        const updatedText: string[][] = []

        for (let index = 0; index < currentText.length; index++) {
          const line = currentText[index]
          const lineLeftIndexes = leftIndexes[index] || []
          const lineUpdatedText = updatedText[index] || []

          line.split('').forEach((char: string, i: number) => {
            if (!lineLeftIndexes.includes(i)) {
              lineUpdatedText[i] = line[i]
              return
            }

            lineUpdatedText[i] = (
              <span key={i} className={dudClassName}>
                {randomItem(symbols)}
              </span>
            )
          })

          updatedText[index] = lineUpdatedText
        }

        // Wrap lines
        for (let index = 0; index < updatedText.length; index++) {
          const line = (
            <p key={index} className={lineClassName}>
              {updatedText[index]}
            </p>
          )
          updatedText[index] = line
        }

        setDisplayedText(updatedText)
      }
    }, letterSpeed)
  }, [paused, currentText, letterSpeed, leftIndexes])

  const bakeText = useCallback(() => {
    setDefaultLeftIndexes()
    bakeLetter()

    bakeTextInterval.current = setInterval(() => {
      if (!paused) {
        const leftIndexesLength = leftIndexes.reduce((prev, curr) => prev + curr.length, 0)

        if (leftIndexesLength === 0) {
          clearInterval(bakeLetterInterval.current)
          clearInterval(bakeTextInterval.current)

          setTimeout(() => {
            setCurrentText(nextItem(texts, currentText))
            setDefaultLeftIndexes()
          }, pauseTime)
        }

        if (parallel) {
          for (let index = 0; index < leftIndexes.length; index++) {
            const indexes = leftIndexes[index]
            setTimeout(() => {
              indexes.shift()
            }, lineDelay * index)
          }
        } else {
          // Sequential mode
          const currentIndex = leftIndexes.findIndex(indexes => indexes.length > 0)
          if (currentIndex > -1) {
            leftIndexes[currentIndex].shift()
          }
        }
      }
    }, nextLetterSpeed)
  }, [currentText, texts, paused, pauseTime, leftIndexes])

  useEffect(() => {
    if (!paused) {
      bakeText()
    }
  }, [currentText, paused])

  return <div className={className}>{displayedText}</div>
}

export default TextScramble
