function asText(errorLike) {
  if (typeof errorLike === "string") {
    return errorLike;
  }
  if (errorLike && typeof errorLike === "object") {
    return [errorLike.message, errorLike.stderr, errorLike.stdout]
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

export function classifyGitInstallFailure(errorLike) {
  const text = asText(errorLike).toLowerCase();

  if (
    text.includes("schannel: failed to receive handshake") ||
    text.includes("schannel") ||
    text.includes("ssl/tls connection failed") ||
    text.includes("gnutls_handshake() failed") ||
    text.includes("server certificate verification failed") ||
    text.includes("ssl certificate problem") ||
    text.includes("tlsv1 alert") ||
    text.includes("tls connect error") ||
    text.includes("unexpected eof while reading") ||
    text.includes("ssl_read") ||
    text.includes("ssl_connect") ||
    text.includes("ssl_error_syscall") ||
    text.includes("openssl/ssl")
  ) {
    return "tls_transport";
  }

  // Partial clone / retry: non-empty destination (common when a flaky run leaves a half-done dir)
  if (
    text.includes("already exists") &&
    (text.includes("destination path") ||
      text.includes("not an empty directory") ||
      text.includes("already exists and is not an empty directory"))
  ) {
    return "proxy_network";
  }

  if (
    text.includes("index-pack failed") ||
    text.includes("invalid index-pack") ||
    text.includes("error: file write error") ||
    text.includes("pack-objects died")
  ) {
    return "proxy_network";
  }

  if (text.includes("repository") && text.includes("not found")) {
    return "repo_not_found";
  }

  if (
    text.includes("authentication failed") ||
    text.includes("could not read username")
  ) {
    return "auth_required";
  }

  if (text.includes("sparse checkout path missing")) {
    return "subdir_missing";
  }

  if (
    text.includes("failed to connect to") ||
    text.includes("could not connect to server") ||
    text.includes("recv failure: connection was reset") ||
    text.includes("connection reset by peer") ||
    text.includes("connection refused") ||
    text.includes("connection timed out") ||
    text.includes("network is unreachable") ||
    text.includes("no route to host")
  ) {
    return "proxy_network";
  }

  if (
    text.includes("permission denied") ||
    text.includes("access denied") ||
    text.includes("operation not permitted") ||
    text.includes("eacces") ||
    text.includes("eperm")
  ) {
    return "permission_denied";
  }

  if (
    text.includes("command not found") ||
    text.includes("is not recognized as") ||
    text.includes("no such file or directory") ||
    text.includes("enoent") ||
    text.includes("not installed") ||
    (text.includes("python") && text.includes("not found"))
  ) {
    return "missing_runtime";
  }

  // Broader network / connectivity patterns (lower priority, catch remaining)
  if (
    text.includes("unable to access") ||
    text.includes("rpc failed") ||
    text.includes("remote end hung up") ||
    text.includes("early eof") ||
    text.includes("failed to resolve") ||
    text.includes("name resolution") ||
    text.includes("curl 56") ||
    text.includes("curl 92") ||
    text.includes("curl 28") ||
    text.includes("errno 10054") ||
    text.includes("errno 10053") ||
    text.includes("broken pipe") ||
    text.includes("connection was aborted") ||
    text.includes("http/2 stream") ||
    text.includes("http error")
  ) {
    return "proxy_network";
  }

  return "unknown";
}

export function shouldUseArchiveFallback(category) {
  return category === "tls_transport" || category === "proxy_network";
}

/**
 * Last-resort: git stderr was empty or did not match patterns, but clone likely hit transport flakiness.
 * Only used with HTTPS github.com remotes in handleGitFailure.
 */
export function shouldUseArchiveFallbackForUnknownClone(
  repoUrl,
  failureText,
) {
  if (!/^https:\/\/github\.com\//i.test(String(repoUrl || "").trim())) {
    return false;
  }
  const text = (failureText || "").trim().toLowerCase();
  if (!text) {
    return true;
  }
  if (
    text.includes("repository") &&
    (text.includes("not found") || text.includes("404"))
  ) {
    return false;
  }
  if (
    text.includes("authentication failed") ||
    text.includes("could not read username")
  ) {
    return false;
  }
  if (text.includes("permission denied") && text.includes("could not create")) {
    return false;
  }
  return true;
}

export function parseGitHubRepoUrl(repoUrl) {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i.exec(
    repoUrl.trim(),
  );
  if (!match) {
    return null;
  }
  return {
    owner: match[1],
    repo: match[2],
  };
}

export function buildGitHubTarballUrl(repoUrl) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    return null;
  }
  return `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/tarball`;
}
