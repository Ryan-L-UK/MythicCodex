const fs = require("fs");
const path = require("path");

const folderPath = "Outputs/monster";

function processJSONFile(filePath, modesMap) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const jsonObject = JSON.parse(jsonData);

    // Process _copy object
    const copyObject = jsonObject._copy;
    processModes(copyObject, modesMap);

    // Process actions
    const actions = jsonObject.action;
    if (Array.isArray(actions)) {
      actions.forEach((action) => {
        processModes(action, modesMap);
      });
    } else if (typeof actions === "object") {
      processModes(actions, modesMap);
    }
  } catch (error) {
    console.error(`Error processing JSON file: ${filePath}`);
    console.error(error);
  }
}

function processModes(obj, modesMap) {
  if (obj && typeof obj === "object" && obj !== null) {
    if (obj.hasOwnProperty("_mod")) {
      const modObject = obj._mod;
      if (modObject && typeof modObject === "object" && modObject !== null) {
        for (let key in modObject) {
          if (key === "*") {
            const modes = modObject[key];
            if (modes && typeof modes === "object" && modes !== null) {
              for (let modeKey in modes) {
                const mode = modes[modeKey].mode;
                if (modesMap.hasOwnProperty(mode)) {
                  modesMap[mode]++;
                } else {
                  modesMap[mode] = 1;
                }
              }
            }
          }
        }
      }
    }
    if (obj.hasOwnProperty("mode")) {
      const mode = obj.mode;
      if (modesMap.hasOwnProperty(mode)) {
        modesMap[mode]++;
      } else {
        modesMap[mode] = 1;
      }
    }
    for (let key in obj) {
      processModes(obj[key], modesMap);
    }
  }
}

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${folderPath}`);
    console.error(err);
    return;
  }

  const modesMap = {};

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileExtension = path.extname(filePath);
    if (fileExtension.toLowerCase() === ".json") {
      processJSONFile(filePath, modesMap);
    }
  });

  console.log("List of modes and their occurrences:");
  for (let mode in modesMap) {
    console.log(`Mode: ${mode}, Occurrences: ${modesMap[mode]}`);
  }
});
