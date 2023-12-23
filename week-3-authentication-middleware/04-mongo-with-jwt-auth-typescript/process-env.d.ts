declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      MONGO_URI: string;
      AUTH_SECRET: string;
    }
  }
}
