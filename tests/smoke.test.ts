import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getRuntimeConfig } from "@/lib/server/config";

test("runtime config keeps database and media under the configured data directory", () => {
  const dataDir = path.join(process.cwd(), "tmp", "oubei-test");
  const config = getRuntimeConfig({
    OUBEI_DATA_DIR: dataDir,
    ADMIN_INITIAL_USERNAME: "admin",
    ADMIN_INITIAL_PASSWORD: "change-me-now",
    SESSION_SECRET: "a-secret-at-least-32-characters-long",
  });

  assert.equal(config.databasePath, path.join(dataDir, "site.db"));
  assert.equal(config.mediaDir, path.join(dataDir, "media"));
});
