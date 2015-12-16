var socket;

function sendRegister(qr) {
    var regData = {
        ava: $('#userpic').attr('src'),
        qr: qr,
        name: $("#name").text()
    };
    socket.emit('new_guy', regData);
}

function sendSocket() {
    var data = $('#newGuyData').val();
    socket.send(data);
}

$(function() {

    socket = new WebSocket('ws://localhost:8095');

    socket.onmessage = function (mess) {
        console.log(mess);
        console.log(JSON.parse(mess.data));

        socket.send(JSON.stringify({ my: 'data' }));
    };
});