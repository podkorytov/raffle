var userDataObject = {},
    socket = io(),
    rightCode = true;

socket.on('registration_error', function(msg) {
    rightCode = false;
    console.log(msg);
});

socket.on('in_corp', function(msg) {
    console.log(msg);
    var a = $('#user_id').text();
    if (msg == a) {
        step4ext();
    } else {
        step2();
    }
});

function step2() {
    $('#step1').animate({'left': '-100%'});
    $('#step2').animate({'left': 0});
    startAnimation1();
    setTimeout(function() {
        startButton(event);
        console.log('voice recognition started')
    }, 1000)
}
function step3() {
    $('#step2').animate({'left': '-100%'});
    $('#step3').animate({'left': 0});
    startTimer();
}
function step4() {
    $('#step3').animate({'left': '-100%'});
    $('#step4').animate({'left': 0});
    //startAnimation3();
    setTimeout(function() {
        location.reload();
    },5000);
}
function step4ext() {
    $('#step1').animate({'left': '-100%'});
    $('#step4').animate({'left': 0});
    //startAnimation3();
        setTimeout(function() {
        location.reload();
    },5000);
}

function startTimer() {
    var time = 4;
    var timerInterval = setInterval(function() {
        if (time > 0) {
            $('#timer').text(time);
            time--;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
    setTimeout(function() {
        flashBg();
        userDataObject.name = $('#name').text();
        userDataObject.code = $('#user_id').text();
        userDataObject.img_content = captureVideoToImg();
        userDataObject.in_corp = true;
        $('#newGuyData').val(JSON.stringify(userDataObject));
        sendSocket();
        step4();
    }, 5000)
}

function sendSocket() {
    var data = $('#newGuyData').val();
    socket.emit('registration', data);
}

function captureVideoToImg() {
    var videoForCapturing = document.querySelector('#v');
    var canvasVideo = document.createElement('canvas');
    canvasVideo.width = 1024;
    canvasVideo.height = 768;
    var ctx = canvasVideo.getContext('2d');
    ctx.fillRect(0, 0, canvasVideo.width, canvasVideo.height);
    ctx.drawImage(videoForCapturing, 0, 0, canvasVideo.width, canvasVideo.height);
    return canvasVideo.toDataURL('image/png');
}

// Animations
function startAnimation1() {
    $('.animations').find('.kot').animate({'bottom': 0}, 200);
}

function flashBg() {
    $('body').css('background', '#fff');
    setTimeout(function() {
        $('body').css('background', '#000');
    }, 200);
}
