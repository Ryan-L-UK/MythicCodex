// ---------------------------------------------------------------------------------------------------------
//ITEM LIST
fetch("http://localhost:8080/sources/BlackMarket/")
  .then((response) => response.json())
  .then((data) => {
    //-----------------------
    //CREATE TABLE HEADINGS
    const tblParent = document.getElementById("bmTable");
    const myTable = document.createElement("table");
    myTable.setAttribute("id", "myTable");
    //-----------------------
    const tblHead = document.createElement("thead");
    const tblRow = document.createElement("tr");
    //-----------------------
    const tblImage = document.createElement("th");
    tblImage.innerHTML = "Image";
    tblImage.setAttribute("style", "width:40px");
    //-----------------------
    const tblIName = document.createElement("th");
    tblIName.innerHTML = "Item Name";

    //-----------------------
    const tblCost = document.createElement("th");
    tblCost.innerHTML = "Cost";
    tblCost.setAttribute("style", "width:80px");

    //-----------------------
    myTable.appendChild(tblHead);
    tblHead.appendChild(tblRow);
    tblRow.appendChild(tblImage);
    tblRow.appendChild(tblIName);
    tblRow.appendChild(tblCost);
    //-----------------------
    //CREATE TABLE BODY
    const tbodyRef = document.createElement("tbody");
    myTable.appendChild(tbodyRef);
    let voidItems = 0;
    //let voidImages = 0;
    const voidItemsArray = [];
    //const voidImages = [];

    for (const prop in data) {
      //-----------------
      // Data Cleanser
      if (
        data[prop].status != "Sold" &&
        data[prop].status != "Pending" &&
        data[prop].status == "Active"
      ) {
        //-----------------
        let itemName = data[prop].name;
        var newRow = tbodyRef.insertRow();
        //-----------------------
        //ITEM ICONS
        var newImage = newRow.insertCell();
        var newImageRaw = document.createElement("img");
        newImageRaw.src =
          "http://localhost:8080/EnchantedForge/ImageAssets/ItemIcons/" +
          data[prop].realName
            .replace(/\//g, "-")
            .replace(/\+1 /g, "")
            .replace(/\+2 /g, "")
            .replace(/\+3 /g, "")
            .replace(/\+4 /g, "")
            .replace(/ \(Awakened\)/g, "")
            .replace(/ \(Dormant\)/g, "")
            .replace(/ \(Exalted\)/g, "")
            .replace(/ \(Black Sapphire\)/g, "")
            .replace(/ \(Diamond\)/g, "")
            .replace(/ \(Jacinth\)/g, "")
            .replace(/ \(Rainbow Pearl\)/g, "")
            .replace(/ \(Ruby\)/g, "")
            .replace(/Black Dragon /g, "Dragon ")
            .replace(/Blue Dragon /g, "Dragon ")
            .replace(/Brass Dragon /g, "Dragon ")
            .replace(/Bronze Dragon /g, "Dragon ")
            .replace(/Copper Dragon /g, "Dragon ")
            .replace(/Gold Dragon /g, "Dragon ")
            .replace(/Green Dragon /g, "Dragon ")
            .replace(/Red Dragon /g, "Dragon ")
            .replace(/Silver Dragon /g, "Dragon ")
            .replace(/White Dragon /g, "Dragon ") +
          ".png";

        newImageRaw.setAttribute("class", "ListIcon");
        newImage.appendChild(newImageRaw);
        //-----------------------
        //ITEM NAME
        var newName = newRow.insertCell();
        const jsonAnchor = document.createElement("a");
        var newNameText = document.createTextNode(itemName);
        newName.appendChild(jsonAnchor);
        var jsonlink =
          "http://localhost:8080/Pages/ItemsPage.html?FileName=" + itemName;
        jsonAnchor.setAttribute("href", jsonlink);
        jsonAnchor.addEventListener("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          fetchData(itemName.replace("/", "-"));
        });
        jsonAnchor.appendChild(newNameText);
        newName.setAttribute("class", data[prop].rarity);
        //-----------------

        var newCost = newRow.insertCell();

        var newCostText = document.createTextNode(data[prop].cost);
        newCost.appendChild(newCostText);
        newCost.setAttribute("class", "ListCost");
        //------------------
      }
      tblParent.appendChild(myTable);
      if (voidItems > "0") {
        window.alert(
          "There are: " +
            voidItems +
            " items that meet the delete conditions. Please review the logs."
        );
        console.warn("Copy the object below to: FileRelocationList.txt");
        console.log(voidItemsArray);
      }
    }
  });

// ---------------------------------------------------------------------------------------------------------
//IMPORT FROM URL
function fetchData(fileName) {
  console.log(
    "Librarians: Looking in the 'Magical Items' section, for '" + fileName + "'"
  );
  console.warn("Cleric: Casting Prestidigitation On Form...");
  fetch("http://localhost:8080/Sources/BlackMarket/" + fileName + ".json")
    .then(function (urlOUTPUT) {
      return urlOUTPUT.text();
    })
    .then(function (etl) {
      const text = etl;
      const obj = JSON.parse(text);
      runETL(obj);
    });
}
// ---------------------------------------------------------------------------------------------------------
//EXTRACT TRANSFORM & LOAD
function runETL(obj) {
  console.log(obj);

  function generateImageUrl(realName) {
    return (
      "http://localhost:8080/EnchantedForge/ImageAssets/ItemIcons/" +
      realName
        .replace(/\//g, "-")
        .replace(/\+1 /g, "")
        .replace(/\+2 /g, "")
        .replace(/\+3 /g, "")
        .replace(/\+4 /g, "")
        .replace(/ \(Awakened\)/g, "")
        .replace(/ \(Dormant\)/g, "")
        .replace(/ \(Exalted\)/g, "")
        .replace(/ \(Black Sapphire\)/g, "")
        .replace(/ \(Diamond\)/g, "")
        .replace(/ \(Jacinth\)/g, "")
        .replace(/ \(Rainbow Pearl\)/g, "")
        .replace(/ \(Ruby\)/g, "")
        .replace(/Black Dragon /g, "Dragon ")
        .replace(/Blue Dragon /g, "Dragon ")
        .replace(/Brass Dragon /g, "Dragon ")
        .replace(/Bronze Dragon /g, "Dragon ")
        .replace(/Copper Dragon /g, "Dragon ")
        .replace(/Gold Dragon /g, "Dragon ")
        .replace(/Green Dragon /g, "Dragon ")
        .replace(/Red Dragon /g, "Dragon ")
        .replace(/Silver Dragon /g, "Dragon ")
        .replace(/White Dragon /g, "Dragon ") +
      ".png"
    );
  }

  document
    .getElementById("BMIcon")
    .setAttribute("src", generateImageUrl(obj.realName));

  document.getElementById("BMName").innerHTML = obj.name;

  document
    .getElementById("BMMainImage")
    .setAttribute("src", generateImageUrl(obj.realName));

  document.getElementById("BMDesc").innerHTML = obj.entries[0];
  document.getElementById("BMCost").innerHTML = obj.cost;
  document.getElementById("BMBuy").classList.remove("hidden");
}
//-----------------------------------------
//Sticky Menu Selector
//-----------------------------------------

// When the user scrolls the page, execute myFunction
window.onscroll = function () {
  myFunction();
};

// Get the itemframe
var itemframe = document.getElementById("itemframe");

// Get the offset position of the itemframe
var sticky = itemframe.offsetTop;

var stickyos = sticky - 55;

// Add the sticky class to the itemframe when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.scrollY >= stickyos) {
    console.log("Sourceror: Menu Locked...");
    itemframe.classList.add("stickyFrame");
  } else {
    itemframe.classList.remove("stickyFrame");
    console.log("Sourceror: Menu Unlocked...");
  }
}

// ---------------------------------------------------------------------------------------------------------
function buyItem() {
  console.log("Purchasing: " + document.getElementById("BMName").innerHTML);

  // Get the item name from the HTML element
  const itemName = document.getElementById("BMName").innerHTML;

  // Construct the file path using the value of the input field "BMName"
  const filePath = "http://localhost:8080/sources/BlackMarket/buy/" + itemName;

  // Send a POST request to update the JSON file
  fetch(filePath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      // The item has been successfully marked as sold
      console.log(data.message);

      // You can access the updated data from the server response
      console.log(data.updatedData);
      window.alert(
        "You have just purchased: " +
          document.getElementById("BMName").innerHTML +
          " for " +
          document.getElementById("BMCost").innerHTML
      );

      // You can add any additional actions or UI updates here
      location.reload();
    })
    .catch(function (error) {
      console.error("Error updating item:", error.message);
      // Handle errors here if necessary
    });
}

// ---------------------------------------------------------------------------------------------------------
function generateItems() {
  fetch("/generate-items", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Display the response in the console or update your UI accordingly
    })
    .catch((error) => {
      console.error("Error generating items:", error);
    })
    .finally(() => {
      location.reload(); // Reload the page after the process is completed
    });
}

// Attach the function to the button's click event
const generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", generateItems);
