//package asmcup.sandbox;
//import javax.swing.*;
//import javax.swing.text.JTextComponent;
//import javax.swing.undo.UndoManager;
//import java.awt.*;
//import java.awt.datatransfer.Clipboard;
//import java.awt.datatransfer.DataFlavor;
//import java.awt.event.KeyAdapter;
//import java.awt.event.KeyEvent;
//import java.awt.event.MouseAdapter;
//import java.awt.event.MouseEvent;
function DefaultContextMenu() // extends JPopupMenu
{
    /*
    private Clipboard clipboard;

    private UndoManager undoManager;

    private JMenuItem undo;
    private JMenuItem redo;
    private JMenuItem cut;
    private JMenuItem copy;
    private JMenuItem paste;
    private JMenuItem delete;
    private JMenuItem selectAll;

    private JTextComponent jTextComponent;
    */
    var clipboard;
    var undoManager;
    var undo;
    var redo;
    var cut;
    var copy;
    var paste;
    var _delete;
    var selectAll;
    var jTextComponent;
    //function DefaultContextMenu()
    //{
    var undoManager = this.undoManager = new UndoManager();
    this.clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    var undo = this.undo = new JMenuItem("Undo");
    undo.setEnabled(false);
    undo.setAccelerator(KeyStroke.getKeyStroke("control Z"));
    undo.addActionListener(function() {
        undoManager.undo()
    });
    this.add(undo);
    var redo = this.redo = new JMenuItem("Redo");
    redo.setEnabled(false);
    redo.setAccelerator(KeyStroke.getKeyStroke("control Y"));
    redo.addActionListener(function() {
        undoManager.redo()
    });
    this.add(redo);
    this.add(new JSeparator());
    var cut = this.cut = new JMenuItem("Cut");
    cut.setEnabled(false);
    cut.setAccelerator(KeyStroke.getKeyStroke("control X"));
    cut.addActionListener(function() {
        jTextComponent.cut()
    });
    this.add(cut);
    var copy = this.copy = new JMenuItem("Copy");
    copy.setEnabled(false);
    copy.setAccelerator(KeyStroke.getKeyStroke("control C"));
    copy.addActionListener(function() {
        jTextComponent.copy()
    });
    this.add(copy);
    var paste = this.paste = new JMenuItem("Paste");
    paste.setEnabled(false);
    paste.setAccelerator(KeyStroke.getKeyStroke("control V"));
    paste.addActionListener(function() {
        jTextComponent.paste()
    });
    this.add(paste);
    var _delete = _delete = new JMenuItem("Delete");
    _delete.setEnabled(false);
    _delete.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_DELETE, 0));
    _delete.addActionListener(function() {
        jTextComponent.replaceSelection("")
    });
    this.add(_delete);
    this.add(new JSeparator());
    var selectAll = this.selectAll = new JMenuItem("Select All");
    selectAll.setEnabled(false);
    selectAll.setAccelerator(KeyStroke.getKeyStroke("control A"));
    selectAll.addActionListener(function() {
        jTextComponent.selectAll()
    });
    this.add(selectAll);
}
DefaultContextMenu.prototype.add = function(jTextComponent) //JTextComponent jTextComponent)
{
    var ka = new KeyAdapter();
    jTextComponent.addKeyListener = function(ka) //(new KeyAdapter()
    {

    }    
    jTextComponent.addMouseListener = function(ma) //(new KeyAdapter()
    {

    }  
    jTextComponent.addMouseListener = function(ma) //(new KeyAdapter()
    {

    }
    jTextComponent.getDocument = function(){
        return this.document?this.document:this.document = {
            addUndoableEditListener: function(uel){
                
            }
        }
    }

    //@Override
    ka.keyPressed = function(pressedEvent) //KeyEvent pressedEvent)
    {
        if ((pressedEvent.getKeyCode() == KeyEvent.VK_Z) && ((pressedEvent.getModifiers() & KeyEvent.CTRL_MASK) != 0)) {
            if (undoManager.canUndo()) {
                undoManager.undo();
            }
        }
        if ((pressedEvent.getKeyCode() == KeyEvent.VK_Y) && ((pressedEvent.getModifiers() & KeyEvent.CTRL_MASK) != 0)) {
            if (undoManager.canRedo()) {
                undoManager.redo();
            }
        }
    }
    //);
    var ma = new MouseAdapter();
    jTextComponent.addMouseListener(ma)
    //new MouseAdapter()
    {
        //@Override
        function mouseReleased(releasedEvent) //MouseEvent releasedEvent)
        {
            if (releasedEvent.getButton() == MouseEvent.BUTTON3) {
                processClick(releasedEvent);
            }
        }
    }
    //);
    jTextComponent.getDocument().addUndoableEditListener(function() {
        undoManager.addEdit(event.getEdit())
    });
}

DefaultContextMenu.prototype.processClick = function(event) //MouseEvent event)
{
    /*
        jTextComponent = (JTextComponent) event.getSource();
        jTextComponent.requestFocus();

        boolean enableUndo = undoManager.canUndo();
        boolean enableRedo = undoManager.canRedo();
        boolean enableCut = false;
        boolean enableCopy = false;
        boolean enablePaste = false;
        boolean enableDelete = false;
        boolean enableSelectAll = false;

        String selectedText = jTextComponent.getSelectedText();
        String text = jTextComponent.getText();
        */
    jTextComponent = event.getSource();
    jTextComponent.requestFocus();
    var enableUndo = this.undoManager.canUndo();
    var enableRedo = this.undoManager.canRedo();
    var enableCut = false;
    var enableCopy = false;
    var enablePaste = false;
    var enableDelete = false;
    var enableSelectAll = false;
    var selectedText = jTextComponent.getSelectedText();
    var text = jTextComponent.getText();
    if (text != null ) {
        if (text.length() > 0) {
            enableSelectAll = true;
        }
    }
    if (selectedText != null ) {
        if (selectedText.length() > 0) {
            enableCut = true;
            enableCopy = true;
            enableDelete = true;
        }
    }
    if (clipboard.isDataFlavorAvailable(DataFlavor.stringFlavor) && jTextComponent.isEnabled()) {
        enablePaste = true;
    }
    this.undo.setEnabled(enableUndo);
    this.redo.setEnabled(enableRedo);
    this.cut.setEnabled(enableCut);
    this.copy.setEnabled(enableCopy);
    this.paste.setEnabled(enablePaste);
    this._delete.setEnabled(enableDelete);
    this.selectAll.setEnabled(enableSelectAll);
    this.show(jTextComponent, event.getX(), event.getY());
}
