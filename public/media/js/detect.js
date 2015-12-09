var $video = $('#v');
var detected = false;

function doDetection() {
    if (!detected) {
        var interval = setInterval(function () {
            $video.faceDetection({
                interval: 1,
                async: true,
                complete: function (faces) {
                    if (faces.length) {
                        cropProps.left = (faces[0].x * faces[0].scaleX - 100);
                        cropProps.top = (faces[0].y * faces[0].scaleY - 120);
                        cropProps.width = (faces[0].width * faces[0].scaleX + 200);
                        cropProps.height = (faces[0].height * faces[0].scaleY + 240);
                        $('<div>', {
                            'class': 'face-video',
                            'css': {
                                'left': faces[0].x * faces[0].scaleX - 100 + 'px',
                                'top': faces[0].y * faces[0].scaleY - 120 + 'px',
                                'width': faces[0].width * faces[0].scaleX + 200 + 'px',
                                'height': faces[0].height * faces[0].scaleY + 240 + 'px'
                            }
                        }).insertAfter(this);
                        /*$('.img-holder').css({
                            width : faces[0].width * faces[0].scaleX + 200,
                            height : faces[0].height * faces[0].scaleY + 240
                        });
                        $('#userpic').css({
                            left : -1 * (faces[0].x * faces[0].scaleX - 100),
                            top : -1 * (faces[0].y * faces[0].scaleY - 120)
                        });*/
                        detected = true;
                        clearInterval(interval);
                        $('#info_speech').show();
                        startButton(event);
                    }
                }
            });
        }, 500);
    }
}

function showDetection() {
    $('#result').fadeIn(300);
}

function startTimer() {
    var time = 9;
    var timerInterval = setInterval(function() {
        if (time > 0) {
            $('#timer').text(time);
            time--;
        } else {
            //location.reload();
        }
    }, 1000)
}

function captureVideoToImg() {
    var videoForCapturing = document.querySelector('#v');
    var canvasVideo = document.createElement('canvas');
    canvasVideo.width = cropProps.width;
    canvasVideo.height = cropProps.height;
    var ctx = canvasVideo.getContext('2d');
    ctx.fillRect(0,0,canvasVideo.width,canvasVideo.height);
    console.log(cropProps.left + ', ' + cropProps.top + ', ' + cropProps.width + ', ' + cropProps.height);
    ctx.drawImage(videoForCapturing, cropProps.left *.7, cropProps.top*.7, cropProps.width, cropProps.height, 0, 0, 640, 640);
    var dataURI = canvasVideo.toDataURL('image/jpeg');
    $('#userpic').attr('src', dataURI);
}

$(function () {
    setTimeout(function () {
        doDetection();
    }, 1000);
});