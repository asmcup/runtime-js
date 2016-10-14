//package asmcup.sandbox;

//import java.awt.event.*;

//import javax.swing.*;

function Menu(){// extends JMenuBar {
	//protected final Sandbox 
	var sandbox;
	
	function Menu(sandbox){//Sandbox sandbox) {
		this.sandbox = sandbox;
		
		addWorldMenu();
		addRobotMenu();
	}
	
	//public AbstractAction item(String name, ActionListener listener) {
	function item( name, listener) {
		var a= new AbstractAction(name)
			a= actionPerformed=function(e){//ActionEvent e) {
				listener.actionPerformed(e);
			}
	return a;
	}
		
	function teleport() {
		sandbox.getMouse().startTeleport();
	}
	
	function showCodeEditor() {
		sandbox.getCodeEditor().setVisible(true);
	}
	
	function showDebugger() {
		sandbox.getDebugger().setVisible(true);
	}
	
	function reseed() {
		sandbox.reseed();
	}
	
	function showWorldInfo() {
		
	}
	
	function centerView() {
		sandbox.centerView();
	}
	
	function addRobotMenu() {
		//JMenu
		var menu = new JMenu("Robot");
		menu.add(item("Teleport", function() { teleport(); }));
		menu.addSeparator();
		menu.add(item("Center View", function() { centerView(); }));
		menu.addSeparator();
		menu.add(item("Show Code Editor", function() { showCodeEditor(); }));
		menu.add(item("Show Debugger", function(){ showDebugger(); }));
		add(menu);
	}
	
	function addWorldMenu() {
		//JMenu
		var menu = new JMenu("World");
		menu.add(item("Generate New", function() { reseed(); }));
		menu.addSeparator();
		menu.add(item("Load Snapshot...", function() {  }));
		menu.addSeparator();
		menu.add(item("Save Snapshot", function() {  }));
		menu.add(item("Save Snapshot As...", function() {  }));
		menu.addSeparator();
		menu.add(item("Show Info", function() { showWorldInfo(); }));
		menu.addSeparator();
		menu.add(item("Quit", function() { sandbox.quit(); }));
		add(menu);
	}
}