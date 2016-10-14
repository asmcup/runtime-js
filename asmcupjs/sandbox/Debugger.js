//package asmcup.sandbox;

//import java.awt.*;
//import java.awt.event.*;

//import javax.swing.*;

//import asmcup.runtime.Robot;

function Debugger(sandbox){// extends JFrame {
	//var sandbox;//protected final Sandbox sandbox;
	//var memPane;//protected MemoryPane memPane;
	//var scrollPane;//protected JScrollPane scrollPane;
	
	//function Debugger(sandbox){//Sandbox sandbox) {
		this.sandbox = sandbox;
		
	this.memPane = new MemoryPane();
	this.scrollPane = new JScrollPane(this.memPane);

	this.setTitle("Debugger");
	this.setContentPane(this.scrollPane);
	this.pack();
}
Debugger.prototype = Object.create(Frame.prototype);

function MemoryPane(){//} extends JComponent {
	var font;//protected Font font;
	var start, end;
	var mouse;//protected Mouse mouse = new Mouse();

	function MemoryPane() {
		font = new Font(Font.MONOSPACED, Font.PLAIN, 12);
		setPreferredSize(new Dimension(17 * 16, 16 * 16));
		addMouseListener(mouse);
		addMouseMotionListener(mouse);
	}

	function transform(x,y){//int x, int y) {
		var col = Math.max(0, (x - 16) / 16);
		var row = Math.max(0, y / 16);
		return Math.min(255, row * 16 + col);
	}

	function transform(e){//MouseEvent e) {
		return transform(e.getX(), e.getY());
	}

	function select(a, b) {
		start = Math.min(a,  b);
		end = Math.max(a, b);
	}

	//@Override
	function paintComponent(g){//Graphics g) {
		var c = g.getClipBounds();//Rectangle
		var robot = sandbox.getRobot();//Robot

		g.setColor(Color.WHITE);
		g.fillRect(c.x, c.y, c.width, c.height);

		g.setFont(font);

		for (var row=0; row < 16; row++) {
			var y = 12 + row * 16;

			g.setColor(Color.DARK_GRAY);
			g.fillRect(0, row * 16, 16, 16);
			g.setColor(Color.WHITE);
			g.drawString(String.format("%02x", row * 16), 0, y);

			for (var col=0; col < 16; col++) {
				var x = 16 + col * 16;
				var addr = row * 16 + col;
				var value = robot.getVM().read8(addr);

				if (addr >= start && addr <= end) {
					g.setColor(Color.BLACK);
					g.fillRect(x, y - 12, 16, 16);
					g.setColor(Color.WHITE);
				} else {
					g.setColor(Color.BLACK);
				}

				if (addr == robot.getVM().getProgramCounter()) {
					g.setColor(Color.RED);
				}

				g.drawString(String.format("%02x", value), x + 1, y);

				if (addr == robot.getVM().getStackPointer()) {
					g.setColor(Color.RED);
					g.drawRect(x, y - 12, 16, 16);
				}
			}
		}
	}

	function Mouse(){//} extends MouseAdapter {
		var dragging = false;
		var dragStart; //int

		//@Override
		function mousePressed(e){//MouseEvent e) {
			switch (e.getButton()) {
			case MouseEvent.BUTTON1:
				dragStart = transform(e);
				dragging = true;
				repaint();
				break;
			}
		}

		//@Override
		function mouseReleased(e){//MouseEvent e) {
			switch (e.getButton()) {
			case MouseEvent.BUTTON1:
				mouseDragged(e);
				dragging = false;
				break;
			}
		}

		//@Override
		function mouseDragged(e){//MouseEvent e) {
			if (dragging) {
				select(dragStart, transform(e));
				repaint();
			}
		}
	}
}

