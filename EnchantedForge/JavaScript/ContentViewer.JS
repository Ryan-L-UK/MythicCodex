//-----------------------------------------
//Map Selector
//-----------------------------------------
const converter = new showdown.Converter({ extensions: ["table"] });
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const Type = urlParams.get("Type");
const FileName = urlParams.get("FileName");
console.log(
  "Librarians: Looking in the '" + Type + "' section, for '" + FileName + "'"
);
if (Type == "Location") {
  var ContentView = "Faerun/Gullet Cove/Location/" + FileName;
} else if (Type == "District") {
  var ContentView = "Faerun/Gullet Cove/District/" + FileName;
} else if (Type == "Faerun") {
  var ContentView = "Faerun/" + FileName + "/" + FileName;
} else if (Type == "Forge") {
  var ContentView = "Forge/" + FileName;
} else if (Type == "Ruleset") {
  var ContentView = "Rules/" + FileName;
} else if (Type == "Downtime") {
  var ContentView = "Downtime/" + FileName;
} else {
  console.error("Shes Dead Jim");
}

const ContentViewOut = "http://localhost:8080/Sources/" + ContentView + ".md";

const fetchAndProcessImageMap = (src, imgId) => {
  fetch(src)
    .then((response) => response.text())
    .then((imageMapHtml) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = imageMapHtml;
      const img = document.getElementById(imgId);
      img.insertAdjacentHTML("afterend", imageMapHtml);
      img.remove();
      console.log("Image map processed successfully");
    })
    .catch((error) => {
      console.log("Error processing image map:", error);
    });
};

fetch(ContentViewOut)
  .then((response) => response.text())
  .then((markdown) => {
    const html = converter.makeHtml(markdown);
    const div = document.createElement("div");
    div.innerHTML = html;
    const images = div.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute("src");
      if (src.endsWith(".html")) {
        const imgId = src.replace(/\W/g, "_"); // Generate unique ID based on the image map file name
        img.setAttribute("id", imgId);
        fetchAndProcessImageMap(src, imgId);
      } else {
        img.classList.add("markdown-image");
      }
    }

    const tables = div.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      table.classList.add("markdown-table");
    }

    document.getElementById("Content_output").innerHTML = div.innerHTML;
    console.log("Content loaded successfully...");
  })

  .catch((error) => {
    console.log(
      "Librarians: If it is not in our records, it does not exist.",
      error
    );
  })
  //-----------------------------------------
  //Menu Creator Selector
  //-----------------------------------------
  .then(function () {
    console.warn("Sourceror: Constructing Menu...");
    const collection = document.querySelectorAll("h1,h2");
    function addElement(menuselector) {
      const newDiv = document.createElement("div");
      const newAnchor = document.createElement("a");
      const newContent = document.createTextNode(menuselector);
      document.querySelector(".sidenav").appendChild(newDiv);
      newDiv.appendChild(newAnchor);
      var jumplinkspec = menuselector.replace(/[^a-zA-Z0-9 ]/g, "");
      var jumplinkCap = "#" + jumplinkspec.replaceAll(" ", "-");
      var jumplink = jumplinkCap.toLowerCase();
      console.log(elementtag + ": " + menuselector + " ---> " + jumplink);
      newAnchor.setAttribute("href", jumplink);
      if (headingtest == 0) {
        newAnchor.setAttribute("class", "menuhead");
        newAnchor.setAttribute("href", "#top");
      } else if (elementtag == "H1") {
        newAnchor.setAttribute("class", "menu");
      } else {
        newAnchor.setAttribute("class", "submenu");
      }
      newAnchor.appendChild(newContent);
    }
    for (let i = 0; i < collection.length; i++) {
      const menuselector = collection.item(i).innerHTML;
      var headingtest = i;
      var elementtag = collection.item(i).tagName;
      addElement(menuselector);
    }
    console.warn("Sourceror: Menu Constructed.");
  })
  .then(function () {
    const checker = document.getElementsByClassName("sidenav");
    const menucheck = checker.item(0).innerHTML;
    if (menucheck == 0) {
      sidenav.classList.add("hideme");
      console.warn("Menu Blank -> Status: Hidden");
    } else {
      sidenav.classList.remove("hideme");
      console.log("Menu Populated -> Status: Revealed");
    }
  });
//-----------------------------------------
//Sticky Menu Selector
//-----------------------------------------
// When the user scrolls the page, execute myFunction
window.onscroll = function () {
  myFunction();
};
// Get the sidenav
var sidenav = document.getElementById("sidenav");
// Get the offset position of the sidenav
var sticky = sidenav.offsetTop;
var stickyos = sticky - 70;
// Add the sticky class to the sidenav when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= stickyos) {
    console.log("Sourceror: Menu Locked...");
    sidenav.classList.add("sticky");
  } else {
    sidenav.classList.remove("sticky");
    console.log("Sourceror: Menu Unlocked...");
  }
}
