/**
 * Created by a.zakharov on 17.12.2015.
 */
var hashTag = 'vsemayki';
var feedLength = 3;
var $feed = $('#instafeed');
var token = '19182223.6e63162.3f6b8b2a656e446f99519374978261b0';

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
        }
    })
}

$(function() {
    getFeed();
});