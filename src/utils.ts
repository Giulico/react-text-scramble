export const randomItem = (array: Array<string>): string =>
  array[Math.floor(Math.random() * array.length)]

export const nextItem = (array: string[][], currentItem: string[]): string[] => {
  const currentIndex = array.indexOf(currentItem)
  const bound = array.length
  const nextIndex = (currentIndex + bound + 1) % bound
  return array[nextIndex]
}
