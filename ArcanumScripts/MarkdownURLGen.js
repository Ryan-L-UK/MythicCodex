const readline = require("readline");
const querystring = require("querystring");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateURL() {
  rl.question(
    "Select an option:\n1 - Creatures\n2 - Items\n3 - Spells\n",
    (option) => {
      rl.question("Enter the name: ", (name) => {
        let encodedName = encodeURIComponent(name);

        let url;
        switch (option) {
          case "1":
            url = `**[${name}](http://localhost:8080/Sources/Creatures/${encodedName}.png)**`;
            break;
          case "2":
            url = `_[${name}](http://localhost:8080/Sources/MagicItems/${encodedName}.png)_`;
            break;
          case "3":
            url = `_[${name}](http://localhost:8080/Sources/Spells/${encodedName}.png)_`;
            break;
          default:
            console.log("Invalid option");
            break;
        }

        console.log("\nGenerated URL:");
        console.log(url);
        console.log("------------------------------------");
        generateURL();
      });
    }
  );
}

generateURL();
