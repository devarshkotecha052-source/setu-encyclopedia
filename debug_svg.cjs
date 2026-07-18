const fs = require('fs');

const oldMap = fs.readFileSync('old_map.txt', 'utf8');
const pathMatch = oldMap.match(/<path d="([\s\S]*?)"\/>/);
const d = pathMatch ? pathMatch[1] : '';

// Quick and dirty parser for SVG path to find min/max
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;

const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g);
let currentX = 0, currentY = 0;

if(commands) {
  commands.forEach(cmd => {
    const type = cmd[0];
    const args = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    
    if (type === 'M' || type === 'L') {
      for(let i=0; i<args.length; i+=2) {
        let x = args[i];
        let y = args[i+1];
        if (type === 'm' || type === 'l') { x += currentX; y += currentY; }
        currentX = x; currentY = y;
        minX = Math.min(minX, currentX); maxX = Math.max(maxX, currentX);
        minY = Math.min(minY, currentY); maxY = Math.max(maxY, currentY);
      }
    }
  });
}

console.log(`Path bounds: X[${minX}, ${maxX}], Y[${minY}, ${maxY}]`);
// Transform rules: X' = X/10. Y' = 1024 - Y/10.
// So X is 0 to 1024.
console.log(`Transformed Bounds:`);
console.log(`Left: ${minX/10} to ${maxX/10}`);
console.log(`Top: ${1024 - maxY/10} to ${1024 - minY/10}`);

// Assuming Kashmir is (404, 0)
// Assuming Kanyakumari is southernmost point (max transformed Y)
// We can estimate city locations based on known relative positions in India.
// India bounds: 68.7E to 97.25E (X), 8.4N to 37.6N (Y)
// Longitude width = 28.55 degrees. Latitude height = 29.2 degrees.

function getPixel(lng, lat) {
    // Map lng (68.7 to 97.25) to X (minX/10 to maxX/10)
    // Map lat (8.4 to 37.6) to Y (max Transformed Y to min Transformed Y)
    const mapMinX = 68.7; const mapMaxX = 97.25;
    const mapMinY = 8.4; const mapMaxY = 37.6;
    
    // Using empirical bounds from SVG if script above fails.
    // Let's just output the math.
}
