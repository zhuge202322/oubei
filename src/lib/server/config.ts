import path from "node:path";

export type RuntimeEnvironment = Record<string, string | undefined>;

export type RuntimeConfig = {
  dataDir: string;
  databasePath: string;
  mediaDir: string;
  sessionSecret: string;
  initialUsername: string;
  initialPassword: string;
  maxUploadBytes: number;
};

const DEFAULT_UPLOAD_BYTES = 10 * 1024 * 1024;

export function getRuntimeConfig(environment: RuntimeEnvironment = process.env): RuntimeConfig {
  const dataDir = path.resolve(environment.OUBEI_DATA_DIR || path.join(process.cwd(), ".oubei-data"));
  const sessionSecret = environment.SESSION_SECRET || (environment.NODE_ENV === "production" ? "" : "oubei-development-secret-change-this-value");
  const maxUploadBytes = Number(environment.MAX_UPLOAD_BYTES || DEFAULT_UPLOAD_BYTES);

  if (sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }
  if (!Number.isSafeInteger(maxUploadBytes) || maxUploadBytes <= 0) {
    throw new Error("MAX_UPLOAD_BYTES must be a positive integer.");
  }

  return {
    dataDir,
    databasePath: path.join(dataDir, "site.db"),
    mediaDir: path.join(dataDir, "media"),
    sessionSecret,
    initialUsername: environment.ADMIN_INITIAL_USERNAME?.trim() || "admin",
    initialPassword: environment.ADMIN_INITIAL_PASSWORD || "",
    maxUploadBytes,
  };
}
