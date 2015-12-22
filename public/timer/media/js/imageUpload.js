$(function () {

    var jcrop_api;

    var $userPhotoInput = $('.user-photo');
    var $userPhotoButton = $('.btn-photo');
    var $modalEditor = $('#modalEditor');
    var $editImg = $('#editImg');

    $userPhotoButton.click(function (e) {
        e.preventDefault();
        $userPhotoInput.click();
    });

    $userPhotoInput.on("change", FileSelectHandler);

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
                $userPhotoButton.attr("disabled", "disabled");
            };
            reader.onerror = function () {
                $userPhotoButton.removeAttr("disabled");
            };
            reader.onload = function (e) {
                var image = new Image();
                image.onload = function () {
                    $userPhotoButton.removeAttr("disabled");
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
        var aspectRatio = image.width / image.height;
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
            jcrop_api = this;
        });
    }

    function destroyJcrop() {
        if (typeof jcrop_api !== 'undefined') {
            jcrop_api.destroy();
        }
    }

    function jcropChange() {
        $modalEditor.data('bs.modal').options.keyboard = false;
        $modalEditor.data('bs.modal').options.backdrop = 'static';
    }

    function jcropSelect() {
        $modalEditor.data('bs.modal').options.keyboard = false;
        $modalEditor.data('bs.modal').options.backdrop = 'static';
    }

    function jcropRelease() {
        $modalEditor.data('bs.modal').options.keyboard = true;
        $modalEditor.data('bs.modal').options.backdrop = true;
    }

});