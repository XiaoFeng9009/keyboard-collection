var fs = require("fs");
var studio = fs.readFileSync("components/StudioDetail.js", "utf8");
var lines = studio.split('\n');
// Check the IC section (line ~161) and GB section (line ~165)
for (var i = 158; i < 170; i++) {
  console.log("L" + (i+1) + ": " + lines[i]);
}
