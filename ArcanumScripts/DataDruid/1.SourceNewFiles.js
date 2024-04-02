const path = require("path");
const fs = require("fs");

function copyFilesToSources() {
  // Copy items.json file
  const sourceItemsFile = "../../../5etools-mirror/data/items.json";
  const destinationItemsFile = path.join(
    __dirname,
    "../JSONSourceFiles/items.json"
  );
  fs.copyFile(sourceItemsFile, destinationItemsFile, (error) => {
    if (error) {
      console.error(`Error while copying items.json: ${error}`);
    } else {
      console.log(
        "Successfully copied file 'items.json' to sources directory."
      );
    }
  });

  // Copy spells files
  const sourceSpellsFolder = "../../../5etools-mirror/data/spells";
  const destinationSpellsFolder = path.join(__dirname, "../JSONSourceFiles");

  fs.readdir(sourceSpellsFolder, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach(function (file) {
      if (
        file === "index.json" ||
        file === "foundry.json" ||
        file.startsWith("fluff-") ||
        file.startsWith("spells-ua-")
      ) {
        return; // Ignore files that match the exclusion criteria
      }

      const sourceFilePath = path.join(sourceSpellsFolder, file);
      const destinationFilePath = path.join(destinationSpellsFolder, file);

      fs.copyFile(sourceFilePath, destinationFilePath, (error) => {
        if (error) {
          console.error(`Error while copying file '${file}': ${error}`);
        } else {
          console.log(
            `Successfully copied file '${file}' to sources directory.`
          );
        }
      });
    });
  });

  // Copy bestiary files
  const sourceBestiaryFolder = "../../../5etools-mirror/data/bestiary";
  const destinationBestiaryFolder = path.join(__dirname, "../JSONSourceFiles");

  fs.readdir(sourceBestiaryFolder, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach(function (file) {
      if (
        file === "index.json" ||
        file === "foundry.json" ||
        file === "legendarygroups.json" ||
        file === "traits.json" ||
        file.startsWith("fluff-") ||
        file.startsWith("bestiary-ua-")
      ) {
        return; // Ignore files that match the exclusion criteria
      }

      const sourceFilePath = path.join(sourceBestiaryFolder, file);
      const destinationFilePath = path.join(destinationBestiaryFolder, file);

      fs.copyFile(sourceFilePath, destinationFilePath, (error) => {
        if (error) {
          console.error(`Error while copying file '${file}': ${error}`);
        } else {
          console.log(
            `Successfully copied file '${file}' to sources directory.`
          );
        }
      });
    });
  });
}

// Call the function to initiate the file copying
copyFilesToSources();
