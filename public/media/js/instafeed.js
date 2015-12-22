/**
 * Created by a.zakharov on 17.12.2015.
 */
var hashTag = 'vsemayki';
var feedLength = 3;
var feedUpdateInterval = 60000;
var feedUpdateIntervalId = 0;
var $feed = $('#instafeed');
var token = '19182223.6e63162.3f6b8b2a656e446f99519374978261b0';
var selectTimer = 13;

function getFeed() {
    $feed.find('div').remove();

    $feed.owlCarousel({
        autoPlay: 5000,
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true,
        transitionStyle: "fade"
    });

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        url: 'https://api.instagram.com/v1/tags/' + hashTag + '/media/recent?access_token=' + token + '&count=' + feedLength,
        success: function (data) {
            var n = 0;
            for (var postIdx in data.data) {
                if (data.data.hasOwnProperty(postIdx)) {
                    var post = data.data[postIdx];
                    var $div = $('<div/>').addClass('onephoto')
                        .append($('<img/>').addClass('img').attr('src', post.images.standard_resolution.url))
                        .append($('<div/>').addClass('info')
                            .append($('<p>').addClass('user')
                                .append($('<img/>').addClass('userpic').attr('src', post.user.profile_picture).attr('align', 'middle'))
                                .append($('<span/>').text('@' + post.user.username))));
                    $feed.data('owlCarousel').addItem($div);
                }
            }
            $feed.css("display", "inline-block");
        }
    })
}

/**
 * Обновление ленты instagram через равные промежутки времени.
 * @param {number} delay - Интервал в миллисекундах.
 * @return {number} - intervalID
 */
function initFeedUpdate(delay) {
    getFeed();
    return setInterval(function () {
        getFeed();
    }, delay);
}

var selectIntervalId;
var winner;
var prize;

/**
 * Запускает анимацию розыгрыша.
 * @param {number} num - Номер победителя.
 */

function startRaffle(num, prz) {
    clearInterval(feedUpdateIntervalId);
    audio(true);
    var $users = $('#users');
    $users.find('.user').animate({'width': '6.5%'}, 200);
    setTimeout(function () {
        $feed.animate({'width': 0}, 200);
        $feed.css('visibility', 'hidden');
        $users.animate({'width': '100%'}, 200);
    }, 200);
    winner = num;
    prize = prz;
    setTimeout(function () {
        selectIntervalId = setInterval(userSelect, 100);
        danceLogo(true);
    },3700)
}
var t=0;
function userSelect() {
    if (t<(selectTimer * 10)) {
        var rand = Math.floor(Math.random() * 90);
        var $elem = $('.user').eq(rand);
        $($elem).addClass('hover');
        setTimeout(function() {
            $($elem).removeClass('hover');
        },100);
        t++;
    } else {
        clearInterval(selectIntervalId);
        var $elem = $('.user').eq(winner);
        $($elem).addClass('hover-blue');
        var $userData = $elem.find('.user-data');
        showWinner($userData.data('src'), $userData.data('name'), $userData.data('code'));
        danceLogo(false);
    }
}

function showWinner(image, name, code) {
    var $winnerPopup = $('#winner');
    $winnerPopup.find('img').attr('src', image);
    $winnerPopup.find('.name').text(name);
    $winnerPopup.find('.code').text(code);
    $winnerPopup.find('.prize').text(prize);
    console.log(prize);
    $winnerPopup.modal('show');
    setTimeout(function() {
        audio(false);
        raffleEnd();
    },13750)
}

function audio(start) {
    var audio = document.getElementsByTagName("audio")[0];
    if (start) {
        audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
}

function danceLogo(start) {
    if (start) {
        $('h1 span').addClass('goanim');
    } else {
        $('h1 span').removeClass('goanim');
    }
}

function raffleEnd() {
    t=0;
    $('#winner').modal('hide');
    $('.user').removeClass('hover-blue');
    $feed.animate({'width' : '49%'}, 200);
    $feed.css('visibility', 'visible');
    feedUpdateIntervalId = initFeedUpdate(feedUpdateInterval);
    $('#users').animate({'width' : '50%'}, 200);
    setTimeout(function() {
        $('#users .user').animate({'width' : '10%'}, 200);
    }, 200);
}

$(function() {
    feedUpdateIntervalId = initFeedUpdate(feedUpdateInterval);
    $('h1 span').click(function() {
        
    });
});
