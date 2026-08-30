import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import { ensureAdminUser, createSession } from "@/lib/server/auth";
import { requireAdmin } from "@/lib/server/admin-api";
import { POST as login } from "@/app/api/admin/auth/login/route";
import { createTemporaryDataDirectory } from "@/lib/server/test-helpers";

test("requireAdmin rejects requests without a valid session", async () => {
  const db = new Database(":memory:");
  migrateDatabase(db);
  await assert.rejects(() => requireAdmin(new Request("http://localhost/api/admin/products"), db), (error: unknown) => {
    return error instanceof Error && error.name === "AdminAuthError" && (error as Error & { status: number }).status === 401;
  });
  db.close();
});

test("requireAdmin returns the administrator for a valid session", async () => {
  const db = new Database(":memory:");
  migrateDatabase(db);
  const user = await ensureAdminUser(db, { username: "admin", password: "initial-password" });
  const token = createSession(db, user.id);
  const context = await requireAdmin(new Request("http://localhost/api/admin/products", { headers: { cookie: `oubei_admin_session=${token}` } }), db);
  assert.equal(context.user.username, "admin");
  db.close();
});

test("login route sets an HttpOnly session cookie for valid initial credentials", async () => {
  const temporary = createTemporaryDataDirectory("oubei-login-");
  const previous = {
    dataDir: process.env.OUBEI_DATA_DIR,
    username: process.env.ADMIN_INITIAL_USERNAME,
    password: process.env.ADMIN_INITIAL_PASSWORD,
    secret: process.env.SESSION_SECRET,
  };
  process.env.OUBEI_DATA_DIR = temporary.dataDir;
  process.env.ADMIN_INITIAL_USERNAME = "admin";
  process.env.ADMIN_INITIAL_PASSWORD = "initial-password";
  process.env.SESSION_SECRET = "test-session-secret-that-is-at-least-32-chars";
  try {
    const response = await login(new Request("http://localhost/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "initial-password" }),
    }));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("set-cookie") || "", /oubei_admin_session=.*HttpOnly/);
  } finally {
    process.env.OUBEI_DATA_DIR = previous.dataDir;
    process.env.ADMIN_INITIAL_USERNAME = previous.username;
    process.env.ADMIN_INITIAL_PASSWORD = previous.password;
    process.env.SESSION_SECRET = previous.secret;
    temporary.cleanup();
  }
});
