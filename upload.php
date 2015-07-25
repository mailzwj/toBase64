<?php
    require_once('lib/Tinify/Source.php');
    require_once('lib/Tinify/Client.php');
    require_once('lib/Tinify/Exception.php');
    require_once('lib/Tinify/Result.php');
    require_once('lib/Tinify.php');
    // namespace Tinify;
    $file = $_FILES['file'];
    $path = './tmp';
    $extArr = explode('.', $file['name']);
    $ext = $extArr[count($extArr) - 1];
    if ($file['size'] > 2048000) {
        echo '{"result": false, "error": "1000", "message": "文件大小超限，不能超过2M"}';
        exit;
    }
    $prefix = "data:" . $file["type"] . ";base64,";
    $uid = uniqid();
    $full = $path . '/file_' . $uid . '.' . $ext;
    $min =  $path . '/file_' . $uid . '_tiny.' . $ext;
    move_uploaded_file($file['tmp_name'], $full);

    Tinify\setKey('YOUR_KEY');
    Tinify\fromFile($full)->toFile($min);

    $fullCode = $prefix . base64_encode(file_get_contents($full));
    $minCode = $prefix . base64_encode(file_get_contents($min));
    $minSize = filesize($min);

    unlink($full);
    unlink($min);

    echo '{"result": true, "error": "0", "message": "", "file": {"name": "' . $file["name"] . '", "full": "' . $fullCode . '", "tiny": "' . $minCode . '", "fullSize": ' . $file["size"] . ', "tinySize": ' . $minSize . '}}';
?>