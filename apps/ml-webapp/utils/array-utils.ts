export const sliceArray = <T>(
  array: Array<T>,
  { offset = 0, limit }: { offset: number; limit?: number }
) => {
  return array.filter((_, i) =>
    i >= offset && limit ? i <= offset + limit : true
  )
}

export const divideByPages = <T>(array: Array<T>, pages: number) => {
  const dividedArray = []
  for (let i = 0; i < pages; i++) {
    dividedArray.push(sliceArray(array, { offset: i * 50, limit: 50 }))
  }
  return dividedArray
}

export const addOrRemoveFromArray = (item: string, array: Array<string>) => {
  if (array.includes(item)) {
    return array.filter((a) => a !== item)
  }
  return [...array, item]
}
