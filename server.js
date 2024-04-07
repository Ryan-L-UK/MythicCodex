var fs = require("fs"),
  http = require("http");
const express = require("express");
const app = express();
const port = 8080;

app.use("/LorePages", express.static(__dirname + "/LorePages"));
app.use("/Sources", express.static(__dirname + "/Sources"));
app.use("/EnchantedForge", express.static(__dirname + "/EnchantedForge"));
app.get("/", (req, res) => {
  fs.readFile(__dirname + "/Index.html", (err, data) => {
    if (err) {
      console.log("Failed to load file");
      res.writeHead(404);
      res.end(JSON.stringify(err));
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

app.get("/folders/*", (req, res) => {
  console.log(req.path);
  readDirectory("/" + req.path.replace("/folders/", ""), res);
});

app.get("/sources/:sourceType", (req, res) => {
  let filePath = "/Sources/" + req.params.sourceType;
  fs.readdir(__dirname + filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
    } else {
      const jsonFiles = data.filter((name) => name.includes(".json"));
      let promises = [];
      for (var file in jsonFiles) {
        promises.push(readFile(filePath, jsonFiles[file]));
      }

      Promise.all(promises).then((values) => {
        let output = [];
        for (let index in values) {
          let value = values[index];
          output.push(JSON.parse(value));
        }
        res.send(output);
      });
    }
  });
});

app.listen(port, () =>
  console.log("Server started successfully, do not close this terminal")
);

function readDirectory(folder, res) {
  console.log(folder);
  fs.readdir(__dirname + folder, (err, data) => {
    res.send(data);
  });
}

function readFile(filePath, file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + filePath + "/" + file, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Add a new route to handle updates when an item is bought
app.post("/sources/:sourceType/buy/:itemName", express.json(), (req, res) => {
  let filePath =
    "/Sources/" + req.params.sourceType + "/" + req.params.itemName + ".json";
  fs.readFile(__dirname + filePath, (err, data) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    } else {
      const obj = JSON.parse(data);
      obj.status = "Sold"; // Update the "status" field to "Sold"

      fs.writeFile(
        __dirname + filePath,
        JSON.stringify(obj, null, 2),
        (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to update file" });
          } else {
            res.json({
              message: "Item successfully marked as Sold",
              updatedData: obj,
            });
          }
        }
      );
    }
  });
});

app.post("/generate-items", (req, res) => {
  const blackMarketPath = "/Sources/TheGulletAdventures/BlackMarket";

  // Read all JSON files in the BlackMarket folder
  fs.readdir(__dirname + blackMarketPath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read BlackMarket folder" });
    } else {
      const jsonFiles = data.filter((name) => name.includes(".json"));

      // Filter out items that are not "Sold"
      const activeItems = jsonFiles.filter((file) => {
        const content = fs.readFileSync(
          __dirname + blackMarketPath + "/" + file
        );
        const item = JSON.parse(content);
        return item.status !== "Sold";
      });

      // Select a random number between 8 and 15 for the number of items to select
      const minItemsToSelect = 6;
      const maxItemsToSelect = 11;
      const numberOfItemsToSelect =
        Math.floor(Math.random() * (maxItemsToSelect - minItemsToSelect + 1)) +
        minItemsToSelect;

      const selectedItems = [];
      while (
        selectedItems.length < numberOfItemsToSelect &&
        activeItems.length > 0
      ) {
        const randomIndex = Math.floor(Math.random() * activeItems.length);
        const selectedItem = activeItems.splice(randomIndex, 1)[0];
        selectedItems.push(selectedItem);
      }

      // Update status for selected and pending items
      const updatedItems = [...selectedItems];
      for (const item of activeItems) {
        const filePath = blackMarketPath + "/" + item;
        const content = fs.readFileSync(__dirname + filePath);
        const parsedItem = JSON.parse(content);
        parsedItem.status = "Pending";
        updatedItems.push(item);
        fs.writeFileSync(
          __dirname + filePath,
          JSON.stringify(parsedItem, null, 2)
        );
      }

      // Update status for selected items
      for (const item of selectedItems) {
        const filePath = blackMarketPath + "/" + item;
        const content = fs.readFileSync(__dirname + filePath);
        const parsedItem = JSON.parse(content);
        parsedItem.status = "Active";
        fs.writeFileSync(
          __dirname + filePath,
          JSON.stringify(parsedItem, null, 2)
        );
      }

      res.json({
        message: "Items generated successfully",
        generatedItems: selectedItems,
      });
    }
  });
});
