//package asmcup.runtime;

//import java.util.*;

function Cell( world,  cellX,  cellY){//World int int
	//World world;
	//int cellX, cellY;
	//ArrayList<Robot> robots = new ArrayList<>();
	this.robots=[];
	this. tiles = new Array(16*16);//new int[16 * 16];
	this. items = [];//ArrayList<Item> items = new ArrayList<>();
	
	//public Cell(World world, int cellX, int cellY) {
		this.world = world;
		this.cellX = cellX;
		this.cellY = cellY;
		
		var random = world.getCellRandom(cellX, cellY);
		
		for (var i=0; i < 16 * 16; i++) {
			var p = random.nextInt(100);
			
			if (p < 80) {
				this.tiles[i] = 0;
			} else {
				this.tiles[i] = (1 + random.nextInt(2)) << 2;
			}
		}
		
		if (random.nextInt(10) < 2) {
			this.generateRoom(random);
		} else {
			this.generateOpenArea(random);
		}
	//}
}

	Cell.prototype. getX = function() {
		return this.cellX;
	}
	
	Cell.prototype. getY= function() {
		return this.cellY;
	}
		
	Cell.prototype. isEmpty= function() {
		return this.robots.isEmpty();
	}
	
	Cell.prototype. getKey= function() {
		return Cell.key(this.cellX, this.cellY);
	}
	
	Cell.key= function(cellX, cellY) {
		return ''+cellX+','+cellY;//(cellX & 0xFFFF) | ((cellY & 0xFFFF) << 16);
	}
	
	Cell.prototype. getRobots= function() {
		return this.robots;
	}
	
	Cell.prototype. getItems= function() {
		return this.items;
	}
	
	Cell.prototype.  generateRoom= function(random) {//Random
		var wpad = 1 + random.nextInt(5);
		var hpad = 1 + random.nextInt(5);
		var width = 15 - wpad * 2;
		var height = 15 - hpad * 2;
		
		for (var i=0; i <= width; i++) {
			this.setTile(wpad + i, hpad, 2 | (random.nextInt(4) << 2));
			this.setTile(wpad + i, 15 - hpad, 2 | (random.nextInt(4) << 2));
		}
		
		for (var i=0; i < height; i++) {
			this.setTile(wpad, hpad + i, 2 | (random.nextInt(4) << 2));
			this.setTile(15 - wpad, hpad + i, 2 | (random.nextInt(4) << 2));
		}
		
		var exits = 1 + random.nextInt(3);
		
		for (var i=0; i < exits; i++) {
			var variant = random.nextInt(4) << 2;
			
			switch (random.nextInt(4)) {
			case 0:
				this.setTile(wpad + 1 + random.nextInt(width - 2), hpad, variant);
				break;
			case 1:
				this.setTile(wpad, hpad + 1+ random.nextInt(height - 2), variant);
				break;
			case 2:
				this.setTile(wpad + 1 + random.nextInt(width - 2), 15 - hpad, variant);
				break;
			case 3:
				this.setTile(15 - wpad, hpad + 1 + random.nextInt(height - 2), variant);
				break;
			}
		}
		
		var count = random.nextInt(10);
		var goldLimit = random.nextInt(1000 * 10) - random.nextInt(5000);
		
		for (var i=0; i < count; i++) {
			var item;//Item
			
			switch (random.nextInt(2)) {
			case 0:
				goldLimit = Math.max(goldLimit, 0);
				var gold = new Item.Gold(random, goldLimit);
				goldLimit -= gold.getValue();
				item = gold;
				break;
			default:
				var battery = new Item.Battery();
				item = battery;
				break;
			}
			
			var x = (this.cellX + random.nextFloat()) * 16 * 32;
			var y = (this.cellY + random.nextFloat()) * 16 * 32;
			
			x = Math.max(x, (this.cellX * 16 + 1 + wpad) * 32);
			x = Math.min(x, (this.cellX * 16 + 15 - wpad - 1) * 32);
			y = Math.max(y, (this.cellY * 16 + 1 + hpad) * 32);
			y = Math.min(y, (this.cellY * 16 + 15 - hpad - 1) * 32);
			
			item.position(x, y);
			this.items.push(item);
		}
	}
	
	Cell.prototype.  generateOpenArea = function(random) {
		var count = random.nextInt(15);
		
		for (var i=0; i < count; i++) {
			var col = random.nextInt(16);
			var row = random.nextInt(16);
			var p = random.nextInt(100);
			
			if (p < 10) {
				this.generateHazards(random, col, row);
			} else if (p < 33) {
				this.generateRubble(random, col, row);
			} else {
				this.generateObstacle(random, col, row);
			}
		}
	}
	
	Cell.prototype.  generateObstacle = function(random, col, row) {
		this.setTile(col, row, 1 | (random.nextInt(4) << 2));
	}
	
	Cell.prototype.  generateRubble = function(random, col, row) {
		var count = 1 + random.nextInt(10);
		
		for (var i=0; i < count; i++) {
			this.setTile(col, row, 2 | (random.nextInt(4) << 2));
			
			if (random.nextBoolean()) {
				col = this.wiggle(random, col);
			} else {
				row = this.wiggle(random, row);
			}
		}
	}
	
	Cell.prototype.  generateHazards = function(random, col, row) {
		var count = 3 + random.nextInt(10);
		var variant = random.nextInt(4);
		
		switch (variant) {
		case 0:
			count = 3 + random.nextInt(10);
			break;
		case 1:
			count = 2 + random.nextInt(5);
			break;
		case 2:
			count = 1 + random.nextInt(3);
			break;
		case 3:
			count = 1;
			break;
		}
		
		for (var i=0; i < count; i++) {
			this.setTile(col, row, 3 | (variant << 2));
			col = this.wiggle(random, col);
			row = this.wiggle(random, row);
		}
	}
	
	Cell.prototype.  wiggle = function( random, x) {
		x += random.nextInt(3) - 1;
		x = Math.min(x, 15);
		x = Math.max(x, 0);
		return x;
	}
	
	Cell.prototype.  getTile = function( col,  row) {
		return this.tiles[col + (row * 16)];
	}
	
	Cell.prototype.  setTile = function( col,  row,  value) {
		this.tiles[col + (row * 16)] = value;
	}
	
	Cell.prototype.  addRobot = function( robot) {
		this.robots.push(robot);
	}
	
	Cell.prototype.  removeRobot = function( robot) {
		this.robots.remove(robot);
	}
	
	Cell.prototype.  tick = function( world) {
		for (var  robot in this.robots) {
			this.robots[robot].tick(world);
		}
	}

