//package asmcup.runtime;
//import java.io.*;
//import java.util.*;
function World(seed) {
    this.cells = {};
    
    /*	protected final HashMap<Integer, Cell> cells;
	protected int seed;
	protected int frame;
	protected Random random;
*/
    this.frame = 0;
    this.seed = seed != undefined ? seed : new Random().nextInt();
}
//	function World() {
//		this(new Random().nextInt());
//	}
World.prototype.fromSeed = function(seed) {
    //int
    this.cells = {};
    // new HashMap<>();
    this.random = new Random(seed);
    this.seed = seed;
    this.frame = 0;
}
World.prototype.fromStream = function(stream) {
    //DataInputStream stream) throws IOException {
    this.cells = {};
    //new HashMap<>();
    this.seed = stream.readInt();
    this.random = new Random(seed);
    this.frame = stream.readInt();
}
World.prototype.getSeed = function() {
    return seed;
}
World.prototype.getCellRandom = function(cellX, cellY) {
    return new Random(this.seed ^ Cell.key(cellX, cellY));
}
World.prototype.addRobot = function(robot) {
    this.getCellXY(robot.getX(), robot.getY()).addRobot(robot);
}
World.prototype.position = function(robot, x, y) {
    var oldCell = getCellXY(robot.getX(), robot.getY());
    var cell = getCellXY(x, y);
    if (oldCell != cell) {
        oldCell.removeRobot(robot);
        cell.addRobot(robot);
    }
    robot.position(x, y);
}
World.prototype.getCell = function(cellX, cellY) {
    var key = Cell.key(cellX, cellY);
    var cell = this.cells[key];
    if (cell == null ) {
        cell = new Cell(this,cellX,cellY);
        this.cells[key]=cell;
    }
    return cell;
}
World.prototype.getCellXY = function(x, y) {
    x = x | 0;
    y = y | 0;
    return this.getCell(x / (16 * 32), y / (16 * 32));
}
//World.prototype. getCellXY= function( x, y) {
//	return getCellXY(x|0,y|0);
//}
World.prototype.getTile = function(column, row) {
    var cellX = 0|column / 16;
    var cellY = 0|row / 16;
    var cell = this.getCell(cellX, cellY);
    return cell.getTile(column - cellX * 16, row - cellY * 16);
}
World.prototype.getTileXY = function(x, y) {
    return this.getTile(0|(x / 32),0|(y / 32));
}
World.prototype.isSolid = function(x, y) {
    return (this.getTileXY(x, y)&3) !=0 ? true:false;//== 1;
}
World.prototype.ray = function(x, y, theta) {
    var distance = 0.0;
    for (var i = 0; i < 10; i++) {
        if (this.isSolid(x, y)) {
            return distance;
        }
        x += Math.cos(theta) * 16;
        y += Math.sin(theta) * 16;
    }
    return Float.POSITIVE_INFINITY;
}
World.prototype.save = function(stream) {//DataOutputStream stream) throws IOException {
}

World.prototype.forEachRobot = function(fn) {
    for (var cell in this.cells) {
        var rs =  this.cells[cell].robots;
        for(var i=0;i<rs.length;i++){
            fn.call(rs[i]);
        }
    }
}

World.prototype.tick = function() {
    for (var cell in this.cells) {
        this.cells[cell].tick(this);
    }
    this.frame++;
}
World.prototype.mark = function(robot, offset, value) {//Robot,int,int
}
World.prototype.markRead = function(robot, offset) {
    // TODO Auto-generated method stub
    return 0;
}
