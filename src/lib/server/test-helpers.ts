import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export function createTemporaryDataDirectory(prefix = "oubei-test-") {
  const dataDir = mkdtempSync(path.join(tmpdir(), prefix));
  return {
    dataDir,
    cleanup: () => rmSync(dataDir, { force: true, recursive: true }),
  };
}
