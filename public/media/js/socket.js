var socket;

function sendRegister(qr) {
    var regData = {
        ava: $('#userpic').attr('src'),
        qr: qr,
        name: $("#name").text()
    };
    socket.emit('new_guy', regData);
}

$(function() {

    socket = io.connect('http://localhost:8065');

    socket.on('hello', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    socket.on('success', function (data) {
        console.log(data);
    });

    $('#sendNewGuy').click(function(){
        var data = $('#newGuyData').val();
        socket.emit('new_guy', JSON.parse(data));
    });
});