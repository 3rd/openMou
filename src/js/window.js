var MenuBar=new gui.Menu({type: 'menubar'});

var FileMenu=new gui.Menu();
var ExportMenu=new gui.Menu();

var ViewMenu=new gui.Menu();


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

var QuitItem = new gui.MenuItem({label: 'Quit'});

FileMenu.append(NewFileItem);
FileMenu.append(OpenFileItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(SaveFileItem);
FileMenu.append(SaveFileAsItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(ExportItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(PrintItem);
FileMenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.append(QuitItem);

/* START ACTIONS MENU */
var ActionsMenu=new gui.Menu();

var CopyHTMLItem = new gui.MenuItem({label: 'Copy HTML'});
var InsertItem = new gui.MenuItem({label: 'Insert'});
var CurrentDateItem = new gui.MenuItem({label: 'Current Date'});
var CurrentTimeItem = new gui.MenuItem({label: 'Current Time'});
var StrongItem = new gui.MenuItem({label: 'Strong'});
var EmphasizeItem = new gui.MenuItem({label: 'Emphasize'});
var InlineCodeItem = new gui.MenuItem({label: 'Inline Code'});
var StrikethroughItem = new gui.MenuItem({label: 'Strikethrough'});
var LinkItem = new gui.MenuItem({label: 'Link'});
var ImageItem = new gui.MenuItem({label: 'Image'});
var InsertMenu=new gui.Menu();

InsertMenu.append(CurrentDateItem);
InsertMenu.append(CurrentTimeItem);
InsertItem.submenu=InsertMenu;
ActionsMenu.append(CopyHTMLItem);
ActionsMenu.append(new gui.MenuItem({ type: 'separator' }));
ActionsMenu.append(InsertItem);
ActionsMenu.append(new gui.MenuItem({ type: 'separator' }));
ActionsMenu.append(StrongItem);
ActionsMenu.append(EmphasizeItem);
ActionsMenu.append(InlineCodeItem);
ActionsMenu.append(StrikethroughItem);
ActionsMenu.append(new gui.MenuItem({ type: 'separator' }));
ActionsMenu.append(LinkItem);
ActionsMenu.append(ImageItem);

CopyHTMLItem.click=function(){
	clipboard.set(getHTML(), 'text');
}
CurrentDateItem.click=function(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	editor.replaceSelection(day+"/"+month+"/"+year);
}
CurrentTimeItem.click=function(){
	var currentDate = new Date();
	var hours = currentDate.getHours();
	var minutes = currentDate.getMinutes() + 1;
	var seconds = currentDate.getSeconds();
	editor.replaceSelection(hours+":"+minutes+":"+seconds);
}
StrongItem.click=function(){
	editor.replaceSelection("**strong**");
}
EmphasizeItem.click=function(){
	editor.replaceSelection("*emphasize*");
}
InlineCodeItem.click=function(){
	editor.replaceSelection("`code`");
}
StrikethroughItem.click=function(){
	editor.replaceSelection("~~strike~~");
}
LinkItem.click=function(){
	editor.replaceSelection("[link](http://)");
}
ImageItem.click=function(){
	editor.replaceSelection("![image](http://)");
}
MenuBar.append(new gui.MenuItem({ label: 'File', submenu: FileMenu}),1 );
// MenuBar.append(new gui.MenuItem({ label: 'View', submenu: ViewMenu}), 3);
MenuBar.append(new gui.MenuItem({ label: 'Actions', submenu: ActionsMenu}), 3);
// MenuBar.append(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}));

win.menu=MenuBar;

// win.menu.insert(new gui.MenuItem({ label: 'File', submenu: FileMenu}), 1);
// win.menu.insert(new gui.MenuItem({ label: 'View', submenu: ViewMenu}), 3);
// win.menu.insert(new gui.MenuItem({ label: 'Actions', submenu: ActionsMenu}), 4);
// win.menu.append(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}));

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