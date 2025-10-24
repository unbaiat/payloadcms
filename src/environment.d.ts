declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      NEXT_PUBLIC_SERVER_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      CLOUDFLARE_ENV?: string
      CRON_SECRET?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
