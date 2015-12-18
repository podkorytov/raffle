/**
 * Created by a.zakharov on 17.12.2015.
 */
var hashTag = 'vsemayki';
var feedLength = 3;
var $feed = $('#instafeed');
var token = '19182223.6e63162.3f6b8b2a656e446f99519374978261b0';
var selectTimer = 13;

function getFeed() {
    $feed.find('div').remove();
    $.ajax({
        type : 'GET',
        dataType : 'jsonp',
        cache : false,
        url : 'https://api.instagram.com/v1/tags/' + hashTag + '/media/recent?access_token=' + token + '&count=' + feedLength,
        success : function(data) {
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
                    $div.appendTo($feed);
                }
            }

            $feed.owlCarousel({
                autoPlay: 5000,
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true,
                transitionStyle: "fade"
            }).css("display", "inline-block");
        }
    })
}
var selectInterval;
var winner;
function startRaffle(num) {
    audio(true);
    $('#users .user').animate({'width' : '6.5%'}, 200);
    setTimeout(function() {
        $feed.animate({'width' : 0}, 200);
        $('#users').animate({'width' : '100%'}, 200);
    }, 200);
    winner = num;
    setTimeout(function() {
        selectInterval = setInterval(userSelect, 100);
    },4050)
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
        clearInterval(selectInterval);
        var $elem = $('.user').eq(winner);
        $($elem).addClass('hover-blue');
        showWinner($elem.find('img').attr('src'));
        audio(false);
    }
}


$(function() {
    getFeed();
    for (var i=0; i<90; i++) {
        $('<div class="user"><img src="https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/s750x750/sh0.08/e35/12394029_1623922857868593_205865308_n.jpg"></div>').appendTo('#users');
    }
});

function audio(start) {
    var audio = document.getElementsByTagName("audio")[0];
    if (start) {
        audio.play();
    } else {
        audio.pause();
    }
}
