//package asmcup.runtime;
//import java.io.DataInputStream;
//import java.io.DataOutputStream;
//import java.io.IOException;
//import asmcup.vm.VM;
function Robot(id) {
    //int
    /*	protected final int id;
	protected VM vm;
	protected float x, y;
	protected float facing;
	protected float speed;
	protected int overclock;
	protected int battery;
	protected float motor;
	protected float steer;
	protected float lazer;
	*/
	this.x=0;
	this.y=0;
	this.facing = 0;
	this.speed=0;
	this.overclock=10;
	this.battery = undefined;
	this.motor = 0;
	this.steer = 0;
	this.lazer = 0;
	
	this.cycles = 0;
    //	public Robot(int id) {
    this.id = id;
    this.vm = new VM();
    this.battery = MAX_BATTERY;
    //	}
}

Robot.prototype.fromStream = function(stream) {
    //DataInputStream stream) throws IOException {
    this.id = stream.readInt();
    this.x = stream.readInt();
    this.y = stream.readInt();
    this.facing = stream.readFloat();
    this.battery = stream.readInt();
    this.overclock = stream.readUnsignedByte() & 0xFF;
    this.motor = stream.readUnsignedByte() & 0xFF;
    this.steer = stream.readUnsignedByte() & 0xFF;
    this.lazer = stream.readInt() & 0xFF;
    this.vm = new VM(stream);
}
Robot.prototype.getVM = function() {
    return this.vm;
}
Robot.prototype.getX = function() {
    return this.x;
}
Robot.prototype.getY = function() {
    return this.y;
}
Robot.prototype.getFacing = function() {
    return this.facing;
}
Robot.prototype.position = function(x, y) {
    this.x = x;
    this.y = y;
}
Robot.prototype.isDead = function() {
    return battery <= 0;
}
Robot.prototype.flash = function(ram) {
    this.vm = new VM(ram);
}
Robot.prototype.save = function(stream) {
    //DataOutputStream stream) throws IOException {
    stream.writeInt(id);
    stream.writeFloat(x);
    stream.writeFloat(y);
    stream.writeFloat(facing);
    stream.writeInt(battery);
    stream.writeByte(overclock);
    stream.writeFloat(motor);
    stream.writeFloat(steer);
    stream.writeFloat(lazer);
    vm.save(stream);
}
Robot.prototype.tick = function(world) {
    this.cycles += 0.1 + (this.overclock * 4);
    if(this.cycles>4.0) this.cycles = 4;
    while (this.cycles >= 1) {
        this.vm.tick();
        this.handleIO(world);
        this.cycles-=1;
    }
    this.facing += this.steer;
    this.speed += this.motor;
    if (Math.abs(this.steer) <= 0.01) {
        this.steer = 0.0;
    }
    if (Math.abs(this.motor) <= 0.01) {
        this.motor = 0.0;
    }
    if (Math.abs(this.speed) <= 0.01) {
        this.speed = 0.0;
    }
    if (this.speed > MAX_SPEED) {
        this.speed = MAX_SPEED;
    }
    var tx = this.x + Math.cos(this.facing) * this.speed;
    var ty = this.y + Math.sin(this.facing) * this.speed;
    if (!world.isSolid(tx,ty)) {
    	this.x = tx;
    	this.y = ty;
    }
}
Robot.prototype.handleIO = function(world) {
    if (!this.vm.checkIO()) {
        return;
    }
    var offset, value;
    value = this.vm.pop8();
    switch (value) {
    case IO_MOTOR:
        this.motor = this.popFloatSafe(-1.0, 1.0);
        break;
    case IO_STEER:
        this.steer = this.popFloatSafe(-1.0, 1.0);
        break;
    case IO_SENSOR:
        this.vm.pushFloat(world.ray(this.x, this.y, this.facing));
        break;
    case IO_OVERCLOCK:
        this.overclock = this.vm.pop8();
        break;
    case IO_LAZER:
        this.lazer = this.popFloatSafe(0.0, 1.0);
        break;
    case IO_BATTERY:
        this.vm.pushFloat(this.battery);
        break;
    case IO_MARK:
        offset = vm.pop8();
        value = vm.pop8();
        world.mark(this, offset, value);
        break;
    case IO_MARK_READ:
        offset = vm.pop8();
        value = world.markRead(this, offset);
        vm.push8(value);
        break;
    }
}
Robot.prototype.popFloatSafe = function(min, max) {
    var f = this.vm.popFloat();
    if (Float.isNaN(f)) {
        return min;
    }
    if (f < min) {
        return min;
    }
    if (f > max) {
        return max;
    }
    return f;
}

var IO_SENSOR = Robot.IO_SENSOR = 0;
var IO_MOTOR = Robot.IO_MOTOR = 1;
var IO_STEER = Robot.IO_STEER = 2;
var IO_OVERCLOCK = Robot.IO_OVERCLOCK = 3;
var IO_LAZER = Robot.IO_LAZER = 4;
var IO_BATTERY = Robot.IO_BATTERY = 5;
var IO_MARK = Robot.IO_MARK = 6;
var IO_MARK_READ = Robot.IO_MARK_READ = 7;
var MAX_SPEED = Robot.MAX_SPEED = 16;
var MAX_BATTERY = Robot.MAX_BATTERY = 60 * 60 * 24;
