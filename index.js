//const data = require('./model/data');

const fs = require('fs')
const { createCanvas, loadImage } = require('canvas');
const moment = require("moment");

var myArgs = process.argv.slice(2);

if (!fs.existsSync(myArgs[0])) {
    console.log("file Not Found");
} else {

    let _JsonData =fs.readFileSync(myArgs[0],  'utf16le');
    _JsonData = _JsonData.toString().replace(/^\uFEFF/, '');
    let _data = JSON.parse(_JsonData);

    const width = 800
    const height = 533;

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d');

    context.font = 'bold 30pt Menlo'

    let podium = _data.sessionResult.leaderBoardLines.slice(0, 3);
    let bestLap = moment(_data.sessionResult.bestlap).format("mm:ss:SSS");
    //console.log( moment(data.sessionResult.bestlap).format("mm:ss:SSS"));

    infileName = myArgs[1] == null ?  "./images/acc.jpeg" : myArgs[1];
    let outfileName = myArgs[0].replace("json", "png");
    loadImage(infileName).then(image => {
        context.clearRect(0,0,width, height);
        context.fillStyle = '#000';
        context.globalAlpha = '.8';
        context.drawImage(image, 0, 0, width, height);
        context.globalAlpha = '1';
        context.fillStyle = '#fff'
        let trackName = _data.trackName.replace(/[_\d]/g, "");
        trackName = trackName.charAt(0).toUpperCase() + trackName.slice(1);
        context.font = 'underline 30pt Menlo'
        context.textAlign = 'center'
        context.fillText("Resultados Parciales", 400, 260);
        context.font = 'bold 30pt Menlo'
        context.fillText(trackName, 400, 300);

        context.textAlign = 'left';
        podium.map((x, index) => {

            context.textAlign = null;
            let text = (index + 1) + " " + x.currentDriver.firstName + " " + x.currentDriver.lastName;
            const textWidth = context.measureText(text).width;
            context.fillStyle = '#fff'
            let y = 390 + (index * 50);
            context.fillText(text, 90, y);
            switch (index + 1) {
                case 1:
                    context.fillStyle = '#FFD700';
                    break;
                case 2:
                    context.fillStyle = '#C0C0C0';
                    break
                default:
                    context.fillStyle = '#cd7f32';
                    break;
            }

            context.fillRect(60, y + 5, textWidth, 5);

            //console.log( (index +1) + ". " +   x.currentDriver.firstName + " " + x.currentDriver.lastName)
        });

        context.font = 'italic 20pt Menlo'
        context.fillStyle = '#fff'

        context.fillText("Vuelta Rapida", 600, 450)
        context.fillText(bestLap, 630, 490)

        //context.drawImage(image, width, height, width, height)
        const buffer = canvas.toBuffer('image/png');

        fs.writeFileSync(outfileName, buffer)
    }).catch( err => console.log(err) );

}