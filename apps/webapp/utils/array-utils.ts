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

export const addOrRemoveObjectFromArray = <T, K extends keyof T>(
  item: T,
  array: Array<T>,
  key: K
) => {
  const isInArray = array.some((a) => a[key] === item[key])
  if (isInArray) {
    return array.filter((a) => a[key] !== item[key])
  }
  return [...array, item]
}

export const mergeArraysOfObjects = <T, K extends keyof T>(
  array1: Array<T>,
  array2: Array<T>,
  key: K
): Array<T> => {
  return array1.reduce((acc, item) => {
    if (array2.some((a) => a[key] === item[key])) {
      return acc
    }
    return [...acc, item]
  }, array2)
}
