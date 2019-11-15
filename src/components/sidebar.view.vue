<template>
  <div>

    <div class="mb-2">
      <h5>Active Datasets:</h5>
      <ul class="list-group list-group-flush bg-light p-2" style="border-radius: 4px;">
        <li class="list-group-item bg-light" v-for="loadedFile in loadedFiles">
          <button @click.prevent="removeAsset(loadedFile)" class="btn"><i class="fa fa-window-close"></i></button>
          <button @click.prevent="downloadData(loadedFile)" class="btn"><i class="fa fa-download"></i></button>
          &nbsp;&nbsp; 
          {{loadedFile}}
        </li>
      </ul>
    </div>

    <hr><hr>

    <div class="mb-2">
      <form>
        <div class="form-group">
          <h5>Add Datasets:</h5>
          <b>Antennae Deployment:</b><br/>
          <input type="file" class="form-control-file" ref="paramsFile">
          <b>Measured Data:</b><br/>
          <input type="file" class="form-control-file" ref="inpFile">
        </div>
      </form>
      <button class="form-control btn btn-primary" @click.prevent="load">Load</button>
    </div>

    <hr><hr>

    <div class="pl-3 pr-2">

      <div class="row mb-2">
        <div class="col-lg-2 col-xs-2" style="background-color: black; border-radius: 4px; height: 60px; opacity: 0.4">
        </div>
        <div class="col-lg-10 col-xs-10">
          <p class="mt-2">
            No data
          </p>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-lg-2 col-xs-2" style="background-color: red; border-radius: 4px; height: 60px; opacity: 0.4">
        </div>
        <div class="col-lg-10 col-xs-10">
          <p class="mt-2">
            Poor
          </p>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-lg-2 col-xs-2" style="background-color: orange; border-radius: 4px; height: 60px; opacity: 0.4">
        </div>
        <div class="col-lg-10 col-xs-10">
          <p class="mt-2">
            OK
          </p>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-lg-2 col-xs-2" style="background-color: green; border-radius: 4px; height: 60px; opacity: 0.4">
        </div>
        <div class="col-lg-10 col-xs-10">
          <p class="mt-2">
            Good
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { async } from 'q';

// ref: https://blog.shovonhasan.com/using-promises-with-filereader/
const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};


let loadedMarkers = {};
let loadedHmpRefs = {};
let loadedDatasets = {};
let loadedAntanne = {};


let colToSignStrDict = {
  "black": "No Signal.",
  "green": "Good reception.",
  "orange": "OK reception.",
  "red": "Poor reception."
}

let colToSignMsgDict = {
  "black": "Move towards an area with better reception.",
  "green": "You can use text, voice and video.",
  "orange": "You can use text reliably; voice communication will be OK.",
  "red": "Prefer text communication."
}

let colToSignEmjDict = {
  "black": "🚫",
  "green": "👍",
  "orange": "🤷",
  "red": "👎"
}


function csvToArray(csvText) {
  let retArr = [];
  let arr1 = csvText.split('\n');
  for(let i=0; i<arr1.length; i++) {
    let arr2 = arr1[i].split(',');
    retArr.push(arr2);
  }
  return retArr;
}


function get_voice_quality(value) {
  if (Number.isNaN(value)) return "No"
  if (value > -105) return "Good"
  else if (value <= -105 && value > -110) return "Maybe"
  else if (value <= -110) return "No"
  return "No"
}


function get_video_quality(value) {
  if (Number.isNaN(value)) return "No"
  value = parseInt(value)
  if (value > -100) return "Good"
  else if (value <= -100 && value > -110) return "Maybe"
  else if (value <= -110) return "No"
  return "No"
}


let DEC = 8;


function get_distance(x1, x2, y1, y2) {
  return Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) ).toFixed(DEC)
}


function get_antennae_coords(paramsFileCont) {
  let params = csvToArray(paramsFileCont);
  let x1 = parseFloat(params[3][1]) || 39.61590167 // Lat
  let y1 = parseFloat(params[4][1]) || -107.0154867 // Lon
  return { antLat: x1, antLon: y1 };
}



async function calcs(dataFile, paramFile) {

  let params = csvToArray(paramFile);
  let data = csvToArray(dataFile);

  let Pt = parseFloat(params[2][1]) || 37;
  let Gt = parseFloat(params[6][1]) || 3.5;
  let Gr = 1.5;
  let x1 = parseFloat(params[3][1]) || 39.68869167;
  let y1 = parseFloat(params[4][1]) || -106.9443733;
  let log_w_lambda = 20 * Math.log( ( 4 * Math.PI )/(0.39));
  let cable_loss = 2.7;
  let calibration = -193.83904729353845;
  


  function link_budget(x2, y2) {
    let r = get_distance(x1, x2, y1, y2);
    let log_w_radius = (20 * Math.log(r)).toFixed(DEC)
    let Pr = (Pt + Gt + Gr - log_w_lambda - log_w_radius - cable_loss + calibration).toFixed(DEC)
    return Pr
  }
  
  
  let retStr = "";
  retStr += "Data Point,Latitude,Longitude,Altitude,RSRP,Text,Voice,Video\n"

  for(let i=1; i<data.length; i++) {
    let altitude = parseFloat(data[i][3]);
    let x2 = parseFloat(data[i][1]);
    let y2 = parseFloat(data[i][2]);
    let semi_final_budget = link_budget(x2, y2);
    let isNoSignal = (data[i][4] === 'No Signal');
    let isEmpty = data[i][4] === '';
    let rsrp_original = parseFloat(data[i][4])
    let current_link_budget = (isNoSignal) ? 'No Signal' : (!isEmpty) ? rsrp_original : semi_final_budget;
    let text_qual = get_voice_quality(current_link_budget);
    let voice_qual = get_voice_quality(current_link_budget);
    let vid_qual = get_video_quality(current_link_budget);
    let dataPtStr = `${i},${x2},${y2},${altitude},${current_link_budget},${text_qual},${voice_qual},${vid_qual}`
    retStr += `${dataPtStr}\n`
  }

  return retStr;
}



function get_max_r(x1, y1, data) {
  let ret = 0;
  
  for(let i=1; i<data.length-1; i++) {
    let x2 = parseFloat(data[i][1]);
    let y2 = parseFloat(data[i][2]);
    let r = get_distance(x1, x2, y1, y2);
    if (r > ret) ret = r;
  }
  
  return ret;
}



async function polarCalc(dataFile, paramFile) {

  let params = csvToArray(paramFile);
  let data = csvToArray(dataFile);

  let Pt = parseFloat(params[2][1]) || 37;
  let Gt = parseFloat(params[6][1]) || 3.5;
  let Gr = 1.5;
  let x1 = parseFloat(params[3][1]) || 39.68869167;
  let y1 = parseFloat(params[4][1]) || -106.9443733;
  let log_w_lambda = 20 * Math.log( ( 4 * Math.PI )/(0.39));
  let cable_loss = 2.7;
  let calibration = -193.83904729353845;

  let max_r = get_max_r(x1, y1, data) * 1.3;

  let polPts = [];

  let iDivs = 30;
  let jDivs = 30;

  for(let i=0; i<iDivs; i++) {
    let iFac = (i/iDivs);
    let ang = (2 * Math.PI) * iFac;
    for(let j=0; j<jDivs; j++) {

      ang = ang + (1.618 * j);
      let dist = max_r * (Math.sqrt(1-Math.sqrt(Math.random())));
      let x2 = x1 + dist;
      let y2 = y1;
      let s = Math.sin(ang);
      let c = Math.cos(ang);
      let nx = (c * (x2 - x1)) + (s * (y2 - y1)) + x1;
      let ny = (c * (y2 - y1)) - (s * (x2 - x1)) + y1;
      polPts.push([nx, ny]);
    }
  }

  
  function link_budget(x2, y2) {
    let r = get_distance(x1, x2, y1, y2);
    let log_w_radius = (20 * Math.log(r)).toFixed(DEC)
    let Pr = (Pt + Gt + Gr - log_w_lambda - log_w_radius - cable_loss + calibration).toFixed(DEC)
    return Pr
  }
  
  
  let retStr = "";
  retStr += "Data Point,Latitude,Longitude,Altitude,RSRP,Text,Voice,Video\n"

  for(let i=1; i<polPts.length; i++) {
    let altitude = 0;
    let x2 = polPts[i][0];
    let y2 = polPts[i][1];
    let semi_link_budget = link_budget(x2, y2);
    let current_link_budget = semi_link_budget;
    if(current_link_budget > -140) {
      let text_qual = get_voice_quality(current_link_budget);
      let voice_qual = get_voice_quality(current_link_budget);
      let vid_qual = get_video_quality(current_link_budget);
      let dataPtStr = `${i},${x2},${y2},${altitude},${current_link_budget},${text_qual},${voice_qual},${vid_qual}`
      retStr += `${dataPtStr}\n`;
    }
  }

  return retStr;
}


// ref: https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


let BRK_1 = -120;
let BRK_2 = -110;
let BRK_3 = -105;
let BRK_4 = -102;



async function ptToHmpPt(lat, long, rsrp) {
  let rsrp_remapped = remap(rsrp, BRK_1, BRK_3, 0, 2);
  let ret = {
    "type": "Feature",
    "properties": {
      "rsrp": rsrp,
      "rsrp-remapped": rsrp_remapped,
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        long,
        lat
      ]
    }
  };

  return ret;
}


export default {
  data: function() {
    return {
      loadedFiles: []
    }
  },
  mounted: async function() {
    let flsv_rsrc = await fetch("/FileSaver.js");
    let flsv_text = await flsv_rsrc.text();
    eval.apply(window, [flsv_text]);
    let seed_rsrc = await fetch("/seedrandom.min.js");
    let seed_text = await seed_rsrc.text();
    eval.apply(window, [seed_text]);
    Math.seedrandom("TechToProtect");
  },
  methods: {
    load: async function() {

      if (this.$refs.inpFile.files.length != 1) return;
      let upFile = this.$refs.inpFile.files[0];
      let dataFileCont = await readUploadedFileAsText(upFile);

      
      if (this.$refs.paramsFile.files.length != 1) return;
      let paramsFile = this.$refs.paramsFile.files[0];
      let paramsFileCont = await readUploadedFileAsText(paramsFile);


      let fileName = upFile.name;
      let dnFile = await calcs(dataFileCont, paramsFileCont);
      let { antLat, antLon } = get_antennae_coords(paramsFileCont);

      let fulldata = dnFile.split('\n');

      let addedMarkers = [];

      let sz = 30;

      let hmpPts = [];
      
      let polarData = await polarCalc(dataFileCont, paramsFileCont);
      let polPtsData = polarData.split('\n');

      for (let i=1; i < polPtsData.length-1; i++) {

        try {

          let currentLine = polPtsData[i].split(',');
          let lat = parseFloat(currentLine[1]);
          let long = parseFloat(currentLine[2]);
          let noSignal = (currentLine[4] === 'No Signal' || currentLine[4] === '')
          let rsrp = (noSignal) ? null : parseFloat(currentLine[4]);

          if (rsrp !== null) {
            let hmpPt = await ptToHmpPt(lat, long, rsrp);
            hmpPts.push(hmpPt);
          }
          
          let color = (rsrp === null) ? 'black' : (rsrp > -100) ? 'green' : (rsrp > -110) ? 'orange' : 'red';

          let markerEl = document.createElement('p')
          markerEl.innerHTML = `<p style="width: ${sz/4}px; height: ${sz/4}px; border-radius: ${sz/8}px; opacity: 0.4; background-color: ${color};"></p>`

          let signalStrText = colToSignStrDict[color];
          let signalStrMsg = colToSignMsgDict[color];
          let signalStrEmoji = colToSignEmjDict[color];
          let popup = new mapboxgl.Popup();
          popup.setHTML(`${signalStrEmoji} <b>${signalStrText}</b><br/>${signalStrMsg}`)
  
          let marker = new mapboxgl.Marker(markerEl)
            .setPopup(popup)
            .setLngLat([long, lat])
            .addTo(map);

          addedMarkers.push(markerEl);

        }
        catch(ex) {
          console.log(ex);
        }

      }
      
      for (let i =1; i < fulldata.length-1; i++) {

        try {

          let currentLine = fulldata[i].split(',');
          let lat = parseFloat(currentLine[1]);
          let long = parseFloat(currentLine[2]);
          let noSignal = (currentLine[4] === 'No Signal' || currentLine[4] === '')
          let rsrp = (noSignal) ? null : parseFloat(currentLine[4]);

          if (rsrp !== null) {
            let hmpPt = await ptToHmpPt(lat, long, rsrp);
            hmpPts.push(hmpPt);
          }

        } catch(err) {
          console.log(err);
        }
        
      }

      let hmpRef = `rsrp_${fileName}`

      let htmpFt = { "type": "FeatureCollection", "features": hmpPts };

      map.addSource(hmpRef, {
        type: "geojson",
        data: htmpFt
      });

      map.addLayer({
        id: hmpRef,
        type: "heatmap",
        source: hmpRef,
        minzoom: 12,
        maxzoom: 22,
        paint: {
          "heatmap-intensity": 9,
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 3,
            18, 60,
          ],
          "heatmap-opacity": 0.4,
          "heatmap-weight": {
            property: "rsrp-remapped",
            type: "exponential",
            stops: [
              [0, 0.1],
              [0.2, 4],
              [0.5, 8]
            ]
          },
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "black",
            0.1, "red",
            0.8, "yellow",
            1.6, "green"
          ],
        }
      }, "waterway-label");

      let antmarkerEl = document.createElement('p')
      antmarkerEl.innerHTML = `<p style="width: ${sz}px; height: ${sz}px; border-radius: ${sz/2}px; background-color: yellow; border: 1px solid black;"></p>`
      let antmarker = new mapboxgl.Marker(antmarkerEl)
        .setLngLat([antLon, antLat])
        .addTo(map);

      map.flyTo({ center: [antLon, antLat], zoom: 14 });

      loadedAntanne[fileName] = antmarker;
      loadedMarkers[fileName] = addedMarkers;
      loadedHmpRefs[fileName] = hmpRef;
      loadedDatasets[fileName] = dnFile;
      this.loadedFiles.push(fileName);

    },
    removeAsset: async function(fileName) {

      if (loadedMarkers[fileName] !== undefined) {
        let assetsToRemove = loadedMarkers[fileName];
        for(let i = 0; i<assetsToRemove.length; i++) {
          assetsToRemove[i].remove();
        }
        map.removeLayer(loadedHmpRefs[fileName]);
        map.removeSource(loadedHmpRefs[fileName]);
        loadedAntanne[fileName].remove();
        delete loadedMarkers[fileName];
        delete loadedDatasets[fileName];
        this.loadedFiles.splice(this.loadedFiles.indexOf(fileName), 1);
      }
      
    },
    downloadData: async function(fileName) {
      let fileToDl = loadedDatasets[fileName];
      let file = new File([fileToDl], `${fileName}_beamed.csv`, {type: "text/plain"});
      saveAs(file);
    }
  }
}
</script>

<style scoped>

</style>