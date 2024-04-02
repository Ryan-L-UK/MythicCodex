const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "../DataOutputs/item"); // Replace with the actual path to your folder
const gemstonesFolderPath = path.join(__dirname, "../DataOutputs/gemstones");

console.log("----------------------------------------------");
// Read the files in the folder
fs.readdirSync(folderPath).forEach((filename) => {
  const filePath = path.join(folderPath, filename);

  // Check if the file is a JSON file
  if (filename.endsWith(".json")) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Check if the 'type' property exists
    if (data.hasOwnProperty("type")) {
      const type = data.type;

      if (type === "$") {
        // Move the file to the gemstones folder
        fs.renameSync(filePath, path.join(gemstonesFolderPath, filename));
        console.log(`Relocating Criteria (Treaure): ${filename}`);
        return; // Skip to the next file
      }

      // Check if the 'type' property meets any of the specified criteria for deletion
      if (
        type === "AIR" ||
        type === "AT" ||
        type === "FD" ||
        type === "G" ||
        type === "GS" ||
        type === "MNT" ||
        type === "SCF" ||
        type === "SHP" ||
        type === "SPC" ||
        type === "T" ||
        type === "TAH" ||
        type === "TG" ||
        type === "VEH"
      ) {
        // Delete the file
        fs.unlinkSync(filePath);
        console.log(`Delete Criteria (Existing): ${filename}`);
        return; // Skip to the next file
      }
    }

    // Check if the 'tattoo' property exists
    if (data.hasOwnProperty("tattoo")) {
      // Check if the 'type' property meets any of the specified criteria
      if (data.tattoo === true) {
        // Delete the file
        fs.unlinkSync(filePath);
        console.log(`Delete Criteria (Tattoo): ${filename}`);
      }
    }
  }
});
