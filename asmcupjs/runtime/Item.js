//package asmcup.runtime;

//import java.util.Random;

function Item() {
	this.x = this.y = 0;
}

Item.prototype. getX=function() {
	return this.x;
}

Item.prototype. getY=function() {
	return this.y;
}

Item.prototype. position=function(x, y) {//f,f
	this.x = x;
	this.y = y;
}
Item.Battery=function(){//} extends Item {

}
Item.Battery.prototype = Object.create(Item.prototype);

Item.Gold=function(random,limit){//} extends Item {
	this. value=0;

	//public Gold(Random random, int limit) {
		var a = 1 + (Math.random()*10)|0;
		var b = 1 + random.nextInt(100);
		var c = random.nextInt(1000);
		this. value = a * b - c;
		this. value = Math.min(this.value, limit);
		this. value = Math.max(this.value, 1);
	//}
}
Item.Gold.prototype = Object.create(Item.prototype);


Item.Gold.prototype.getValue=function() {
	return this.value;
}

Item.Gold.prototype.getVariant=function() {
	return 0|((this.value / 1000.0) * 4);
}


