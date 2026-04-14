import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  classifyGitInstallFailure,
  parseGitHubRepoUrl,
  shouldUseArchiveFallback,
  shouldUseArchiveFallbackForUnknownClone,
} from "../../scripts/install-error-classifier.mjs";

describe("install error classifier", () => {
  test("classifies schannel/TLS clone failures", () => {
    const category = classifyGitInstallFailure(`
fatal: unable to access 'https://github.com/OthmanAdi/planning-with-files.git/':
schannel: failed to receive handshake, SSL/TLS connection failed
    `);
    assert.equal(category, "tls_transport");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies missing repositories without archive fallback", () => {
    const category = classifyGitInstallFailure(`
fatal: repository 'https://github.com/example/missing-repo.git/' not found
    `);
    assert.equal(category, "repo_not_found");
    assert.equal(shouldUseArchiveFallback(category), false);
  });

  test("parses GitHub repo URLs from clone remotes", () => {
    assert.deepEqual(parseGitHubRepoUrl("https://github.com/owner/repo.git"), {
      owner: "owner",
      repo: "repo",
    });
    assert.deepEqual(parseGitHubRepoUrl("https://github.com/owner/repo"), {
      owner: "owner",
      repo: "repo",
    });
    assert.equal(parseGitHubRepoUrl("https://gitlab.com/owner/repo.git"), null);
  });

  test("classifies permission denied errors", () => {
    const category = classifyGitInstallFailure(`
fatal: could not create work tree dir 'planning-with-files': Permission denied
    `);
    assert.equal(category, "permission_denied");
    assert.equal(shouldUseArchiveFallback(category), false);
  });

  test("classifies missing runtime errors", () => {
    const category = classifyGitInstallFailure(`
bash: git: command not found
    `);
    assert.equal(category, "missing_runtime");
    assert.equal(shouldUseArchiveFallback(category), false);
  });

  test("classifies unknown errors for unrecognizable failures", () => {
    const category = classifyGitInstallFailure(
      "something completely unexpected happened",
    );
    assert.equal(category, "unknown");
    assert.equal(shouldUseArchiveFallback(category), false);
  });

  test("classifies proxy/network connection failures", () => {
    const category = classifyGitInstallFailure(`
fatal: unable to access 'https://github.com/KimYx0207/agent-teams-playbook.git/':
Failed to connect to 127.0.0.1 port 15236 after 21076 ms: Could not connect to server
    `);
    assert.equal(category, "proxy_network");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies connection refused errors", () => {
    const category = classifyGitInstallFailure(
      "fatal: unable to access: Connection refused",
    );
    assert.equal(category, "proxy_network");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies OpenSSL TLS unexpected eof", () => {
    const category = classifyGitInstallFailure(
      "fatal: unable to access 'https://github.com/affaan-m/everything-claude-code.git/': TLS connect error: error:0A000126:SSL routines::unexpected eof while reading",
    );
    assert.equal(category, "tls_transport");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies connection reset as proxy/network and allows archive fallback", () => {
    const category = classifyGitInstallFailure(
      "fatal: unable to access 'https://github.com/OthmanAdi/planning-with-files.git/': Recv failure: Connection was reset",
    );
    assert.equal(category, "proxy_network");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies partial clone retry collision (destination not empty) as proxy_network", () => {
    const category = classifyGitInstallFailure(`
fatal: destination path 'C:/Temp/meta-kim-staging-abc/findskill' already exists and is not an empty directory.
    `);
    assert.equal(category, "proxy_network");
    assert.equal(shouldUseArchiveFallback(category), true);
  });

  test("classifies bare schannel line as tls_transport", () => {
    const category = classifyGitInstallFailure(
      "schannel: next InitializeSecurityContext failed",
    );
    assert.equal(category, "tls_transport");
  });

  test("unknown clone on GitHub may use archive fallback when stderr is empty", () => {
    assert.equal(
      shouldUseArchiveFallbackForUnknownClone(
        "https://github.com/KimYx0207/findskill.git",
        "",
      ),
      true,
    );
    assert.equal(
      shouldUseArchiveFallbackForUnknownClone(
        "https://github.com/KimYx0207/findskill.git",
        "fatal: repository 'https://github.com/x/y.git/' not found",
      ),
      false,
    );
  });
});
