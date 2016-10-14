//package asmcup.runtime;

//import java.util.*;

public class Cell {
	protected final World world;
	protected final int cellX, cellY;
	protected final ArrayList<Robot> robots = new ArrayList<>();
	protected final int[] tiles = new int[16 * 16];
	protected final ArrayList<Item> items = new ArrayList<>();
	
	public Cell(World world, int cellX, int cellY) {
		this.world = world;
		this.cellX = cellX;
		this.cellY = cellY;
		
		Random random = world.getCellRandom(cellX, cellY);
		
		for (int i=0; i < 16 * 16; i++) {
			int p = random.nextInt(100);
			
			if (p < 80) {
				tiles[i] = 0;
			} else {
				tiles[i] = (1 + random.nextInt(2)) << 2;
			}
		}
		
		if (random.nextInt(10) < 2) {
			generateRoom(random);
		} else {
			generateOpenArea(random);
		}
	}
	
	var getX() {
		return cellX;
	}
	
	var getY() {
		return cellY;
	}
		
	public boolean isEmpty() {
		return robots.isEmpty();
	}
	
	var getKey() {
		return key(cellX, cellY);
	}
	
	public static int key(int cellX, int cellY) {
		return (cellX & 0xFFFF) | ((cellY & 0xFFFF) << 16);
	}
	
	public Iterable<Robot> getRobots() {
		return robots;
	}
	
	public Iterable<Item> getItems() {
		return items;
	}
	
	function generateRoom(Random random) {
		int wpad = 1 + random.nextInt(5);
		int hpad = 1 + random.nextInt(5);
		int width = 15 - wpad * 2;
		int height = 15 - hpad * 2;
		
		for (int i=0; i <= width; i++) {
			setTile(wpad + i, hpad, 2 | (random.nextInt(4) << 2));
			setTile(wpad + i, 15 - hpad, 2 | (random.nextInt(4) << 2));
		}
		
		for (int i=0; i < height; i++) {
			setTile(wpad, hpad + i, 2 | (random.nextInt(4) << 2));
			setTile(15 - wpad, hpad + i, 2 | (random.nextInt(4) << 2));
		}
		
		int exits = 1 + random.nextInt(3);
		
		for (int i=0; i < exits; i++) {
			int variant = random.nextInt(4) << 2;
			
			switch (random.nextInt(4)) {
			case 0:
				setTile(wpad + 1 + random.nextInt(width - 2), hpad, variant);
				break;
			case 1:
				setTile(wpad, hpad + 1+ random.nextInt(height - 2), variant);
				break;
			case 2:
				setTile(wpad + 1 + random.nextInt(width - 2), 15 - hpad, variant);
				break;
			case 3:
				setTile(15 - wpad, hpad + 1 + random.nextInt(height - 2), variant);
				break;
			}
		}
		
		int count = random.nextInt(10);
		int goldLimit = random.nextInt(1000 * 10) - random.nextInt(5000);
		
		for (int i=0; i < count; i++) {
			Item item;
			
			switch (random.nextInt(2)) {
			case 0:
				goldLimit = Math.max(goldLimit, 0);
				Item.Gold gold = new Item.Gold(random, goldLimit);
				goldLimit -= gold.getValue();
				item = gold;
				break;
			default:
				Item.Battery battery = new Item.Battery();
				item = battery;
				break;
			}
			
			float x = (cellX + random.nextFloat()) * 16f * 32f;
			float y = (cellY + random.nextFloat()) * 16f * 32f;
			
			x = Math.max(x, (cellX * 16 + 1 + wpad) * 32);
			x = Math.min(x, (cellX * 16 + 15 - wpad - 1) * 32);
			y = Math.max(y, (cellY * 16 + 1 + hpad) * 32);
			y = Math.min(y, (cellY * 16 + 15 - hpad - 1) * 32);
			
			item.position(x, y);
			items.add(item);
		}
	}
	
	function generateOpenArea(Random random) {
		int count = random.nextInt(15);
		
		for (int i=0; i < count; i++) {
			int col = random.nextInt(16);
			int row = random.nextInt(16);
			int p = random.nextInt(100);
			
			if (p < 10) {
				generateHazards(random, col, row);
			} else if (p < 33) {
				generateRubble(random, col, row);
			} else {
				generateObstacle(random, col, row);
			}
		}
	}
	
	function generateObstacle(Random random, int col, int row) {
		setTile(col, row, 1 | (random.nextInt(4) << 2));
	}
	
	function generateRubble(Random random, int col, int row) {
		int count = 1 + random.nextInt(10);
		
		for (int i=0; i < count; i++) {
			setTile(col, row, 2 | (random.nextInt(4) << 2));
			
			if (random.nextBoolean()) {
				col = wiggle(random, col);
			} else {
				row = wiggle(random, row);
			}
		}
	}
	
	function generateHazards(Random random, int col, int row) {
		int count = 3 + random.nextInt(10);
		int variant = random.nextInt(4);
		
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
		
		for (int i=0; i < count; i++) {
			setTile(col, row, 3 | (variant << 2));
			col = wiggle(random, col);
			row = wiggle(random, row);
		}
	}
	
	protected int wiggle(Random random, int x) {
		x += random.nextInt(3) - 1;
		x = Math.min(x, 15);
		x = Math.max(x, 0);
		return x;
	}
	
	var getTile(int col, int row) {
		return tiles[col + (row * 16)];
	}
	
	function setTile(int col, int row, int value) {
		tiles[col + (row * 16)] = value;
	}
	
	function addRobot(Robot robot) {
		robots.add(robot);
	}
	
	function removeRobot(Robot robot) {
		robots.remove(robot);
	}
	
	function tick(World world) {
		for (Robot robot : robots) {
			robot.tick(world);
		}
	}
}
