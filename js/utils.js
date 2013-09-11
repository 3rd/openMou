function getGUID(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
function setNewFile(filename){
    currentFile=filename;
    $("#title").text(filename);
    win.title=(currentFile || "Untitled");
}
function getHTML(){
    return $("#output")[0].contentWindow.document.documentElement.outerHTML;
}
function writeFile(path, content){
    fs.writeFile(path, content, function(err) {
        if(err) {
            alert("Error writing file!");
            console.log(err);
        }
        $("#savefiledialog").val("");
    });
}
function writePDF(outputfile, html){
    var tempfile = 'stico_'+getGUID()+'.html';
    fs.writeFileSync(tempfile, html);
    var cmd="bin/wkhtmltopdf";
    var execFile = require ('child_process').execFile, child;
    child = execFile(cmd, [tempfile, outputfile],
    function(error,stdout,stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+ error.code);
            console.log('Signal received: ' + error.signal);
        }
    });
    child.on('exit', function (code) {
        fs.unlink(tempfile);
        $("#savefiledialog").val("");
    });
}
function insertTemplate(text) {
    window.editor.replaceSelection(text);
}
function runOpenFileDialog(accept, callback){
    var dialog=$("<input type='file'/>");
    dialog.prop("accept",accept);
    dialog.change(callback);
    dialog.trigger("click");
}
function runSaveFileDialog(accept, callback){
    var dialog=$("<input nwsaveas type='file'/>");
    dialog.prop("accept",accept);
    dialog.change(callback);
    dialog.trigger("click");
}
function readFile(fileName, callback){
    fs.exists(fileName, function(exists) {
        if (exists) {
            fs.stat(fileName, function(error, stats) {
                fs.open(fileName, "r", function(error, fd) {
                var buffer = new Buffer(stats.size);
                fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                    var data = buffer.toString("utf8", 0, buffer.length);
                    fs.close(fd);
                    callback(data);
                });
                });
            });
        } else {
            alert("FNF");
        }
    });
}