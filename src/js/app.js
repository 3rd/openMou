$("#_new").click(NewFile);
$("#_open").click(OpenFile);
$("#_save").click(SaveFile);
$("#_print").click(Print);
$("#_tohtml").click(ExportHTMLAs);
$("#_topdf").click(ExportPDFAs);

$("#_h1").click(function(){insertTemplate("# H1");});
$("#_h2").click(function(){insertTemplate("## H2");});
$("#_bold").click(function(){insertTemplate("**bold**");});
$("#_italic").click(function(){insertTemplate("__italic__");});
$("#_link").click(function(){insertTemplate("[text](http://link/)");});
$("#_picture").click(function(){insertTemplate("![alt text](/path/image)");});
$("#_ul").click(function(){insertTemplate("- ");});
$("#_ol").click(function(){insertTemplate("1. ");});
$("#_code").click(function(){insertTemplate("```");});
$("#_quote").click(function(){insertTemplate("\t");});
$("#_hr").click(function(){insertTemplate("-----");});

$(function(){
	window.editor=CodeMirror.fromTextArea($("#input")[0], {
		lineNumbers: false,
		tabMode: "indent",
		mode: "markdown",
		theme: "default",
		extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
	});
	editor.on("change", function(){
		runMarkdown();
	});
	runMarkdown();
});


function runMarkdown(){
	var input=null;
	var output=null;

	input=editor.getValue();

	//output=markdown.toHTML(input);
	output=marked(input);

	var html="<!doctype html><html><head>";
	var style=readFile("vendor/markdown.css", function(data){
		html+="<style>"+data+"</style>";
		html+="</head><body>"+output+"</body></html>";
		var doc=$("#output")[0].contentWindow.document;
		doc.open();
		doc.write(html);
		doc.close();
	});
}