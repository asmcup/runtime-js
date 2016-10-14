//package asmcup.sandbox;
//import java.awt.Font;
//import java.awt.datatransfer.*;
//import java.awt.dnd.*;
//import java.awt.event.*;
//import java.io.*;
//import java.util.List;
//import javax.swing.*;
//import javax.swing.text.PlainDocument;
//import asmcup.compiler.Compiler;
function CodeEditor(sandbox) {
    //} extends JFrame {
    /*
	protected final Sandbox sandbox;
	protected JEditorPane editor;
	protected Menu menu;
	protected byte[] ram = new byte[256];
	protected File currentFile;
	*/
    //public CodeEditor(Sandbox sandbox) {
    //function CodeEditor(sandbox){//Sandbox sandbox) {
    this.sandbox = sandbox;
    this.editor = new JEditorPane();
    this.menu = new Menu();
    this.setTitle("Code Editor");
    this.setSize(400, 400);
    this.setContentPane(new JScrollPane(this.editor));
    this.setJMenuBar(this.menu);
    new DefaultContextMenu().add(this.editor);
    this.editor.setFont(new Font(Font.MONOSPACED,Font.PLAIN,12));
    //this.editor.getDocument().putProperty(PlainDocument.tabSizeAttribute, 2);
    /*
	editor.setTransferHandler(new TransferHandler() {
		//@Override
		public boolean canImport(TransferHandler.TransferSupport support) {
			for (DataFlavor flavor : support.getDataFlavors()) {
				if (flavor.isFlavorJavaFileListType()) {
					return true;
				}
			}

			return false;
		}

		//@Override
		//@SuppressWarnings("unchecked")
		public boolean importData(TransferHandler.TransferSupport support) {
			if (!canImport(support)) {
				return false;
			}

			List<File> files;

			try {
				files = (List<File>) support.getTransferable().getTransferData(DataFlavor.javaFileListFlavor);
			} catch (Exception e) {
				return false;
			}

			for (File file : files) {
				currentFile = file;
				openFile();
				break;
			}

			return true;
		}
	});*/
}


CodeEditor.prototype = Object.create(Frame.prototype);

CodeEditor.prototype.openFile = function() {
    if (this.currentFile == null ) {
        this.currentFile = findFileOpen();
    }
    try {
        var text = Utils.readAsString(this.currentFile);
        if (text != null ) {
            this.editor.setText(text);
        }
    } catch (e) {
        //Exception e) {
        e.printStackTrace();
    }
}
CodeEditor.prototype.openFile = function(file) {
    //File file) {
    this.currentFile = file;
    this.openFile();
}
CodeEditor.prototype.closeFile = function() {
    this.editor.setText("");
}
CodeEditor.prototype.closeEditor = function() {
    this.setVisible(false);
}
//public boolean compile() {
CodeEditor.prototype.compile = function() {
    try {
        var compiler = new Compiler();
        this.ram = compiler.compile(editor.getText());
    } catch (e) {
        //(Exception e) {
        e.printStackTrace();
        return false;
    }
    return true;
}
CodeEditor.prototype.flash = function() {
    //synchronized (sandbox.getWorld()) {
    this.sandbox.getRobot().flash(this.ram);
    //}
}
CodeEditor.prototype.compileAndFlash = function() {
    if (this.compile()) {
        this.flash();
    }
}
CodeEditor.prototype.checkSyntax = function() {}
//public File findFileSave() {
CodeEditor.prototype.findFileSave = function() {
    return Utils.findFileSave(this.sandbox.getFrame(), "asm", "Source File");
}
//public File findFileOpen() {
CodeEditor.prototype.findFileOpen = function() {
    return Utils.findFileOpen(this.sandbox.getFrame(), "asm", "Source File");
}
CodeEditor.prototype.saveFile = function() {
    if (this.currentFile == null ) {
        this.currentFile = this.findFileSave();
    }
    this.save(this.currentFile);
}
CodeEditor.prototype.save = function(file) {
    //File file) {
    if (file == null ) {
        return;
    }
    try {
        Utils.write(file, this.editor.getText());
    } catch (e) {
        //IOException e) {
        e.printStackTrace();
    }
}
CodeEditor.prototype.saveFileAs = function() {
    this.save(this.findFileSave());
}
CodeEditor.prototype.saveROM = function() {}
CodeEditor.prototype.Menu = function() {
    //} extends JMenuBar {
    //function Menu() {
    addFileMenu();
    addCompileMenu();
    //}
    //protected AbstractAction item(String label, ActionListener f) {
    function item(label, f) {
        var label = new AbstractAction(label);
        label.actionPerformed = function(e) {
            //ActionEvent e) {
            f.actionPerformed(e);
        }
        return label;
    }
    function addFileMenu() {
        var menu = new JMenu("File");
        menu.add(item("New Code", function() {
            closeFile();
        }));
        menu.add(item("Open Code...", function() {
            openFile();
        }));
        menu.addSeparator();
        menu.add(item("Save Code", function() {
            saveFile();
        }));
        menu.add(item("Save Code As...", function() {
            saveFileAs();
        }));
        menu.add(item("Save ROM", function() {
            saveROM();
        }));
        menu.addSeparator();
        menu.add(item("Close Editor", function() {
            closeEditor();
        }));
        add(menu);
    }
    function addCompileMenu() {
        var menu = new JMenu("Tools");
        menu.add(item("Compile & Flash", function() {
            compileAndFlash();
        }));
        menu.add(item("Compile", function() {
            compile();
        }));
        menu.add(item("Flash", function() {
            flash();
        }));
        menu.addSeparator();
        menu.add(item("Check Syntax", function() {
            checkSyntax();
        }));
        add(menu);
    }
}
