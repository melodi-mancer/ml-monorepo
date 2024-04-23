export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const cfaClient = new CfaClient(config.public.cfaApiUrl)
  return {
    provide: {
      cfa: cfaClient,
    },
  }
})
