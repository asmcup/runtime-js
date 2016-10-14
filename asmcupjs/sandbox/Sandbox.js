//package asmcup.sandbox;
//import java.awt.*;
//import java.awt.geom.AffineTransform;
//import java.awt.image.BufferedImage;
//import java.io.*;
//import java.net.URL;
//import javax.imageio.ImageIO;
//import asmcup.runtime.*;
//import asmcup.runtime.Robot;
function Sandbox() {
    // {
    /*
	protected Mouse mouse;
	protected Menu menu;
	protected Canvas canvas;
	protected Frame frame;
	protected CodeEditor codeEditor;
	protected Debugger debugger;
	
	protected Image backBuffer;
	protected World world;
	protected Robot robot;
	protected int panX, panY;
	protected Image[] ground, wall, obstacles, hazards, coins;
	protected Image bot;
	*/

    var robot;
    this.panX = this.panY = 0;
    //public Sandbox() throws IOException {
    //	function Sandbox(){
    this.mouse = new Mouse(this);
    this.menu = new Menu(this);
    this.canvas = new Canvas(this);
    this.frame = new Frame(this);
    this.codeEditor = new CodeEditor(this);
    this.world = new World();
    this._debugger = new Debugger(this);
    this.canvas.addMouseListener(this.mouse);
    this.canvas.addMouseMotionListener(this.mouse);
    this.backBuffer = this.getBackBuffer();
    this.ground = this.loadImage("/ground.png");
    this.wall = this.loadImage("/wall.png");
    this.obstacles = this.loadImage("/obstacles.png");
    this.hazards = this.loadImage("/hazards.png");
    this.bot = findImageSheet("/robot.png");
    //ImageIO.read(getClass().getResource("/robot.png"));
    this.coins = this.loadImage("/gold.png");
    this.batteries = this.loadImage("/battery.png");
    //	}
}

function Canvas() {
	
}
Canvas.prototype.addMouseListener = function(ml) {
	this.mouseListener = ml;
}
Canvas.prototype.addMouseMotionListener = function(ml) {
	this.mouseMotionListener = ml;
}
Sandbox.prototype.getPanX = function() {
    return this.panX;
}
Sandbox.prototype.getPanY = function() {
    return this.panY;
}
//public Mouse getMouse() {
Sandbox.prototype.getMouse = function() {
    return this.mouse;
}
//public Menu getMenu() {
Sandbox.prototype.getMenu = function() {
    return this.menu;
}
//public Canvas getCanvas() {
Sandbox.prototype.getCanvas = function() {
    return this.canvas;
}
//public Frame getFrame() {
Sandbox.prototype.getFrame = function() {
    return this.frame;
}
Sandbox.prototype.getCodeEditor = function() {
    return this.codeEditor;
}
Sandbox.prototype.getDebugger = function() {
    return this._debugger;
}
Sandbox.prototype.getWorld = function() {
    return this.world;
}
Sandbox.prototype.getRobot = function() {
    return this.robot;
}
Sandbox.prototype.pan = function(dx, dy) {
    //int,int
    this.panX += dx;
    this.panY += dy;
}
Sandbox.prototype.teleport = function(x, y) {
    //float float
    this.world.position(robot, x, y);
}
//protected Image[] loadImage(String path) throws IOException {
Sandbox.prototype.loadImage = function(path) {
    //String path) throws IOException {
    /*
		URL url = getClass().getResource(path);
		Image sheet = ImageIO.read(url);
		Image[] variants = new Image[4];
		
		for (int i=0; i < 4; i++) {
			Image img = new BufferedImage(32, 32, BufferedImage.TYPE_INT_ARGB);
			Graphics g = img.getGraphics();
			g.drawImage(sheet, -i * 32, 0, null);
			variants[i] = img;
		}
		*/
    var variants = [];
    var sheet = findImageSheet(path);
    for (var i = 0; i < 4; i++) {
        var img = document.createElement('canvas');
        img.width = img.height = 32;
        var dctx = img.getContext('2d');
        dctx.drawImage(sheet, -i * 32, 0)
        variants.push(img)
    }
    //throw ("LOAD IMAGES!!");
    return variants;
}


Sandbox.prototype.simTick = function() {
	
    if(!this.frame.isVisible())
    	return;
    
	this.lastTick = System.currentTimeMillis();
	//synchronized (world) {
	this.world.tick();
	this._debugger.repaint();
	//}
	if (this.backBuffer != null ) {
		//synchronized (backBuffer) {
		this.draw();
		//}
	}
	this.frame.repaint();
//	var now = System.currentTimeMillis();
//	var span = now - this.lastTick;
//	var wait = (1000 - span);

}

Sandbox.prototype.add = function(robot){
	this.world.addRobot(robot);
}

Sandbox.prototype.run = function() {
    this.robot = new Robot(1);
    this.world.addRobot(this.robot);
    this.frame.setVisible(true);
    this.lastTick = System.currentTimeMillis();

    this.task = setInterval(function(scope){return function(){
    	scope.simTick.call(scope);
    	//console.log('time:'+(scope.lastTick/1000));
    }}(this),100);

}

Sandbox.prototype.reseed = function() {
    this.world = new World();
    this.world.addRobot(this.robot);
    this.redraw();
}
Sandbox.prototype.centerView = function() {
    this.panX = this.robot.getX() | 0;
    this.panY = this.robot.getY() | 0;
    this.redraw();
}
Sandbox.prototype.draw = function() {
    if (this.backBuffer == null ) {
        return;
    }
    /*Graphics*/
    var g = this.backBuffer.getGraphics();
    g.setColor(Color.BLACK);
    g.fillRect(0, 0, 800, 600);
    var left = 0 | Math.floor((this.panX - 400.0) / (16.0 * 32.0));
    var right = 0 | Math.ceil((this.panX + 400.0) / (16.0 * 32.0));
    var top = 0 | Math.floor((this.panY - 300.0) / (16.0 * 32.0));
    var bottom = 0 | Math.ceil((this.panY + 300.0) / (16.0 * 32.0));
    for (var cellY = top; cellY < bottom; cellY++) {
        for (var cellX = left; cellX < right; cellX++) {
            this.drawCellTiles(g, this.world.getCell(cellX, cellY));
        }
    }
    for (var cellY = top; cellY < bottom; cellY++) {
        for (var cellX = left; cellX < right; cellX++) {
            this.drawCellObjects(g, this.world.getCell(cellX, cellY));
        }
    }
}
Sandbox.prototype.drawCellTiles = function(g, cell) {
    //Graphics g, Cell cell) {
    var left = cell.getX() * 16;
    var right = left + 16;
    var top = cell.getY() * 16;
    var bottom = top + 16;
    for (var row = top; row < bottom; row++) {
        for (var col = left; col < right; col++) {
            var tile = cell.getTile(col - left, row - top);
            this.drawTile(g, col, row, tile);
        }
    }
    g.setColor(Color.WHITE);
    var x = 400 + left * 32 - this.panX;
    var y = 300 + top * 32 - this.panY;
    g.drawRect(x, y, 16 * 32, 16 * 32);
    var msg = String.format("%d, %d", cell.getX(), cell.getY());
    g.drawString(msg, x + 100, y + 100);
    msg = String.format("%x", cell.getKey());
    g.drawString(msg, x + 100, y + 150);
}
Sandbox.prototype.drawTile = function(g, col, row, tile) {
    //Graphics g, int col, int row, int tile) {
    var x = 400 + col * 32 - this.panX;
    var y = 300 + row * 32 - this.panY;
    var variant = (tile >> 2) & 0b11;
    switch (tile & 0b11) {
    case 0:
        this.drawVariant(g, this.ground, x, y, variant);
        break;
    case 1:
        this.drawVariant(g, this.ground, x, y, variant ^ 0b11);
        this.drawVariant(g, this.obstacles, x, y, variant);
        break;
    case 2:
        this.drawVariant(g, this.wall, x, y, variant);
        break;
    case 3:
        this.drawVariant(g, this.hazards, x, y, variant);
        break;
    }
}
Sandbox.prototype.drawCellObjects = function(g, cell) {
    //Graphics g, Cell cell) {
    var items = cell.getItems();
    //		for (Item item : cell.getItems()) {
    for (var item=0;item<items.length;item++) {
        this.drawItem(g, items[item]);
    }
    var robots = cell.getRobots();
    //		for (Robot robot : cell.getRobots()) {
    for (var robot in robots) {
        //
        this.drawRobot(g, robots[robot]);
    }
}

Sandbox.prototype.drawTransformedSprite = function(g,img,x,y,rotation,scale){
	g.ctx.save();
	g.ctx.translate(x,y);
	g.ctx.rotate(rotation);
	var iw=img.width*scale;
	var ih=img.height*scale;
	g.ctx.drawImage(img,-(iw*0.5),-(ih*0.5),iw,ih);
	g.ctx.restore();
}

Sandbox.prototype.drawRobot = function(lg, robot) {
    //Graphics lg, Robot robot) {
    /*Graphics2D*/
    var g = lg;
    //(Graphics2D)lg;
    var x = 0 | robot.getX();
    var y = 0 | robot.getY();
    var sx = 400 + x - this.panX;
    var sy = 300 + y - this.panY;
    //AffineTransform

	this.drawTransformedSprite(g,this.bot,sx,sy,robot.getFacing(),1.0);
	g.drawString(''+robot.vm.pc,sx,sy);
//    var t = g.getTransform();
//    g.rotate(robot.getFacing(), sx + 16, sy + 16);
//    g.drawImage(this.bot, sx, sy, null );
//    g.setTransform(t);
}


Sandbox.prototype.drawVariantItem = function(g, item, imgs, variant) {//Graphics g, Item.Battery battery) {
    var x = 400 + (0 | item.getX()) - this.panX;
    var y = 300 + (0 | item.getY()) - this.panY;
    g.drawRect(x,y,32,32);
    this.drawVariant(g, imgs, x, y, variant);
}

Sandbox.prototype.drawItemBattery = function(g, battery) {
	this.drawVariantItem(g,battery,this.batteries,0)
}

    //Graphics g, Item.Gold gold) {
Sandbox.prototype.drawItemGold = function(g, gold) {
    //Graphics g, Item.Gold gold) {
    this.drawVariantItem(g, gold, this.coins,gold.getVariant());
    //this.drawVariant(g, this.coins, x, y, gold.getVariant());
}

Sandbox.prototype.drawItem = function(g, item) {
    //Graphics g, Item item) {
    if (item instanceof Item.Battery) {
        this.drawItemBattery(g, item);
    } else if (item instanceof Item.Gold) {
        this.drawItemGold(g, item);
    }
}

Sandbox.prototype.drawVariant = function(g, imgs, x, y, variant) {
    //Graphics g, Image[] imgs, int x, int y, int variant) {
    g.drawImage(imgs[variant], x, y, null );
}
Sandbox.prototype.sleep = function(ms) {
    //int
    if (ms <= 0) {
        return;
    }
    try {
        Thread.sleep(ms);
    } catch (e) {//InterruptedException e) {
    }
}
//protected Image
Sandbox.prototype.createBackBuffer = function() {
    /*Image*/
    var img = this.frame.createVolatileImage(800, 600);
    if (img == null ) {
        return null ;
    }
    /*Graphics*/
    var g = img.getGraphics();
    g.setColor(Color.BLACK);
    g.fillRect(0, 0, 800, 600);
    return img;
}
Sandbox.prototype.redraw = function() {
    if (this.backBuffer != null ) {
        //synchronized (backBuffer) {
        this.draw();
        //}
        //this.frame.repaint();
    }
}
//public Image getBackBuffer() {
Sandbox.prototype.getBackBuffer = function() {
    if (this.backBuffer == null ) {
        this.backBuffer = this.createBackBuffer();
    }
    return this.backBuffer;
}
Sandbox.prototype.quit = function() {
    System.exit(0);
}
