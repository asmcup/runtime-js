//package asmcup.sandbox;

//import java.awt.*;

//import javax.swing.JComponent;
/*
function Canvas extends JComponent {
	protected final Sandbox sandbox;
	
	public Canvas(Sandbox sandbox) {
		this.sandbox = sandbox;
		setPreferredSize(new Dimension(800, 600));
	}
	
	@Override
	function paintComponent(Graphics g) {
		Image backBuffer = sandbox.getBackBuffer();
		
		if (backBuffer == null) {
			return;
		}
		
		synchronized (backBuffer) {
			g.drawImage(backBuffer, 0, 0, null);
		}
	}
}*/