const { spawn } = require("child_process");
const path = require("path");

async function extractEpubInfo(epubBuffer) {
  try {
    const pythonScriptPath = path.join(__dirname, "/python/epub.py");
    const encodedContent = epubBuffer.toString("base64");

    const pythonProcess = spawn("python3", [pythonScriptPath]);
    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("error", (err) => {
      throw new Error(`Error spawning Python process: ${err.message}`);
    });

    await new Promise((resolve) => {
      pythonProcess.on("close", (code) => {
        // if (code !== 0) {
        //   throw new Error(`Python script exited with code ${code}: ${error}`);
        // }
        resolve();
      });
    });

    const parsedResult = result;
    if (parsedResult.image) {
      parsedResult.image = Buffer.from(parsedResult.image, "latin1");
    }

    return parsedResult;
  } catch (e) {
    console.error("Error:", e.message);
    throw e;
  }
}

// Example usage:
module.exports = extractEpubInfo;
