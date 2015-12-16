function step2() {
    $('#step1').animate({'left' : '-100%'});
    $('#step2').animate({'left' : 0});
    startAnimation1();
    startButton(event);
}
function step3() {
    $('#step2').animate({'left' : '-100%'});
    $('#step3').animate({'left' : 0});
    //startAnimation2();
    startTimer();
}
function step4() {
    $('#step3').animate({'left' : '-100%'});
    $('#step4').animate({'left' : 0});
    //startAnimation3();
}

function startTimer() {
    var time = 4;
    var timerInterval = setInterval(function() {
        if (time > 0) {
            $('#timer').text(time);
            time--;
        }
    }, 1000);
    setTimeout(function() {
        flashBg();
        captureVideoToImg();
        step4();
    },5000)
}

function captureVideoToImg() {
    var videoForCapturing = document.querySelector('#v');
    var canvasVideo = document.createElement('canvas');
    canvasVideo.width = 1024;
    canvasVideo.height = 768;
    var ctx = canvasVideo.getContext('2d');
    ctx.fillRect(0,0,canvasVideo.width,canvasVideo.height);
    ctx.drawImage(videoForCapturing, 0, 0, canvasVideo.width, canvasVideo.height);
    var dataURI = canvasVideo.toDataURL('image/jpeg');
    $('#userpic').attr('src', dataURI);
}

// Animations
function startAnimation1() {
    $('.animations').find('.kot').animate({'bottom' : 0}, 200);
}
function flashBg() {
    $('body').css('background', '#fff');
    setTimeout(function() {
        $('body').css('background', '#000');
    }, 200);
}


// Onload
$(function () {
    setTimeout(function () {
        //doDetection();
    }, 1000);
});