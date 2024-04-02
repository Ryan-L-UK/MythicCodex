const { spawnSync } = require("child_process");

function runFile(file) {
  spawnSync("node", [file], { stdio: "inherit" });
}

console.log(`
-----------------------------------------------------------------------
-----------------------------------------------------------------------
   dMMMMMP .dMMMb  .aMMMb  dMMMMb         dMP    .aMMMb  .aMMMb  dMMMMb 
      dMP dMP" VP dMP"dMP dMP dMP        dMP    dMP"dMP dMP"dMP dMP VMP  
     dMP  VMMMb  dMP dMP dMP dMP        dMP    dMP dMP dMMMMMP dMP dMP  
dK .dMP dP .dMP dMP.aMP dMP dMP        dMP    dMP.aMP dMP dMP dMP.aMP   
VMMMP"  VMMMP"  VMMMP" dMP dMP        dMMMMMP VMMMP" dMP dMP dMMMMP"
-----------------------------------------------------------------------
-----------------------------------------------------------------------`);

console.log("Sourcing New JSON Source Files");
runFile("./DataDruid/1.SourceNewFiles.js");

console.log(
  "-----------------------------------------------------------------------"
);
console.log("Splitting JSON Files");
runFile("./DataDruid/2.SplitSourceFiles.js");

console.log(
  "-----------------------------------------------------------------------"
);
console.log("Clensing New Item Files");
runFile("./DataDruid/3.CleanseNewItems.js");

console.log(
  "-----------------------------------------------------------------------"
);
console.log("Moving New Creatures Files");
runFile("./DataDruid/4.MoveNewCreatures.js");
console.log(
  "-----------------------------------------------------------------------"
);
