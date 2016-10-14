//package asmcup.sandbox;

//import javax.swing.JFrame;

function Frame(sandbox) { //Sandbox
	this.sandbox = sandbox;
	this.EXIT_ON_CLOSE = 0;
	this.setDefaultCloseOperation(this.EXIT_ON_CLOSE);
	this.setTitle("Sandbox");
	this.setResizable(false);
	this.setJMenuBar(sandbox.getMenu());
	this.setContentPane(sandbox.getCanvas());
	this.pack();
}

Frame.prototype.isVisible=function(visible){
	return this.visible;
}
Frame.prototype.setVisible=function(visible){
	this.visible = visible;
}
Frame.prototype.pack=function(s){
	
}
Frame.prototype.setDefaultCloseOperation=function(s){
	
}
Frame.prototype.setTitle=function(s){
	
}
Frame.prototype.setResizable=function(s){
	
}
Frame.prototype.setJMenuBar=function(s){
	
}
Frame.prototype.setContentPane=function(s){
	
}

Frame.prototype.repaint = function(){
	this.sandbox.redraw();
}

function MouseEvent(){
	this.button = this.x = this.y = 0;
}

MouseEvent.BUTTON1 = 1;

MouseEvent.prototype.getButton=function(){
	return this.button;
}

MouseEvent.prototype.getX=function(){
	return this.x;
}

MouseEvent.prototype.getY=function(){
	return this.y;
}

MouseEvent.prototype.setFromEvent = function(evt){
	this.x = evt.offsetX;
	this.y = evt.offsetY;
	this.button = evt.buttons;
	
}

var MEV = new MouseEvent();
function mouseUp(ev){
	MEV.setFromEvent(ev);
	this.frame.sandbox.mouse.mouseReleased(MEV);
}

function mouseDown(ev){
	MEV.setFromEvent(ev);
	this.frame.sandbox.mouse.mousePressed(MEV);
	
}

function mouseMove(ev){
	if(ev.buttons){
		MEV.setFromEvent(ev);
		this.frame.sandbox.mouse.mouseDragged(MEV);
	}
}

Frame.prototype.createVolatileImage = function(w,h){
	var canv = document.createElement('canvas');
	canv.onmousedown = mouseDown;
	canv.onmouseup = mouseUp;
	canv.onmousemove = mouseMove;
	canv.width = w;
	canv.height = h;
	canv.frame = this;
	document.body.appendChild(canv);
	canv.getGraphics=function(){

		return canv.graphics?canv.graphics:canv.graphics = new Graphics(canv);
	}
	return canv;
}

Frame.prototype.setSize = function(w,h){
	this.width = w;
	this.height = h;
}



JFrame = function(pane){this.pane = pane;}

JFrame.prototype = Object.create(Frame.prototype);


JScrollPane = function(pane){this.pane = pane;}

JScrollPane.prototype = Object.create(JFrame.prototype);


function JEditorPane(){

}

JEditorPane.prototype = Object.create(Frame.prototype);

JEditorPane.prototype.setFont = function(font,face,sz){
	
}