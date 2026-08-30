import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("runtime files are ignored and deployment template names match config", () => {
  const ignore = fs.readFileSync(".gitignore", "utf8");
  assert.match(ignore, /\.oubei-data/); assert.match(ignore, /\.env\*/); assert.match(ignore, /\.next/);
  const env = fs.readFileSync(".env.example", "utf8");
  for (const key of ["OUBEI_DATA_DIR", "SESSION_SECRET", "ADMIN_INITIAL_USERNAME", "ADMIN_INITIAL_PASSWORD", "MAX_UPLOAD_BYTES"]) assert.match(env, new RegExp(`^${key}=`, "m"));
});
