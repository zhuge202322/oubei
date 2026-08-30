import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import {
  createSession,
  ensureAdminUser,
  getSessionUser,
  hashPassword,
  revokeAllSessions,
  revokeSession,
  verifyPassword,
} from "@/lib/server/auth";

function createDatabase() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  migrateDatabase(db);
  return db;
}

test("password hashes verify correctly without storing plaintext", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.notEqual(hash, "correct horse battery staple");
  assert.equal(await verifyPassword("correct horse battery staple", hash), true);
  assert.equal(await verifyPassword("wrong password", hash), false);
});

test("session tokens resolve users and can be revoked", async () => {
  const db = createDatabase();
  const user = await ensureAdminUser(db, { username: "admin", password: "initial-password" });
  const token = createSession(db, user.id, { now: new Date("2026-08-30T00:00:00.000Z"), ttlMs: 60_000 });
  const request = new Request("http://localhost/admin", { headers: { cookie: `oubei_admin_session=${token}` } });

  assert.equal(getSessionUser(request, db, new Date("2026-08-30T00:00:30.000Z"))?.username, "admin");
  revokeSession(db, token);
  assert.equal(getSessionUser(request, db, new Date("2026-08-30T00:00:30.000Z")), null);
  db.close();
});

test("revoking all sessions invalidates every token for the administrator", async () => {
  const db = createDatabase();
  const user = await ensureAdminUser(db, { username: "admin", password: "initial-password" });
  const first = createSession(db, user.id);
  const second = createSession(db, user.id);
  revokeAllSessions(db, user.id);
  assert.equal((db.prepare("select count(*) as count from admin_sessions where revoked_at is not null").get() as { count: number }).count, 2);
  assert.equal(getSessionUser(new Request("http://localhost", { headers: { cookie: `oubei_admin_session=${first}` } }), db), null);
  assert.equal(getSessionUser(new Request("http://localhost", { headers: { cookie: `oubei_admin_session=${second}` } }), db), null);
  db.close();
});
