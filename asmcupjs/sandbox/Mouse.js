//package asmcup.sandbox;
//import java.awt.Cursor;
//import java.awt.event.*;
function Mouse(sandbox) {
    // extends MouseAdapter {
    /*
	protected final Sandbox sandbox;
	protected boolean panning;
	protected int panStartX, panStartY;
	protected boolean teleport;
	protected int teleX, teleY;
	*/
    //function Mouse(sandbox){//Sandbox sandbox) {
   	this.panning = false;
   	this.panStartX = this.panStartY = 0;
   	this.teleport = false;
   	this.teleX = this.teleY = 0;
    this.sandbox = sandbox;
    //}
}
//@Override
Mouse.prototype.mousePressed = function(e) {
    //MouseEvent e) {
    switch (e.getButton()) {
    case MouseEvent.BUTTON1:
        if (this.teleport) {
            this.finishTeleport(e);
            break;
        }
        this.panStartX = e.getX();
        this.panStartY = e.getY();
        this.panning = true;
        this.sandbox.redraw();

        console.log(this.sandbox.world.getTileXY(e.getX()+this.sandbox.panX+400,e.getY()+this.sandbox.panY+300));
        break;
    }
}
//@Override
Mouse.prototype.mouseReleased = function(e) {
    //MouseEvent e) {
    switch (e.getButton()) {
    case MouseEvent.BUTTON1:
        this.panning = false;
        this.sandbox.redraw();
        break;
    }
}
//@Override
Mouse.prototype.mouseDragged = function(e) {
    //MouseEvent e) {
    if (this.panning) {
        var dx = this.panStartX - e.getX();
        var dy = this.panStartY - e.getY();
        this.sandbox.pan(dx, dy);
        this.sandbox.redraw();
        this.panStartX = e.getX();
        this.panStartY = e.getY();
    }
}
Mouse.prototype.startTeleport = function() {
    this.sandbox.getFrame().setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
    this.teleport = true;
}
Mouse.prototype.finishTeleport = function(e) {
    //MouseEvent e) {
    this.sandbox.getFrame().setCursor(Cursor.getDefaultCursor());
    var x = this.sandbox.getPanX() + e.getX() - 400 - 16;
    var y = this.sandbox.getPanY() + e.getY() - 300 - 16;
    this.sandbox.teleport(x, y);
    this.teleport = false;
}
