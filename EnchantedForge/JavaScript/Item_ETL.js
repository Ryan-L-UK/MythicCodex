//---------------------------------------------------------------------------------------------------------
//ITEM TYPE FUNCTION
function checktype(type) {
  var checktype = "";
  var lookup = {
    // TG: "Trade Good",
    $: "Treasure",
    // AIR: "Vehicle (Air)",
    // FD: "Food And Drink",
    // MNT: "Mount",
    // SHP: "Vehicle (Ship)",
    // TAH: "Tack and harness",
    // VEH: "Vehicle (Land)",
    A: "Ammunition",
    AF: "Ammunition",
    AT: "Artisan's Tools",
    EXP: "Explosive",
    G: "Adventuring Gear",
    GS: "Gaming Set",
    GV: "Generic Variant",
    HA: "Heavy Armour",
    INS: "Instrument",
    LA: "Light Armour",
    M: "Melee Weapon",
    MA: "Medium Armour",
    OTH: "Other",
    P: "Potion",
    R: "Ranged Weapon",
    RD: "Rod",
    RG: "Ring",
    S: "Shield",
    SC: "Scroll",
    SCF: "Spellcasting Focus",
    T: "Tools",
    WD: "Wand",
  };
  checktype = lookup[type];
  return checktype;
}
//---------------------------------------------------------------------------------------------------------
//DAMAGE TYPE FUNCTION
function checkdmgtype(dmgtype) {
  var checkdmgtype = "";
  var lookup = {
    A: "Acid",
    B: "Bludgeoning",
    C: "Cold",
    F: "Fire",
    FC: "Force",
    L: "Lightning",
    N: "Necrotic",
    P: "Piercing",
    PO: "Poison",
    PS: "Psychic",
    R: "Radiant",
    S: "Slashing",
    T: "Thunder",
  };
  checkdmgtype = lookup[dmgtype];
  return checkdmgtype;
}
//---------------------------------------------------------------------------------------------------------
//PROPERTIES FUNCTION
function checkproperties(property) {
  var checkproperties = "";
  var lookup = {
    AF: "Ammunition",
    A: "Ammunition",
    F: "Finesse",
    H: "Heavy",
    L: "Light",
    RLF: "Reload",
    LD: "Loading",
    R: "Reach",
    S: "Special",
    T: "Thrown",
    "2H": "Two-Handed",
    V: "Versatile",
  };
  checkproperties = lookup[property];
  return checkproperties;
}
// ---------------------------------------------------------------------------------------------------------
//ITEM LIST
fetch("http://localhost:8080/Sources/CuriousItems/")
  .then((response) => response.json())
  .then((data) => {
    //-----------------------
    //CREATE TABLE HEADINGS
    const tblParent = document.getElementById("iTable");
    const myTable = document.createElement("table");
    myTable.setAttribute("id", "myTable");
    //-----------------------
    const tblHead = document.createElement("thead");
    tblHead.setAttribute("class", "fixedHead");
    const tblRow = document.createElement("tr");
    //-----------------------
    const tblImage = document.createElement("th");
    tblImage.innerHTML = "Image";
    tblImage.setAttribute("style", "width:40px");
    //-----------------------
    const tblIName = document.createElement("th");
    tblIName.innerHTML = "Item Name";
    tblIName.setAttribute("width", "205px");
    const tblType = document.createElement("th");
    //-----------------------
    tblType.innerHTML = "Type";
    tblType.setAttribute("width", "120px");
    //-----------------------
    const tblRare = document.createElement("th");
    tblRare.innerHTML = "Rarity";
    //-----------------------
    const tblSource = document.createElement("th");
    tblSource.innerHTML = "Source";
    //-----------------------
    myTable.appendChild(tblHead);
    tblHead.appendChild(tblRow);
    tblRow.appendChild(tblImage);
    tblRow.appendChild(tblIName);
    tblRow.appendChild(tblType);
    tblRow.appendChild(tblRare);
    tblRow.appendChild(tblSource);
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
        (data[prop].source.includes("UA") && data[prop].source != "UAWGE") ||
        (data[prop].customIndicator == undefined &&
          data[prop].entries == undefined) ||
        data[prop].type == "SHP" ||
        data[prop].type == "SPC" ||
        data[prop].type == "AIR" ||
        data[prop].type == "VEH" ||
        data[prop].type == "MNT" ||
        data[prop].type == "TAH" ||
        data[prop].type == "FD" ||
        data[prop].type == "TG" ||
        data[prop].source == "XMtS" ||
        data[prop]._copy != undefined
      ) {
        voidItems++;
        voidItemsArray.push(data[prop].name + ".json");
      }

      //-----------------
      let itemName = data[prop].name;
      var newRow = tbodyRef.insertRow();
      //-----------------------
      //ITEM ICONS
      var newImage = newRow.insertCell();
      var newImageRaw = document.createElement("img");
      newImageRaw.src =
        "http://localhost:8080/EnchantedForge/ImageAssets/ItemIcons/" +
        data[prop].name
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
      var newType = newRow.insertCell();
      if (data[prop].customIndicator == undefined) {
        if (data[prop].wondrous == true) {
          var newTypeText = document.createTextNode("Wondrous Item");
        } else if (data[prop].staff != undefined) {
          var newTypeText = document.createTextNode("Staff");
        } else if (data[prop].poison != undefined) {
          var newTypeText = document.createTextNode("Poison");
        } else {
          var newTypeText = document.createTextNode(checktype(data[prop].type));
        }
      } else {
        var newTypeText = document.createTextNode(data[prop].type);
      }
      newType.appendChild(newTypeText);
      //-----------------
      var newRarity = newRow.insertCell();

      if (data[prop].rarity != undefined) {
        var newRarityText = document.createTextNode(
          data[prop].rarity.charAt(0).toUpperCase() + data[prop].rarity.slice(1)
        );
      } else {
        var newRarityText = document.createTextNode("N/A");
      }
      newRarity.appendChild(newRarityText);
      newRarity.removeAttribute("class");
      newRarity.setAttribute("class", data[prop].rarity);
      //-----------------
      var newSource = newRow.insertCell();

      var newSourceText = document.createTextNode(data[prop].source);
      newSource.appendChild(newSourceText);
      newSource.removeAttribute("class");
      newSource.setAttribute("class", data[prop].source);
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
  });
// ---------------------------------------------------------------------------------------------------------
//IMPORT FROM URL
function fetchData(fileName) {
  console.log(
    "Librarians: Looking in the 'Magical Items' section, for '" + fileName + "'"
  );
  document.getElementById("itemform").reset();
  console.warn("Cleric: Casting Prestidigitation On Form...");
  fetch("http://localhost:8080/Sources/CuriousItems/" + fileName + ".json")
    .then(function (urlOUTPUT) {
      return urlOUTPUT.text();
    })
    .then(function (etl) {
      const text = etl;
      const obj = JSON.parse(text);
      runETL(obj);
    })
    .then(function () {
      showInput();
    });
}
//---------------------------------------------------------------------------------------------------------
//IMPORT FROM FILE
async function readText(event) {
  document.getElementById("itemform").reset();
  console.warn("Cleric: Casting Prestidigitation On Form...");
  const file = event.target.files.item(0);
  const text = await file.text();
  const obj = JSON.parse(text);
  runETL(obj);
}
// ---------------------------------------------------------------------------------------------------------
//EXTRACT TRANSFORM & LOAD
function runETL(obj) {
  // ---------------------------------------------------------------------------------------------------------
  //JSON CONVERTER

  if (obj.customIndicator == undefined) {
    console.warn("Cleric: Summoning Converter Shell");
    console.log(obj);
    var object = {};
    //---------------------------------------------------------------------------------------------------------
    if (obj.reqAttune == undefined) {
      var reqAttune = undefined;
    } else {
      var reqAttune = "Yes";
    }
    //-----------------------------
    if (obj.rarity == "none") {
      var rarity = "";
    } else {
      var rarity = obj.rarity;
    }
    //-----------------------------
    if (obj.wondrous == true) {
      var type = "Wondrous Item";
    } else if (obj.weaponCategory != undefined) {
      var type = "Weapon";
    } else if (obj.type != undefined) {
      var type = checktype(obj.type);
    } else {
      var type = undefined;
    }

    //-----------------------------
    if (obj.weaponCategory == undefined) {
      var staffTrue = undefined;
      var weaponCategory = undefined;
      var dmg1 = undefined;
      var dmgType = undefined;
      var property = undefined;
    } else {
      var dmgType = checkdmgtype(obj.dmgType);
      if (obj.staff == true) {
        var staffTrue = "Yes";
      } else {
        var staffTrue = undefined;
      }

      if (obj.type != undefined) {
        var weaponCategory =
          obj.weaponCategory + " weapon, " + checktype(obj.type);
      } else if (staffTrue == "Yes") {
        var weaponCategory = obj.weaponCategory + " weapon, melee weapon";
      } else {
        var weaponCategory = obj.weaponCategory;
      }

      var dmg1 = obj.dmg1;
      if (obj.dmg2 != undefined) {
        var dmg2 = obj.dmg2;
      } else {
        var dmg2 = undefined;
      }

      if (obj.property[0] != undefined) {
        if (obj.property[0] == "A") {
          var property0 =
            checkproperties(obj.property[0]) + " (" + obj.range + " ft.)";
        } else {
          var property0 = checkproperties(obj.property[0]);
        }
      } else {
        var property0 = "";
      }
      if (obj.property[1] != undefined) {
        if (obj.property[1] == "A") {
          var property1 =
            ", " +
            checkproperties(obj.property[1]) +
            " (" +
            obj.range +
            " ft.)";
        } else {
          var property1 = ", " + checkproperties(obj.property[1]);
        }
      } else {
        var property1 = "";
      }
      if (obj.property[2] != undefined) {
        if (obj.property[2] == "A") {
          var property2 =
            ", " +
            checkproperties(obj.property[2]) +
            " (" +
            obj.range +
            " ft.)";
        } else {
          var property2 = ", " + checkproperties(obj.property[2]);
        }
      } else {
        var property2 = "";
      }
      var property = property0 + property1 + property2;
    }
    //---------------------------------------------------------------------------------------------------------
    //ENTRIES CODE
    let entriesOut = [];
    var entriesList = obj.entries;
    var entriesLength = entriesList.length;
    for (var i = 0; i < entriesLength; i++) {
      if (entriesList[i].name != undefined) {
        entriesOut.push({
          name: entriesList[i].name,
          data: datacleanse(entriesList[i].entries),
        });
      } else {
        entriesOut.push({ data: datacleanse(entriesList[i]) });
      }
    }
    //---------------------------------------------------------------------------------------------------------
    //MAPPING CODE
    object["name"] = obj["name"];

    object["reqAttune"] = reqAttune;
    object["rarity"] = rarity;
    object["type"] = type;

    object["cost"] = obj.value / 100;
    object["charges"] = obj["charges"];

    object["source"] = obj["source"];
    object["page"] = obj["page"];

    object["staff"] = staffTrue;
    object["weaponCategory"] = weaponCategory;
    object["dmgType"] = dmgType;
    object["dmg1"] = dmg1;
    object["dmg2"] = dmg2;
    object["property"] = property;

    var entriesOutLength = entriesOut.length;
    for (var i = 0; i < entriesOutLength; i++) {
      object["I" + [i] + "H"] = entriesOut[i].name;
      object["I" + [i] + "D"] = entriesOut[i].data;
    }
    console.log(object);
    // ---------------------------------------------------------------------------------------------------------
    // Extract File
    // ---------------------------------------------------------------------------------------------------------
    let outputJson = JSON.stringify(object); //turn the object into json
    document.getElementById("itemform").reset();
    const objct = JSON.parse(outputJson);
    for (const prop in objct) {
      console.log(`${objct[prop]}`);
      document.getElementById(`${prop}`).value = `${objct[prop]}`;
    }
    console.warn("Cleric: Summoning Ritual Complete");
  }

  //RML CUSTOM JSON
  else {
    console.warn("Cleric: Summoning Custom Shell");
    console.log(obj);
    for (const prop in obj) {
      console.log(`${prop} = ${obj[prop]}`);
      document.getElementById(`${prop}`).value = `${obj[prop]}`;
    }
    console.warn("Cleric: Summoning Ritual Complete");
  }
}
// ---------------------------------------------------------------------------------------------------------
//ITEM INPUT
function showInput() {
  document.getElementById("dmg-out").innerHTML = "";

  document.getElementById("ItemImage").setAttribute(
    "src",

    "http://localhost:8080/EnchantedForge/ImageAssets/ItemIcons/" +
      document
        .getElementById("name")
        .value.replace(/\//g, "-")
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

  document.getElementById("name-out").innerHTML =
    document.getElementById("name").value;

  if (document.getElementById("reqAttune").value != "") {
    document
      .getElementById("attunement-out")
      .setAttribute("class", "attuneicon");
    document.getElementById("attunement-out").classList.remove("hidden");
  } else {
    document.getElementById("attunement-out").setAttribute("class", "hidden");
  }
  //------

  if (document.getElementById("staff").value != "") {
    var staff = "staff, ";
  } else {
    var staff = "";
  }

  if (
    document.getElementById("type").value == "Weapon" ||
    document.getElementById("type").value == "Ranged"
  ) {
    var type = document.getElementById("weaponCategory").value;
  } else {
    var type = document.getElementById("type").value;
  }

  if (
    document.getElementById("type").value == "Adventuring Gear" ||
    document.getElementById("type").value == "Treasure"
  ) {
    if (document.getElementById("type").value == "Adventuring Gear") {
      document.getElementById("type-out").innerHTML = type;
    } else {
      console.log("cost here");
      document.getElementById("type-out").innerHTML = type;
      document.getElementById("dmg-out").innerHTML =
        document.getElementById("cost").value + "GP";
    }
  } else {
    console.log("Not Treasure");
    document.getElementById("type-out").innerHTML =
      staff + type + ", " + document.getElementById("rarity").value;
  }

  //------
  if (document.getElementById("dmg2").value != "") {
    var dmg2 = " (" + document.getElementById("dmg2").value + ")";
  } else {
    dmg2 = "";
  }
  if (document.getElementById("weaponCategory").value == "") {
    //do nothing
  } else {
    document.getElementById("dmg-out").innerHTML =
      document.getElementById("dmg1").value +
      " " +
      document.getElementById("dmgType").value +
      " - " +
      document.getElementById("property").value +
      dmg2;
  }
  var source = document.getElementById("source").value.toUpperCase();
  document.getElementById("source-out").innerHTML =
    document.getElementById("source").value;
  if (source != "HOMEBREW") {
    document.getElementById("page-out").innerHTML =
      "p" + document.getElementById("page").value;
  } else {
    document.getElementById("page-out").innerHTML = "";
  }
  document.getElementById("source-out").removeAttribute("class");
  document.getElementById("source-out").classList.add("source");
  if (source == "HOMEBREW") {
    document.getElementById("source-out").classList.add("HMBW");
    document.getElementById("source-out").innerHTML = "Homebrew";
  } else {
    document
      .getElementById("source-out")
      .classList.add(document.getElementById("source").value);
  }
  for (let i = 0; i < 9; i++) {
    const index = `I${i}`;
    document.getElementById(`${index}H-out`).innerHTML =
      document.getElementById(`${index}H`).value;
    if (document.getElementById(`${index}H`).value != "") {
      document.getElementById(`${index}H-out`).classList.add("TopMargin");
    } else {
      document.getElementById(`${index}H-out`).classList.remove("TopMargin");
    }

    document.getElementById(`${index}D-out`).innerHTML =
      document.getElementById(`${index}D`).value;
    if (document.getElementById(`${index}D`).value != "") {
      document.getElementById(`${index}D-out`).classList.add("BottomMargin");
    } else {
      document.getElementById(`${index}D-out`).classList.remove("BottomMargin");
    }
  }

  if (document.getElementById("charges").value == "") {
    document.getElementById("cHeading-out").classList.remove("TopMargin");
    document.getElementById("cHeading-out").classList.add("hidden");
    document.getElementById("charges-out").classList.add("hidden");
  } else {
    document.getElementById("cHeading-out").classList.add("TopMargin");
    document.getElementById("cHeading-out").classList.remove("hidden");
    document.getElementById("charges-out").classList.remove("hidden");

    document.getElementById("cHeading-out").innerHTML =
      "Charges: " + document.getElementById("charges").value;
    var charges = document.getElementById("charges").value;
    var checkmarks = "";
    for (var i = 0; i < charges; i++) {
      checkmarks += "【 】";
    }
    document.getElementById("charges-out").innerHTML = checkmarks;
  }

  var source = document.getElementById("source").value.toUpperCase();
  document.getElementById("source-out").innerHTML =
    document.getElementById("source").value;
  if (source != "HOMEBREW") {
    document.getElementById("page-out").innerHTML =
      "p" + document.getElementById("page").value;
  } else {
    document.getElementById("page-out").innerHTML = "";
  }
  document.getElementById("source-out").removeAttribute("class");
  document.getElementById("source-out").classList.add("source");
  if (source == "HOMEBREW") {
    document.getElementById("source-out").classList.add("HMBW");
    document.getElementById("source-out").innerHTML = "Homebrew";
  } else {
    document
      .getElementById("source-out")
      .classList.add(document.getElementById("source").value);
  }
}
// ---------------------------------------------------------------------------------------------------------
//EXPORT SOURCE CODE
function exportSource() {
  var form = new FormData(document.getElementById("itemform")); //loads the document into a form object based on it being the parent of the button (button is the div here because i'm lazy)
  let outputObject = {};
  for (var [key, value] of form) {
    //loop the form data
    if (value == 0) {
      //Do nothing
    } else if (value != "") {
      //if the key exists
      outputObject[key] = value; //store it in the object
    }
  }
  let outputJson = JSON.stringify(outputObject); //turn the object into json
  var hiddenElement = document.createElement("a");
  var filename = document.getElementById("name").value;
  hiddenElement.href = "data:attachment/text," + encodeURI(outputJson);
  hiddenElement.target = "_blank";
  hiddenElement.download = filename + ".json";
  hiddenElement.click();
}
