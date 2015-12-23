var gCtx = null;
var gCanvas = null;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;
var vidhtml = '<video id="v"></video>';

function initCanvas(w, h) {
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}

function captureToCanvas() {
    if (stype != 1)
        return;
    if (gUM) {
        try {
            gCtx.drawImage(v, 0, 0);
            try {
                qrcode.decode();
            }
            catch (e) {
                //console.log(e);
                setTimeout(captureToCanvas, 500);
            }
        }
        catch (e) {
            console.log(e);
            (captureToCanvas, 500);
        }
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a) {
    var sended = false;
    if (!sended) {
        document.getElementById("user_id").innerHTML = htmlEntities(a);
        step2();
        sended = true;
    }
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
    if (webkit)
        v.src = window.URL.createObjectURL(stream);
    else if (moz) {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM = true;
    setTimeout(captureToCanvas, 500);
}

function error() {
    gUM = false;
}

function load() {
    if (isCanvasSupported() && window.File && window.FileReader) {
        initCanvas(1024, 768);
        qrcode.callback = read;
        document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    }
}

function setwebcam() {
    if (stype == 1) {
        setTimeout(captureToCanvas, 500);
        return;
    }
    var n = navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v = document.getElementById("v");
    v.play();
    if (n.getUserMedia) {
        n.getUserMedia({video: true, audio: false}, success, error);
    } else if (n.webkitGetUserMedia) {
        webkit = true;
        n.webkitGetUserMedia({video: true, audio: false}, success, error);
    } else if (n.mozGetUserMedia) {
        moz = true;
        n.mozGetUserMedia({video: true, audio: false}, success, error);
    }

    stype = 1;
    setTimeout(captureToCanvas, 500);
}
