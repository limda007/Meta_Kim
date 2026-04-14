import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  detectPython310,
  extractPipShowVersion,
  formatPythonLauncher,
  runPythonModule,
  meetsMinimumVersion,
  checkNetworkx,
} from "../../scripts/graphify-runtime.mjs";

describe("detectPython310()", () => {
  test("detects python when version is printed to stderr", () => {
    const python = detectPython310((command) => {
      if (command === "python3") {
        return {
          status: 0,
          stdout: "",
          stderr: "Python 3.11.7",
        };
      }
      return {
        status: 1,
        stdout: "",
        stderr: "",
        error: new Error("not found"),
      };
    }, "linux");

    assert.equal(python.command, "python3");
    assert.equal(python.version.major, 3);
    assert.equal(python.version.minor, 11);
  });

  test("prefers py -3 on Windows when available", () => {
    const calls = [];
    const python = detectPython310((command, args) => {
      calls.push([command, args]);
      if (command === "py") {
        return {
          status: 0,
          stdout: "Python 3.12.1",
          stderr: "",
        };
      }
      return {
        status: 1,
        stdout: "",
        stderr: "",
        error: new Error("not found"),
      };
    }, "win32");

    assert.equal(python.command, "py");
    assert.deepEqual(python.args, ["-3"]);
    assert.deepEqual(calls[0], ["py", ["-3", "--version"]]);
  });
});

describe("runPythonModule()", () => {
  test("reuses the same interpreter for pip installs", () => {
    const calls = [];
    runPythonModule(
      { command: "py", args: ["-3"] },
      ["-m", "pip", "install", "graphifyy"],
      (command, args, options) => {
        calls.push({ command, args, options });
        return { status: 0, stdout: "", stderr: "" };
      },
    );

    assert.deepEqual(calls[0], {
      command: "py",
      args: ["-3", "-m", "pip", "install", "graphifyy"],
      options: {
        encoding: "utf8",
        shell: false,
      },
    });
  });
});

describe("graphify helpers", () => {
  test("extractPipShowVersion reads version from pip show output", () => {
    assert.equal(
      extractPipShowVersion("Name: graphifyy\nVersion: 1.2.3\nSummary: test"),
      "1.2.3",
    );
  });

  test("formatPythonLauncher renders launcher arguments", () => {
    assert.equal(
      formatPythonLauncher({ command: "py", args: ["-3"] }),
      "py -3",
    );
  });
});

describe("meetsMinimumVersion()", () => {
  test("returns true when version meets minimum", () => {
    assert.equal(meetsMinimumVersion("3.6.1", 3, 4), true);
    assert.equal(meetsMinimumVersion("3.4.0", 3, 4), true);
    assert.equal(meetsMinimumVersion("4.0.0", 3, 4), true);
  });

  test("returns false when version is below minimum", () => {
    assert.equal(meetsMinimumVersion("3.1.0", 3, 4), false);
    assert.equal(meetsMinimumVersion("3.3.9", 3, 4), false);
    assert.equal(meetsMinimumVersion("2.9.1", 3, 4), false);
  });

  test("returns false for unparseable input", () => {
    assert.equal(meetsMinimumVersion("unknown", 3, 4), false);
    assert.equal(meetsMinimumVersion("", 3, 4), false);
  });
});

describe("checkNetworkx()", () => {
  const python = { command: "python", args: [] };

  test("detects compatible networkx", () => {
    const result = checkNetworkx(python, () => ({
      status: 0,
      stdout: "Name: networkx\nVersion: 3.6.1\nSummary: test",
      stderr: "",
    }));
    assert.equal(result.installed, true);
    assert.equal(result.version, "3.6.1");
    assert.equal(result.meets, true);
  });

  test("detects incompatible networkx", () => {
    const result = checkNetworkx(python, () => ({
      status: 0,
      stdout: "Name: networkx\nVersion: 3.1\nSummary: test",
      stderr: "",
    }));
    assert.equal(result.installed, true);
    assert.equal(result.version, "3.1");
    assert.equal(result.meets, false);
  });

  test("handles missing networkx", () => {
    const result = checkNetworkx(python, () => ({
      status: 1,
      stdout: "",
      stderr: "WARNING: Package(s) not found: networkx",
    }));
    assert.equal(result.installed, false);
    assert.equal(result.meets, false);
  });
});
