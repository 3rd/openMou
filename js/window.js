var MenuBar=new gui.Menu({type: 'menubar'});

var FileMenu=new gui.Menu();
var ExportMenu=new gui.Menu();

var ViewMenu=new gui.Menu();

var ActionsMenu=new gui.Menu();

var HelpMenu=new gui.Menu();

/* START FILEMENU */
var NewFileItem = new gui.MenuItem({label: 'New'});
var OpenFileItem=new gui.MenuItem({label: 'Open'});
var SaveFileItem=new gui.MenuItem({label: 'Save'});
var SaveFileAsItem=new gui.MenuItem({label: 'Save As'});
var PrintItem = new gui.MenuItem({label: 'Print'});

var ExportItem = new gui.MenuItem({ label: 'Export' });
var ExportHTMLItem = new gui.MenuItem({label: 'Export HTML'});
var ExportPDFItem = new gui.MenuItem({label: 'Export PDF'});
ExportMenu.append(ExportHTMLItem);
ExportMenu.append(ExportPDFItem);
ExportItem.submenu=ExportMenu;

var QuitItem = new gui.MenuItem({label: 'Close'});


FileMenu.append(NewFileItem);
FileMenu.append(OpenFileItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(QuitItem);
FileMenu.append(SaveFileItem);
FileMenu.append(SaveFileAsItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(ExportItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(PrintItem);

win.menu=MenuBar;

win.menu.insert(new gui.MenuItem({ label: 'File', submenu: FileMenu}), 1);
win.menu.insert(new gui.MenuItem({ label: 'View', submenu: ViewMenu}), 3);
win.menu.insert(new gui.MenuItem({ label: 'Actions', submenu: ActionsMenu}), 4);
win.menu.append(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}));

NewFileItem.click=NewFile;
OpenFileItem.click=OpenFile;
SaveFileItem.click=SaveFile;
SaveFileAsItem.click=SaveFileAs;
PrintItem.click=Print;
ExportHTMLItem.click=ExportHTMLAs;
ExportPDFItem.click=ExportPDFAs;
QuitItem.click=Exit;

function NewFile(){
	window.open('main.html', '_blank');
}
function OpenFile(){
	runOpenFileDialog(".md", function(){
		var fileName=$(this).val();
		fs.exists(fileName, function(exists) {
		if (exists) {
		fs.stat(fileName, function(error, stats) {
			fs.open(fileName, "r", function(error, fd) {
			var buffer = new Buffer(stats.size);
			fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
				var data = buffer.toString("utf8", 0, buffer.length);
				window.editor.setValue(data);
				setNewFile(fileName);
				fs.close(fd);
			});
			});
		});
		}
		});
		$(this).remove();
	});
}

function SaveFile(){
	if(window.currentFile !== null)
	writeFile(currentFile, window.editor.getValue());
	else SaveFileAs();
}
function SaveFileAs(){
	runSaveFileDialog(".md", function(){
		var fileName=$(this).val();
		writeFile(fileName, window.editor.getValue());
		setNewFile(fileName);
		$(this).remove();
	});
}
function ExportHTMLAs(){
	runSaveFileDialog(".html", function(){
		var fileName=$(this).val();
		writeFile(fileName, getHTML());
		$(this).remove();
	});
}
function ExportPDFAs(){
	runSaveFileDialog(".pdf", function(){
		var fileName=$(this).val();
		writePDF(fileName, getHTML());
		$(this).remove();
	});
}
function Print(){
	window.print();
}
function Exit(){
	win.close();
}