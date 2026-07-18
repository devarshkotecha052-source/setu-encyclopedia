const fs = require('fs');

const oldMap = fs.readFileSync('old_map.txt', 'utf8');
const startIndex = oldMap.indexOf('<svg');
const endIndex = oldMap.indexOf('</svg>') + 6;
const rawOldSvg = oldMap.substring(startIndex, endIndex);

const dStart = rawOldSvg.indexOf('d="M');
const dEnd = rawOldSvg.indexOf('"', dStart + 3);
const indiaPathD = rawOldSvg.substring(dStart + 3, dEnd);

const newSvgBlock = `
            <div class="geo-map-inner" style="position: relative; width: 100%; aspect-ratio: 1 / 1; max-width: 600px; margin: 0 auto;">
              <svg class="geo-base-map" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%;">
                <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                  <path class="india-outline" style="fill:rgba(66,202,205,0.1); stroke:rgba(66,202,205,0.3); stroke-width:15;" d="` + indiaPathD + `" />
                </g>
                
                <!-- SVG Paths overlay for API network -->
                <g class="geo-routes layer-network">
                  <!-- BLR(307,737) to BOM(184,563) -->
                  <path id="route-blr-bom" class="geo-path" d="M 307,737 Q 150,650 184,563" />
                  <circle class="geo-packet"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#route-blr-bom"/></animateMotion></circle>
                  
                  <!-- BLR(307,737) to DEL(286,307) -->
                  <path id="route-blr-del" class="geo-path" d="M 307,737 Q 200,500 286,307" />
                  <circle class="geo-packet" style="animation-delay:0.5s;"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#route-blr-del"/></animateMotion></circle>
                  
                  <!-- BLR(307,737) to HYD(317,614) -->
                  <path id="route-blr-hyd" class="geo-path" d="M 307,737 Q 350,650 317,614" />
                  <circle class="geo-packet" style="animation-delay:1s;"><animateMotion dur="1.5s" repeatCount="indefinite"><mpath href="#route-blr-hyd"/></animateMotion></circle>
                  
                  <!-- BLR(307,737) to MAA(358,747) -->
                  <path id="route-blr-maa" class="geo-path" d="M 307,737 Q 350,750 358,747" />
                  <circle class="geo-packet" style="animation-delay:0.2s;"><animateMotion dur="1s" repeatCount="indefinite"><mpath href="#route-blr-maa"/></animateMotion></circle>
                </g>
              </svg>
              
              <!-- Absolute Hubs (Percentages of the 1:1 container exactly match the 1024 viewBox) -->
              <div class="geo-hub hq layer-hq" style="top: 72%; left: 30%;" data-hub="blr" data-year="2018">
                <div class="geo-beacon"></div>
                <span>Bengaluru</span>
              </div>
              
              <div class="geo-hub layer-banks" style="top: 55%; left: 18%;" data-hub="bom" data-year="2019">
                <div class="geo-pulse"></div>
                <span>Mumbai</span>
              </div>
              
              <div class="geo-hub layer-stack" style="top: 30%; left: 28%;" data-hub="del" data-year="2020">
                <div class="geo-pulse"></div>
                <span>Delhi (UIDAI)</span>
              </div>
              
              <div class="geo-hub layer-banks" style="top: 60%; left: 31%;" data-hub="hyd" data-year="2021">
                <div class="geo-pulse"></div>
                <span>Hyderabad</span>
              </div>
              
              <div class="geo-hub layer-stack" style="top: 73%; left: 35%;" data-hub="maa" data-year="2022">
                <div class="geo-pulse"></div>
                <span>Chennai (AA)</span>
              </div>
            </div>
`;

let indexHtml = fs.readFileSync('index.html', 'utf8');

const startTarget = '<svg class="geo-base-map"';
const endTarget = '</div>\n          </div>'; // Close wrapper

const startIndex2 = indexHtml.indexOf(startTarget);
// Find the closing div of geo-map-wrapper. Wait, since I'm replacing the SVG and the hubs, I'll just regex replace the inner contents of geo-map-wrapper.
const wrapperRegex = /<div class="geo-map-wrapper">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Contextual Info/;

const match = indexHtml.match(wrapperRegex);
if (match) {
    const finalHtml = indexHtml.replace(match[1], '\n' + newSvgBlock + '\n          ');
    fs.writeFileSync('index.html', finalHtml);
} else {
    console.log("Could not find geo-map-wrapper inner contents.");
}
