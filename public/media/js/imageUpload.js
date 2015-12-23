$(function () {

    var resultUserImgSize = 800;

    var jcrop_api;
    var boundx;
    var boundy;
    var originalWidth = 0;
    var originalHeight = 0;

    var $userName = $('.user-name');
    var $userCode = $('.user-code');
    var $userPhotoInput = $('.user-photo');
    var $helpImgTxt = $(".user-img-wrapper .help-txt");
    var $errLabel = $(".errLabel");
    var $modalEditor = $('#modalEditor');
    var $editImg = $('#editImg');
    var $userResultImage = $('#userImg');
    var $regButton = $('.btn-ok');

    var socket = io();

    $userPhotoInput.on("change", FileSelectHandler);

    $userName.on("blur", function () {
        $errLabel.html("");
    });

    $userCode.on("blur", function () {
        $errLabel.html("");
    });

    $regButton.on("click", function () {
        if ($userResultImage.attr("src").length < 23) {
            $errLabel.html("Загрузите ваше фото.");
            return;
        }
        if ($userName.val().length <= 0) {
            $errLabel.html("Заполните поле Имя.");
            return;
        }
        if ($userCode.val().length <= 0) {
            $errLabel.html("Заполните поле Код.");
            return;
        }
        var msg = {
            name: $userName.val(),
            code: $userCode.val(),
            img_content: $userResultImage.attr("src")
        };
        socket.emit('registration', JSON.stringify(msg));
    });

    socket.on('registration_error', function(msg) {
        if (typeof msg !== "undefined" && msg.code == $userCode.val() ) {
            $errLabel.html(msg);
        }
    });

    socket.on('raffle', function(msg){
        console.log(msg);
        if (typeof msg !== "undefined" && msg.code == $userCode.val() ) {
            $errLabel.html("Регистрация прошла успешно!");
        }
    });

    /**
     * Обрабатывает загруженные пользователем файлы. Проверяет формат файлов.
     * @param {object} e
     */
    function FileSelectHandler(e) {
        // Fetch FileList object.
        var files = e.target.files || e.dataTransfer.files;
        // Process all File objects.
        for (var i = 0, f; f = files[i]; i++) {
            var regex = /(\.|\/)(jpe?g|png)$/i;
            if (!(regex.test(f.type) || regex.test(f.name))) {
                alert('Тип изображения запрещен');
            } else {
                ParseFile(f);
            }
        }
    }

    /**
     * Используя FileReader читает содержимое указанное в File,
     * переводит его в base64 и создает новый объект Image.
     * @param {File} file - Файл изображения.
     */
    function ParseFile(file) {
        if (file.type.indexOf("image") == 0) {
            var reader = new FileReader();
            reader.onloadstart = function () {
                $helpImgTxt.show().html("<span>Подождите<br>идет<br>загрузка</span>");
            };
            reader.onerror = function () {
                $helpImgTxt.show().html("<span>Упс<br>произошла<br>ошибка</span>");
            };
            reader.onload = function (e) {
                var image = new Image();
                image.onload = function () {
                    $helpImgTxt.hide();
                    image.name = file.name;
                    ShowEditorModal(image);
                };
                image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Обновляет и показывает модальное окно с jcrop редактором.
     * @param {image} image - редактируемое изображение.
     */
    function ShowEditorModal(image) {
        var imgWidth = 568; // Ширина контейнера модального окна. Магическая константа (
        originalWidth = image.width;
        originalHeight = image.height;
        var aspectRatio = originalWidth / originalHeight;
        $editImg.attr("src", image.src);
        $editImg.attr("width", imgWidth);
        $editImg.attr("height", imgWidth / aspectRatio);
        updateJcrop();
        $modalEditor.modal({
            show: true
        });
    }

    function updateJcrop() {
        destroyJcrop();
        initJcrop();
    }

    function initJcrop() {
        $editImg.Jcrop({
            onChange: jcropChange,
            onSelect: jcropSelect,
            onRelease: jcropRelease,
            aspectRatio: 1
        }, function () {
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            jcrop_api = this;
            jcrop_api.animateTo([50,50,400,400]);
        });
    }

    function destroyJcrop() {
        if (typeof jcrop_api !== 'undefined') {
            jcrop_api.destroy();
        }
    }

    /**
     * Called when the Jcrop selection is moving
     */
    function jcropChange() {
        $modalEditor.data('bs.modal').options.keyboard = false;
        $modalEditor.data('bs.modal').options.backdrop = 'static';
    }

    /**
     * Called when Jcrop selection is completed.
     * Обновляет DataURL картинки предназначеной для отправки.
     * @param {object} c
     */
    function jcropSelect(c) {
        $modalEditor.data('bs.modal').options.keyboard = false;
        $modalEditor.data('bs.modal').options.backdrop = 'static';
        if (parseInt(c.w) > 0) {
            var diff = originalWidth / $editImg.width();
            var resultImage = cutUserImage($editImg[0], diff * c.x, diff * c.y, diff * c.w, diff * c.h);
            $userResultImage.attr('src', resultImage);
            $userResultImage.show();
        }
        // Чтобы не закрывать модальное окно сразу же после mouseup за его областью.
        setTimeout(function () {
            $modalEditor.data('bs.modal').options.keyboard = true;
            $modalEditor.data('bs.modal').options.backdrop = true;
        }, 100);
    }

    function jcropRelease() {
        $modalEditor.data('bs.modal').options.keyboard = true;
        $modalEditor.data('bs.modal').options.backdrop = true;
    }

    /**
     * Вырезает изображение.
     * @param {image} image
     * @param {number} sx - The x coordinate where to start clipping.
     * @param {number} sy - The y coordinate where to start clipping.
     * @param {number} swidth - The width of the clipped image.
     * @param {number} sheight - The height of the clipped image.
     * @returns {string} - DataURL
     */
    function cutUserImage(image, sx, sy, swidth, sheight) {
        var canvas = document.createElement('canvas');
        canvas.width = resultUserImgSize;
        canvas.height = resultUserImgSize;
        var context = canvas.getContext('2d');
        context.drawImage(image, sx, sy, swidth, sheight, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }

});