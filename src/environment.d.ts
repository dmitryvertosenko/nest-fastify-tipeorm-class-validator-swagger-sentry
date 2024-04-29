declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // General
      PORT: string;

      // Auth
      API_KEY: string;

      // Postgres
      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
