declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
      GOOGLE_PROJECT_ID: string;
      STRIPE_SECRET_KEY: string;
      [key: string]: string | undefined;
    }
  }
}

export {}; 