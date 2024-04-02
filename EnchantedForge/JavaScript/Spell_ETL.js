// ---------------------------------------------------------------------------------------------------------
//SPELL LEVEL
function checklevel(lvl) {
  var checklevel = "";
  var lookup = {
    "": "Error",
    0: "Cantrip",
    1: "1st level",
    2: "2nd level",
    3: "3rd level",
    4: "4th level",
    5: "5th level",
    6: "6th level",
    7: "7th level",
    8: "8th level",
    9: "9th level",
    10: "10th level",
  };
  checklevel = lookup[lvl];
  return checklevel;
}
//---------------------------------------------------------------------------------------------------------
//SPELL SCHOOL FUNCTION
function checkschool(school) {
  var checkschool = "";
  var lookup = {
    A: "Abjuration",
    C: "Conjuration",
    D: "Divination",
    E: "Enchantment",
    V: "Evocation",
    I: "Illusion",
    N: "Necromancy",
    T: "Transmutation",
    Abjuration: "Abjuration",
    Conjuration: "Conjuration",
    Divination: "Divination",
    Enchantment: "Enchantment",
    Evocation: "Evocation",
    Illusion: "Illusion",
    Necromancy: "Necromancy",
    Transmutation: "Transmutation",
  };
  checkschool = lookup[school];
  return checkschool;
}
// ---------------------------------------------------------------------------------------------------------
//SPELL LIST
fetch("http://localhost:8080/sources/Spells/")
  .then((response) => response.json())
  .then((data) => {
    //-----------------------
    //CREATE TABLE HEADINGS
    const tblParent = document.getElementById("sTable");
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
    const tblSName = document.createElement("th");
    tblSName.innerHTML = "Spell Name";
    tblSName.setAttribute("style", "width:230px");
    //-----------------------
    const tblLevel = document.createElement("th");
    tblLevel.innerHTML = "Level";
    tblLevel.setAttribute("style", "width:60px");
    //-----------------------
    const tblSchool = document.createElement("th");
    tblSchool.innerHTML = "School";
    tblSchool.setAttribute("style", "width:125px");
    //-----------------------
    const tblSource = document.createElement("th");
    tblSource.innerHTML = "Source";
    tblSource.setAttribute("style", "width:50px");
    //-----------------------
    myTable.appendChild(tblHead);
    tblHead.appendChild(tblRow);
    tblRow.appendChild(tblImage);
    tblRow.appendChild(tblSName);
    tblRow.appendChild(tblLevel);
    tblRow.appendChild(tblSchool);
    tblRow.appendChild(tblSource);
    //-----------------------
    //CREATE TABLE BODY
    const tbodyRef = document.createElement("tbody");
    myTable.appendChild(tbodyRef);
    //-----------------------
    //NAME CHECK & VARIABLE SET
    for (const prop in data) {
      if (data[prop].source.includes("UA") && data[prop].source != "UAWGE") {
        console.warn(data[prop].name);
      }
      let spellName = data[prop].name;
      var newRow = tbodyRef.insertRow();
      //-----------------------
      //SPELL ICONS
      var newImage = newRow.insertCell();
      var newImageRaw = document.createElement("img");
      newImageRaw.src =
        "http://localhost:8080/EnchantedForge/ImageAssets/SpellIcons/" +
        data[prop].name.replace(/\//g, "-") +
        ".png";
      newImageRaw.setAttribute("class", "ListIcon");
      newImage.appendChild(newImageRaw);
      //-----------------------
      //SPELL NAME
      var newName = newRow.insertCell();
      const jsonAnchor = document.createElement("a");
      var newNameText = document.createTextNode(spellName);
      newName.appendChild(jsonAnchor);
      var jsonlink =
        "http://localhost:8080/Pages/SpellPage.html?FileName=" + spellName;
      jsonAnchor.setAttribute("href", jsonlink);
      jsonAnchor.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        fetchData(spellName.replace("/", "-"));
      });
      jsonAnchor.appendChild(newNameText);
      newName.setAttribute("class", "bold");
      //-----------------------
      //SPELL LEVEL
      var newLevel = newRow.insertCell();
      var newLevelText = document.createTextNode(checklevel(data[prop].level));
      newLevel.appendChild(newLevelText);
      //-----------------------
      //SPELL SCHOOL
      var newSchool = newRow.insertCell();
      var newSchoolText = document.createTextNode(
        checkschool(data[prop].school)
      );
      newSchool.appendChild(newSchoolText);
      newSchool.removeAttribute("class");
      newSchool.setAttribute("class", checkschool(data[prop].school));
      //-----------------------
      //SOURCE BOOK
      var newSource = newRow.insertCell();
      var newSourceText = document.createTextNode(data[prop].source);
      newSource.appendChild(newSourceText);
      newSource.removeAttribute("class");
      newSource.setAttribute("class", data[prop].source);
      //-----------------------
    }
    //-----------------------
    //TABLE CREATE
    tblParent.appendChild(myTable);
  });

// ---------------------------------------------------------------------------------------------------------
//IMPORT SPELL
function fetchData(fileName) {
  console.log(
    "Librarians: Looking in the 'Magical Items' section, for '" + fileName + "'"
  );
  document.getElementById("spellform").reset();
  console.warn("Cleric: Casting Prestidigitation On Form...");
  fetch("http://localhost:8080/Sources/Spells/" + fileName + ".json")
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
// ---------------------------------------------------------------------------------------------------------
//EXTRACT TRANSFORM & LOAD
function runETL(obj) {
  // ---------------------------------------------------------------------------------------------------------
  //RML CUSTOM JSON
  if (obj.customIndicator == "RML") {
    console.warn("Cleric: Summoning Custom Shell");
    console.log(obj);
    for (const prop in obj) {
      console.log(`${prop} = ${obj[prop]}`);
      document.getElementById(`${prop}`).value = `${obj[prop]}`;
    }
    console.warn("Cleric: Summoning Ritual Complete");
  }
  // ---------------------------------------------------------------------------------------------------------
  //JSON CONVERTER
  else {
    console.warn("Cleric: Summoning Converter Shell");
    console.log(obj);
    var object = {};
    //---------------------------------------------------------------------------------------------------------
    //CORE SPELL STATS
    if (obj.range.type == "radius") {
      var range =
        "Self (" +
        obj.range.distance.amount +
        "-" +
        obj.range.distance.type +
        " " +
        obj.range.type +
        ")";
    } else if (obj.range.distance.type == "touch") {
      var range = "Touch";
    } else if (obj.range.distance.type == "self") {
      var range = "Self";
    } else {
      var range = obj.range.distance.amount + " " + obj.range.distance.type;
    }
    if (obj.components.v == true) {
      var Verbal = "V";
    } else {
      var Verbal = "";
    }
    if (obj.components.s == true) {
      var Somatic = ", S";
    } else {
      var Somatic = "";
    }
    if (obj.components.m != undefined) {
      if (obj.components.m.text != undefined) {
        var Material = ", M (" + obj.components.m.text + ")";
      } else if (obj.components.m != undefined) {
        var Material = ", M (" + obj.components.m + ")";
      } else {
        var Material = ", M";
      }
    } else {
      var Material = "";
    }
    let components = Verbal + Somatic + Material;
    if (components.charAt(0) == ",") {
      components = components.substring(2);
    }
    if (obj.duration[0].type == "instant") {
      var duration = "Instant";
    } else if (obj.duration[0].type == "permanent") {
      var duration = "Until dispelled";
    } else {
      var duration =
        obj.duration[0].duration.amount + " " + obj.duration[0].duration.type;
    }
    if (obj.duration[0].concentration != undefined) {
      var concentration = "Yes";
    } else {
      var concentration = undefined;
    }

    if (obj.savingThrow != undefined) {
      var savingThrow = datacleanse(obj.savingThrow);
    } else if (obj.spellAttack != undefined) {
      if (obj.spellAttack == "M") {
        var savingThrow = "Melee";
      } else {
        var savingThrow = "Ranged";
      }
    } else {
      var savingThrow = undefined;
    }
    //---------------------------------------------------------------------------------------------------------
    //CLASSES CODE
    let classOut = [];
    if (obj.classes != undefined) {
      var classList = obj.classes.fromClassList;
      var classLength = classList.length;
      for (var i = 0; i < classLength; i++) {
        if (classList[i].source.startsWith("UA") != true) {
          classOut.push({ class: classList[i].name });
        }
      }
    }
    //---------------------------------------------------------------------------------------------------------
    //ENTRIES CODE
    let entriesOut = [];
    var entriesList = obj.entries;
    var entriesLength = entriesList.length;

    for (var i = 0; i < entriesLength; i++) {
      var entry = entriesList[i];

      if (entry.type === "list") {
        var listItems = entry.items;
        var listLength = listItems.length;

        for (var j = 0; j < listLength; j++) {
          entriesOut.push({ data: "#" + datacleanse(listItems[j]) });
        }
      } else if (entry.name !== undefined) {
        entriesOut.push({
          name: entry.name,
          data: datacleanse(entry.entries),
        });
      } else {
        entriesOut.push({ data: datacleanse(entry) });
      }
    }
    if (obj.entriesHigherLevel != undefined) {
      var entriesHigherLevel = datacleanse(obj.entriesHigherLevel[0].entries);
    } else {
      var entriesHigherLevel = undefined;
    }
    //---------------------------------------------------------------------------------------------------------
    //MAPPING CODE
    object["name"] = obj.name;
    object["school"] = checkschool(obj.school);
    object["level"] = obj.level;
    object["time"] = obj.time[0].number + " " + obj.time[0].unit;
    object["range"] = range;
    object["components"] = components;
    object["duration"] = duration;
    object["concentration"] = concentration;
    object["savingThrow"] = savingThrow;
    var classOutLength = classOut.length;
    for (var i = 0; i < classOutLength; i++) {
      object["class" + [i]] = classOut[i].class;
    }
    var entriesOutLength = entriesOut.length;
    for (var i = 0; i < entriesOutLength; i++) {
      object["S" + [i] + "H"] = entriesOut[i].name;
      object["S" + [i] + "D"] = entriesOut[i].data;
    }
    object["entriesHigherLevel"] = entriesHigherLevel;
    object["source"] = obj["source"];
    object["page"] = obj["page"];
    console.log(object);
    // ---------------------------------------------------------------------------------------------------------
    // Extract File
    let outputJson = JSON.stringify(object); //turn the object into json
    document.getElementById("spellform").reset();
    const objct = JSON.parse(outputJson);
    for (const prop in objct) {
      console.log(`${objct[prop]}`);
      document.getElementById(`${prop}`).value = `${objct[prop]}`;
    }
    console.warn("Cleric: Summoning Ritual Complete");
  }
}

// ---------------------------------------------------------------------------------------------------------
//SPELL INPUT
function showInput() {
  //-----------------------
  //CLEAR CORE VALUES
  document.getElementById("spellImage").setAttribute("src", "");
  document.getElementById("concentration-out").setAttribute("src", "");
  document.getElementById("saveIcon-out").setAttribute("src", "");
  //-----------------------
  document.getElementById("name-out").innerHTML =
    document.getElementById("name").value;
  //-----------------------
  document.getElementById("SLvlType-out").innerHTML =
    checklevel(document.getElementById("level").value) +
    " - " +
    document.getElementById("school").value;
  //-----------------------
  document
    .getElementById("spellImage")
    .setAttribute(
      "src",
      "http://localhost:8080/EnchantedForge/ImageAssets/SpellIcons/" +
        document.getElementById("name").value.replace(/\//g, "-") +
        ".png"
    );
  //-----------------------
  document.getElementById("time-out").innerHTML =
    document.getElementById("time").value;
  document.getElementById("range-out").innerHTML =
    document.getElementById("range").value;
  document.getElementById("components-out").innerHTML =
    document.getElementById("components").value;
  var Concentration = document.getElementById("concentration").value;
  var Duration = document.getElementById("duration").value;
  if (Concentration == "Yes") {
    console.log("Sorcerer: This spell requires some serious concentration...");
    document
      .getElementById("concentration-out")
      .setAttribute(
        "src",
        "/EnchantedForge/ImageAssets/CoreSpellIcons/concentration.png"
      );
    document
      .getElementById("concentration-out")
      .setAttribute("class", "conicon");
    document.getElementById("duration-out").innerHTML =
      "Concentration, " + Duration;
  } else {
    document
      .getElementById("concentration-out")
      .setAttribute(
        "src",
        "/EnchantedForge/ImageAssets/CoreSpellIcons/concentration.png"
      );
    document
      .getElementById("concentration-out")
      .setAttribute("class", "hidden");
    document.getElementById("duration-out").innerHTML = Duration;
  }
  //-----------------------
  if (document.getElementById("savingThrow").value == "") {
    document.getElementById("save-heading").innerHTML = "Attack/Save: ";
    document.getElementById("savingThrow-out").innerHTML = "--";
  } else if (
    document.getElementById("savingThrow").value == "Ranged" ||
    document.getElementById("savingThrow").value == "Melee"
  ) {
    var saveType = document.getElementById("savingThrow").value;
    document.getElementById("save-heading").innerHTML = "Attack Type: ";
    document.getElementById("savingThrow-out").innerHTML = saveType;
    document
      .getElementById("saveIcon-out")
      .setAttribute(
        "src",
        "/EnchantedForge/ImageAssets/CoreSpellIcons/" + saveType + ".png"
      );
    document.getElementById("saveIcon-out").setAttribute("class", "icon");
  } else {
    document.getElementById("save-heading").innerHTML = "Saving Throw: ";
    document.getElementById("savingThrow-out").innerHTML =
      document.getElementById("savingThrow").value;
  }
  //-----------------------

  for (let i = 0; i <= 8; i++) {
    const index = `S${i}`;
    const headerInput = document.getElementById(`${index}H`);
    const headerOutput = document.getElementById(`${index}H-out`);
    const dataInput = document.getElementById(`${index}D`);
    const dataOutput = document.getElementById(`${index}D-out`);

    headerOutput.innerHTML = headerInput.value;
    headerOutput.classList.toggle("TopMargin", headerInput.value !== "");

    const inputValue = dataInput.value;
    const firstChar = inputValue.charAt(0);

    if (inputValue !== "") {
      if (firstChar === "#") {
        dataOutput.classList.add("listPoint", "BottomMargin");
        dataOutput.innerHTML = inputValue.substring(1);
      } else {
        dataOutput.classList.remove("listPoint");
        dataOutput.classList.add("BottomMargin");
        dataOutput.innerHTML = inputValue;
      }
    } else {
      dataOutput.classList.remove("listPoint", "BottomMargin");
    }
  }

  //--------------------
  if (document.getElementById("entriesHigherLevel").value != "") {
    console.log("Sorcerer: A strong spell...");
    document.getElementById("HigherHide").classList.remove("hidden");
    document.getElementById("HigherHide").classList.add("TopMargin");
    document.getElementById("higherLevelH-out").innerHTML = "At Higher Levels:";
    document.getElementById("entriesHigherLevel-out").innerHTML =
      document.getElementById("entriesHigherLevel").value;
  } else {
    console.log("Sorcerer: This spell is for the weak...");
    document.getElementById("higherLevelH-out").innerHTML = "";
    document.getElementById("HigherHide").classList.add("hidden");
    document.getElementById("HigherHide").classList.remove("TopMargin");
  }

  //--------------------
  for (let i = 0; i <= 8; i++) {
    const input = document.getElementById(`class${i}`);
    const output = document.getElementById(`class${i}-out`);

    output.innerHTML = input.value;
  }
  //--------------------
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
  var form = new FormData(document.getElementById("spellform")); //loads the document into a form object based on it being the parent of the button (button is the div here because i'm lazy)
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

// ---------------------------------------------------------------------------------------------------------
//UNIDENTIFIED
function encode() {
  document.getElementById("name-out").setAttribute("class", "HeadEncrypt");
  document.getElementById("HigherHide").classList.add("hidden");
  document.getElementById("HigherHide").classList.remove("TopMargin");
  const attributes = [
    "time-out",
    "range-out",
    "components-out",
    "duration-out",
    "savingThrow-out",
  ];
  attributes.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("encrypt");
    }
  });

  document.getElementById("item-container").classList.add("encrypt");

  const encryptBold = [
    "S0H-out",
    "S1H-out",
    "S2H-out",
    "S3H-out",
    "S4H-out",
    "S5H-out",
    "S6H-out",
    "S7H-out",
    "S8H-out",
    "S0D-out",
    "S1D-out",
    "S2D-out",
    "S3D-out",
    "S4D-out",
    "S5D-out",
    "S6D-out",
    "S7D-out",
    "S8D-out",
  ];
  encryptBold.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute("class", "hidden");
    }
  });
  document
    .getElementById("spellImage")
    .setAttribute(
      "src",
      "http://localhost:8080/EnchantedForge/ImageAssets/CoreSpellIcons/identify.png"
    );
}
