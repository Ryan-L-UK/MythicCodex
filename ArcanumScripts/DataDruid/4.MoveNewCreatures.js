const fs = require("fs");
const path = require("path");

const inputFolder = path.join(__dirname, "../DataOutputs/monster");
const outputFolder = path.join(__dirname, "../../Sources/Creatures");

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(inputFolder, file);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }

      const jsonData = JSON.parse(data);

      if (jsonData._copy) {
        console.log(`Ignore Critera (_Copy): '${file}'`);
      } else {
        const outputPath = path.join(outputFolder, file);

        fs.rename(filePath, outputPath, (err) => {
          if (err) {
            console.error(`Error moving file '${file}':`, err);
          } else {
            console.log(`Relocating Criteria (New File): '${file}'`);
          }
        });
      }
    });
  });
});
