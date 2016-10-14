//package asmcup.compiler;

//import java.lang.reflect.Field;
//import java.util.*;

//import asmcup.runtime.Robot;

var RobotConstsTable = new function (){
	var  consts={};
	
	function isConst(name) {
		return name.startsWith("IO_");
	}
	this.isConst = isConst;
	
	for (var field in Robot){//.getDeclaredFields()) {
		if (isConst(field)) {
			consts[field]=Robot[field];
		}
	}


	this.add = function(field) {
		consts[field.getName()]= field.getInt(null);
	}
	
	this.contains = function(s) {
		return consts[s];//.containsKey(s);
	}
	
	this.get = function (s) {
		return consts[s];
	}
}
