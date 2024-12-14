export const getImage = (item: SearchItem) => {
  if (item.itemType === 'artist') return item?.images?.[0]?.url
  if (item.itemType === 'track') return item?.album?.images?.[0]?.url
}
export const getSubtitle = (item: SearchItem) => {
  if (item.itemType === 'artist') return item?.genres?.join(', ')
  if (item.itemType === 'track') return item?.album?.name
}
