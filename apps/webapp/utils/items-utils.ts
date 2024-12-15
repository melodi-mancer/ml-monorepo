export const getImage = (item: SeedItem) => {
  if (item.seedType === 'artist') return item?.images?.[0]?.url
  if (item.seedType === 'track') return item?.album?.images?.[0]?.url
}
export const getSubtitle = (item: SeedItem) => {
  if (item.seedType === 'artist') return item?.genres?.join(', ')
  if (item.seedType === 'track') return item?.album?.name
}
