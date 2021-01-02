const shouldUseHttpRemote = require("./shouldUseHttpRemote");

const fs = require("fs");
const { when } = require("jest-when");

beforeEach(function () {
  jest.restoreAllMocks();
});

it("should default to false", async function () {
  // None of the files exist, use the default
  mockFiles([]);
  return expect(await shouldUseHttpRemote()).toBe(false);
});

describe(".netrc", function () {
  it("correct string", async function () {
    mockFiles([".netrc"]);
    return expect(await shouldUseHttpRemote()).toBe(true);
  });

  it("incorrect string", async function () {
    mockFiles([".netrc"], "example.com");
    return expect(await shouldUseHttpRemote()).toBe(false);
  });
});

describe(".git-credentials", function () {
  it("correct string", async function () {
    mockFiles([".git-credentials"]);
    return expect(await shouldUseHttpRemote()).toBe(true);
  });

  it("incorrect string", async function () {
    mockFiles([".git-credentials"], "example.com");
    return expect(await shouldUseHttpRemote()).toBe(false);
  });
});

const homeDir = require("os").homedir();
function mockFiles(files, host) {
  host = host || "github.com";
  const fileContents = {
    ".netrc": `machine ${host}
login exampleuser
password SECRET`,
    ".git-credentials": `https://api:SECRET@${host}/myorganization/ `,
  };

  for (let file in fileContents) {
    filename = homeDir + "/" + file;
    if (files.includes(file)) {
      mockFile(filename, fileContents[file]);
      continue;
    }
    mockFile(filename);
  }
}

function mockFile(filename, contents) {
  const exists = contents !== undefined;
  jest.spyOn(fs, "existsSync");
  when(fs.existsSync).expectCalledWith(filename).mockReturnValueOnce(exists);
  if (exists) {
    jest.spyOn(fs, "readFileSync");
    when(fs.readFileSync)
      .expectCalledWith(filename)
      .mockReturnValueOnce(contents);
  }
}
