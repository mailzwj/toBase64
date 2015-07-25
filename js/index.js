(function(){
    var area = document.getElementById("J_UploadArea"),
        file = document.getElementById("J_UploadFile"),
        consoleDiv = document.getElementById("J_Console"),
        tpl = document.getElementById('J_CodeGroupTpl').innerHTML,
        ld = document.getElementById('J_Loading'),
        fileCount = 0,
        tmpCount = 0;

    area.style.lineHeight = window.innerHeight + 'px';
    // area.style.lineHeight = 120 + 'px';
    // area.style.height = '120px';

    function uploadLog(fs) {
        var html = '[', fArr = [];
        console.log(fs);
        for (var i = 0, len = fs.length; i < len; i++) {
            var str = '{';
            for (var j in fs[i]) {
                str += '"' + j + '": "' + fs[i][j] + '",';
            }
            str = str.replace(/,$/, '}');
            fArr.push(str);
        }
        html += fArr.join(',') + ']';
        consoleDiv.innerHTML = html;
    }
    function parseResponse(json) {
        var clds = consoleDiv.children,
            clen = clds.length,
            tHtml = '',
            gWrap = document.createElement('div');
        if (clen === 0) {
            area.style.lineHeight = '120px';
            area.style.height = '120px';
        }
        json.fullSize = (json.fullSize / 1024).toFixed(2);
        json.tinySize = (json.tinySize / 1024).toFixed(2);
        json.percent = ((json.fullSize - json.tinySize) / json.fullSize * 100).toFixed(2) + '%';
        gWrap.className = 'img-group';
        tHtml = tpl.replace(/{{(\w+)}}/g, function(s, a) {
            return json[a] || '';
        });
        gWrap.innerHTML = tHtml;
        consoleDiv.appendChild(gWrap);
        tmpCount++;
        if (tmpCount === fileCount) {
            ld.style.display = 'none';
        }
    }
    function uploadFile(fs) {
        ld.style.display = 'block';
        var len = fs.length,
            tmpSize = 0;
        fileCount = 0;
        tmpCount = 0;
        for (var i = 0; i < len; i++) {
            if (fs[i].type === 'image/png' || fs[i].type === 'image/jpeg' || fs[i].type === 'image/jpg') {
                fileCount++;
                sendFile(fs[i]);
            } else {
                // alert(fs[i].type + ', 不是合法的图片文件');
                // ld.style.display = 'none';
                tmpSize++;
            }
            // sendByBinary(fs[i]);
        }
        if (tmpSize > 0 && tmpSize < len) {
            alert("有 " + tmpSize + " 个非png/jpg格式文件被忽略");
        } else if (tmpSize === len) {
            alert("有 " + tmpSize + " 个非png/jpg格式文件被忽略");
            ld.style.display = 'none';
        }
    }
    function sendFile(file) {
        var xhr = new XMLHttpRequest(),
            fd = new FormData();
        fd.append('file', file);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // consoleDiv.innerHTML += '<br>' + xhr.responseText;
                var rs = JSON.parse(xhr.responseText);
                if (rs.result) {
                    parseResponse(rs.file);
                } else {
                    console.log(rs.message);
                }
            }
        };
        xhr.open('POST', './upload.php');
        xhr.send(fd);
    }
    function sendByBinary(file) {
        var xhr = new XMLHttpRequest(),
            reader = new FileReader();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // consoleDiv.innerHTML += '<br>' + xhr.responseText;
                var rs = JSON.parse(xhr.responseText);
                if (rs.result) {
                    parseResponse(rs.file);
                } else {
                    console.log(rs.message);
                }
            }
        };
        xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
        xhr.open('POST', './upload.php');
        reader.onload = function(ev) {
            xhr.sendAsBinary(ev.target.result);
        };
        reader.readAsBinaryString(file);
    }
    area.onclick = function() {
        file.click();
    };
    file.onchange = function() {
        uploadFile(this.files);
    };
    area.ondragenter = function(ev) {
        this.className = 'up-area hover';
        ev.preventDefault();
    };
    area.ondragover = function(ev) {
        ev.preventDefault();
    };
    area.ondrop = function(ev) {
        ev.preventDefault();
        var dt = ev.dataTransfer;
        this.className = 'up-area';
        uploadFile(dt.files);
    };
})();