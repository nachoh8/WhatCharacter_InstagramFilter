//==============================================================================
// Developed by: Ignacio Herrera Seara
// Instagram: @nachohseara
//==============================================================================

/// Load Packages
const Scene = require('Scene');
const Textures = require('Textures');
const Random = require('Random');
const Time = require('Time');
const CameraInfo = require('CameraInfo');
const Locale = require('Locale');
export const Diagnostics = require('Diagnostics');

/// Const Scene vars
const planePic = Scene.root.find('planePicture');
const materialPic = planePic.material;

/// Set Language Question by language(ISO 639-1) and region(ISO 3166-1) from device
const localeSet = Locale.fromDevice.split('_'); // localSet = [language, region]

switch (localeSet[0]) {
    case 'es': // Spanish
        if (localeSet[1] === 'ES') { // Spain
            materialPic.diffuse = Textures.get('question_es');
            Diagnostics.log('Hola_es ' + localeSet);
        } else { // Latin America
            materialPic.diffuse = Textures.get('question_es_lat');
            Diagnostics.log('Hola_lat ' + localeSet);
        }
      break;
    case 'it': // Italian
        materialPic.diffuse = Textures.get('question_it');
        Diagnostics.log('Ciao ' + localeSet);
        break;
    default: // English
        materialPic.diffuse = Textures.get('question_en');
        Diagnostics.log('Hello ' + localeSet);
        break;
}

/// Create array of pictures

// shuffle randomly 'array'
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

// n: number of pictures; returns a list with the names(picN, 1<=N<=n) of the pictures
function generateList(n) {
    var l = [];
    for (var i = 0; i < n; i++) {
        l.push('pic' + (i+1));
    }
    return shuffle(l);
}

const nPic = 19; // number of pictures to select
var lPic = generateList(nPic); // list of the pictures
Diagnostics.log(lPic);

/// Set time(in ms) settings and change/select picture functions
const timeInit = 1500;
const timePicChange = 75;
const timeStop = 3000 + Math.floor(Random.random() * 4)*1000;

Diagnostics.log("Time to finish: " + timeStop);

var next = 0; // next picture to show
var intervalTime = null;

// Wait timeInit to start
function initPictures() {
    intervalTime = Time.setInterval(changePicture, timePicChange);
    Time.setTimeout(stopIntervalTime, timeStop);
}

// Change texture of planePic every timePicChange ms
function changePicture() {
    materialPic.diffuse = Textures.get(lPic[next]);
    next = (next+1)%nPic;
}

// Stop change the texture
function stopIntervalTime() {
    Time.clearInterval(intervalTime);
    Diagnostics.log("END");
}

///////////// MAIN /////////////
CameraInfo.isRecordingVideo.monitor().subscribeWithSnapshot({isRecording: CameraInfo.isRecordingVideo},
    function(snapshot) {
        if (snapshot.newValue == true && snapshot.oldValue == false) {
            Time.setTimeout(initPictures, timeInit);
        }
})