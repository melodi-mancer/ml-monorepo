export type AvailableLayouts = 'admin'

export const buildAppUrl = (path: string, layout?: AvailableLayouts) => {
  const pathWithoutBase = path.replace('/app', '')
  return layout ? `/app/${layout}${pathWithoutBase}` : path
}
