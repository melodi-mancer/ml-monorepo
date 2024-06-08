export const isAdmin = (email: string): boolean => {
  const config = useRuntimeConfig()
  return config.public.adminEmails.includes(email)
}
