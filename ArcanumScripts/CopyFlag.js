const fs = require("fs");
const path = require("path");

const outputFolder = path.join(__dirname, "Outputs/monster");
const sourceFolder = path.join(__dirname, "../Sources/Creatures");
const doneFolder = path.join(__dirname, "Outputs/done"); // New folder

console.log(`----------------------------------`);
fs.readdirSync(outputFolder).forEach((filename) => {
  const filePath = path.join(outputFolder, filename);

  if (filename.endsWith(".json")) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    let data = JSON.parse(fileContent);

    const _Copy = data._copy && data._copy.name && data._copy.source;
    const _Mod = data._copy && data._copy._mod;

    // Check if the file meets the criteria
    if (
      _Copy && // File has a _copy element
      (!_Mod || hasValidModActions(_Mod)) // No _mod or valid _mod actions
    ) {
      console.log(`Processing file: ${filename}`);

      // Files meeting the criteria are processed here
      const copyFileName = `${data._copy.name}.json`;
      const copyFilePath = path.join(sourceFolder, copyFileName);

      if (fs.existsSync(copyFilePath)) {
        console.log(`Cloning data from ${copyFilePath}`);
        const copyFileContent = fs.readFileSync(copyFilePath, "utf8");
        const copyData = JSON.parse(copyFileContent);

        for (const key in copyData) {
          if (!data[key]) {
            data[key] = copyData[key];
          }
        }

        // Process _mod actions if present
        if (_Mod) {
          for (const modKey in _Mod) {
            if (hasValidModActions(_Mod[modKey])) {
              if (Array.isArray(_Mod[modKey])) {
                _Mod[modKey].forEach((action) => {
                  processAction(data, action, filename);
                });
              } else {
                // Handle the case where _Mod[modKey] is not an array (e.g., an object)
                processAction(data, _Mod[modKey], filename);
              }
            }
          }
        }

        // Delete the _copy key and its contents
        delete data._copy;

        // Write the modified data back to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Move the modified file to the "done" folder
        const doneFilePath = path.join(doneFolder, filename);
        fs.renameSync(filePath, doneFilePath);

        console.log(`Modified and saved: ${filename}`);
        console.log(`----------------------------------`);
      } else {
        console.log(`Source file not found for '${filename}'`);
        console.log(`----------------------------------`);
      }
    } else {
      console.log(`Disregarded: ${filename} (Outside Scope)`);
      console.log(`----------------------------------`);
    }
  }
});

function hasValidModActions(modData) {
  if (!modData) {
    return true; // No _mod is also considered valid
  }
  if (Array.isArray(modData)) {
    return modData.every((action) =>
      ["replaceTxt", "replaceArr"].includes(action.mode)
    );
  } else {
    return ["replaceTxt", "replaceArr"].includes(modData.mode);
  }
}

function processAction(data, action, filename) {
  switch (action.mode) {
    case "replaceTxt":
      // Replace text action
      console.log(
        `Replacing text "${action.replace}" with "${action.with}" for file: ${filename}`
      );
      data = replaceText(data, action.replace, action.with);
      break;
    case "replaceArr":
      console.log(
        `Replacing array "${action.replace}" with "${action.with}" for file: ${filename}`
      );
      data = replaceArray(data, action.replace, action.items);
      break;
    // Add more action cases here for different modes if needed
  }
}

function replaceText(data, find, replace) {
  for (const key in data) {
    if (typeof data[key] === "string") {
      const regex = new RegExp(find, "i");
      data[key] = data[key].replace(regex, replace);
    } else if (typeof data[key] === "object") {
      data[key] = replaceText(data[key], find, replace);
    }
  }
  return data;
}

function replaceArray(data, find, replace) {
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        if (typeof data[key][i] === "string") {
          const regex = new RegExp(find, "i");
          data[key][i] = data[key][i].replace(regex, replace);
        } else if (typeof data[key][i] === "object") {
          data[key][i] = replaceArray(data[key][i], find, replace);
        }
      }
    } else if (typeof data[key] === "object") {
      data[key] = replaceArray(data[key], find, replace);
    }
  }
  return data;
}
