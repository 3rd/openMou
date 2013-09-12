var MenuBar=new gui.Menu({type: 'menubar'});

var FileMenu=new gui.Menu();
var ExportMenu=new gui.Menu();
var ExtraMenu=new gui.Menu();
var HelpMenu=new gui.Menu();

window.autoSave = false;
window.intervalID = 0;

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
var InsertMenu=new gui.Menu();

var CopyHTMLItem = new gui.MenuItem({label: 'Copy HTML'});
var CurrentDateItem = new gui.MenuItem({label: 'Current Date'});
var CurrentTimeItem = new gui.MenuItem({label: 'Current Time'});
var StrongItem = new gui.MenuItem({label: 'Strong'});
var EmphasizeItem = new gui.MenuItem({label: 'Emphasize'});
var InlineCodeItem = new gui.MenuItem({label: 'Inline Code'});
var StrikethroughItem = new gui.MenuItem({label: 'Strikethrough'});
var LinkItem = new gui.MenuItem({label: 'Link'});
var ImageItem = new gui.MenuItem({label: 'Image'});
var FullScreenItem = new gui.MenuItem({label: 'Fullscreen'});
var AutoSaveItem = new gui.MenuItem({label: 'Turn AutoSave ON'});
var SyntaxItem = new gui.MenuItem({label: 'Syntax Reference'});

InsertMenu.append(StrongItem);
InsertMenu.append(EmphasizeItem);
InsertMenu.append(InlineCodeItem);
InsertMenu.append(StrikethroughItem);
InsertMenu.append(new gui.MenuItem({ type: 'separator' }));
InsertMenu.append(LinkItem);
InsertMenu.append(ImageItem);
InsertMenu.append(new gui.MenuItem({ type: 'separator' }));
InsertMenu.append(CurrentDateItem);
InsertMenu.append(CurrentTimeItem);

ExtraMenu.append(CopyHTMLItem);
ExtraMenu.append(FullScreenItem);
ExtraMenu.append(AutoSaveItem);
ExtraMenu.append(SyntaxItem);

SyntaxItem.click=function(){
	gui.Window.open("/MarkdownSyntaxReference.html",{
		width: 500,
		height: 700
	});
};
AutoSaveItem.click=function(){
	if (autoSave==false && currentFile !== null) {
		window.autoSave=true;
		AutoSave(window.autoSave);
		if (process.platform == "win32") {
			if (win.menu) {
				for (var i = win.menu.items.length - 1; i >= 0; i--) {
					win.menu.removeAt(i);
				}
			}

			AutoSaveItem.label = "Turn AutoSave Off";
			renderMenu();
		} else {
			win.menu.items[2].submenu.items[2].label = "Turn AutoSave Off";
		}
		
	} else {
		window.autoSave=false;
		AutoSave(window.autoSave);
		if (process.platform == "win32") {
			if (win.menu) {
				for (var i = win.menu.items.length - 1; i >= 0; i--) {
					win.menu.removeAt(i);
				}
			}
			
			AutoSaveItem.label = "Turn AutoSave On";
			renderMenu();
		} else {
			win.menu.items[2].submenu.items[2].label = "Turn AutoSave On";
		}
	}
};
FullScreenItem.click=function(){
	win.enterFullscreen();
};
CopyHTMLItem.click=function(){
	clipboard.set(getHTML(), 'text');
};
CurrentDateItem.click=function(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	editor.replaceSelection(day+"/"+month+"/"+year);
};
CurrentTimeItem.click=function(){
	var currentDate = new Date();
	var hours = currentDate.getHours();
	var minutes = currentDate.getMinutes() + 1;
	var seconds = currentDate.getSeconds();
	editor.replaceSelection(hours+":"+minutes+":"+seconds);
};
StrongItem.click=function(){
	editor.replaceSelection("**strong**");
};
EmphasizeItem.click=function(){
	editor.replaceSelection("*emphasize*");
};
InlineCodeItem.click=function(){
	editor.replaceSelection("`code`");
};
StrikethroughItem.click=function(){
	editor.replaceSelection("~~strike~~");
};
LinkItem.click=function(){
	editor.replaceSelection("[link](http://)");
};
ImageItem.click=function(){
	editor.replaceSelection("![image](http://)");
};



NewFileItem.click=NewFile;
OpenFileItem.click=OpenFile;
SaveFileItem.click=SaveFile;
SaveFileAsItem.click=SaveFileAs;
PrintItem.click=Print;
ExportHTMLItem.click=ExportHTMLAs;
ExportPDFItem.click=ExportPDFAs;
QuitItem.click=Exit;

renderMenu();

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
	if(window.currentFile !== null) {
		writeFile(currentFile, window.editor.getValue());
	}
	else SaveFileAs();
}

function AutoSave(autoSave){
	if (autoSave) {
		intervalID = window.setInterval(SaveFile,10000);
	} else {
		window.clearInterval(intervalID);
	}
}

function SaveFileAs(){
	runSaveFileDialog(".md", function(){
		var fileName=$(this).val();
		writeFile(fileName, window.editor.getValue());
		setNewFile(fileName);
		$(this).remove();
		AutoSave();
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

win.on('close', function() {
  if (window.currentFile === null) {
	SaveFile();
	console.log("We're closing...");
	this.close(true);
  } else {
	this.close(true);
  }
  
});

function renderMenu(){
	
	switch(process.platform){
		case "win32":
			MenuBar.append(new gui.MenuItem({ label: 'File', submenu: FileMenu}),1);
			MenuBar.append(new gui.MenuItem({ label: 'Insert', submenu: InsertMenu}), 3);
			MenuBar.append(new gui.MenuItem({ label: 'Extra', submenu: ExtraMenu}), 4);
			MenuBar.append(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}),5);
			win.menu=MenuBar;
		break;

		case "darwin":
			win.menu=MenuBar;
			win.menu.insert(new gui.MenuItem({ label: 'File', submenu: FileMenu}),1);
			win.menu.insert(new gui.MenuItem({ label: 'Insert', submenu: InsertMenu}), 3);
			win.menu.insert(new gui.MenuItem({ label: 'Extra', submenu: ExtraMenu}), 4);
			win.menu.insert(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}),5);
		break;

		default:
			win.menu=MenuBar;
			win.menu.insert(new gui.MenuItem({ label: 'File', submenu: FileMenu}),1);
			win.menu.insert(new gui.MenuItem({ label: 'Insert', submenu: InsertMenu}), 3);
			win.menu.insert(new gui.MenuItem({ label: 'Extra', submenu: ExtraMenu}), 4);
			win.menu.insert(new gui.MenuItem({ label: 'Help', submenu: HelpMenu}),5);
		break;
	}
}

jwerty.key('ctrl+shift+F', function(){
	win.toggleFullscreen();
});
jwerty.key('cmd+shift+F', function(){
	win.toggleFullscreen();
});
jwerty.key('ctrl+shift+S', function(){
	SaveFileAs();
});
jwerty.key('cmd+shift+S', function(){
	SaveFileAs();
});
jwerty.key('ctrl+s', function(){
	SaveFile();
});
jwerty.key('cmd+s', function(){
	SaveFile();
});
jwerty.key('ctrl+o', function(){
	OpenFile();
});
jwerty.key('cmd+o', function(){
	OpenFile();
});
jwerty.key('ctrl+n', function(){
	NewFile();
});
jwerty.key('cmd+n', function(){
	NewFile();
});
jwerty.key('ctrl+p', function(){
	Print();
});
jwerty.key('cmd+p', function(){
	Print();
});
jwerty.key('ctrl+q', function(){
	Exit();
});