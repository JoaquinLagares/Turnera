import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { envSchema } from "../dist/config/env.schema.js";

const valid = {
  FRONTEND_URL: "http://localhost:5173",
  DATABASE_URL: "postgresql://turnera:password@localhost:5432/turnera",
};

test("uses development defaults and parses the port as a number", () => {
  const parsed = envSchema.parse(valid);
  assert.equal(parsed.NODE_ENV, "development");
  assert.equal(parsed.PORT, 3000);
  assert.equal(envSchema.parse({ ...valid, PORT: "8080" }).PORT, 8080);
});

test("rejects missing configuration, invalid ports and unsupported environments", () => {
  for (const input of [
    {},
    { ...valid, PORT: "" },
    { ...valid, PORT: "0" },
    { ...valid, PORT: "65536" },
    { ...valid, PORT: "3000.5" },
    { ...valid, NODE_ENV: "" },
    { ...valid, NODE_ENV: "staging" },
    { ...valid, DATABASE_URL: "not-a-url" },
    { ...valid, DATABASE_URL: "https://example.com/database" },
    { ...valid, DATABASE_URL: "postgresql://localhost" },
  ]) {
    assert.equal(envSchema.safeParse(input).success, false);
  }
});

test("requires an exact HTTP(S) origin for CORS", () => {
  for (const FRONTEND_URL of [
    "*", "ftp://example.com", "https://example.com/", "https://example.com/path",
    "https://example.com?query=1", "https://user:password@example.com",
  ]) {
    assert.equal(envSchema.safeParse({ ...valid, FRONTEND_URL }).success, false);
  }
  assert.equal(envSchema.safeParse({ ...valid, FRONTEND_URL: "https://example.com" }).success, true);
});

test("compiled server rejects invalid configuration without exposing credentials", () => {
  const result = spawnSync(process.execPath, ["dist/server.js"], {
    cwd: new URL("../", import.meta.url),
    env: {
      ...process.env,
      ...valid,
      DATABASE_URL: "https://user:private-audit-secret@example.com/database",
      NODE_ENV: "test",
    },
    encoding: "utf8",
    timeout: 10000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid environment configuration: DATABASE_URL/);
  assert.doesNotMatch(result.stdout + result.stderr, /private-audit-secret/);
  assert.doesNotMatch(result.stdout, /Server running/);
});
