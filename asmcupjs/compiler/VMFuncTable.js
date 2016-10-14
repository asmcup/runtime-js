//package asmcup.compiler;

//import java.lang.reflect.Field;
//import java.util.HashMap;
//import java.util.Map;

//import asmcup.vm.VMFuncs;

var VMFuncTable = new function(){
	var funcs ={};//private static final Map<String, Integer> funcs;
	var reverse={};//private static final Map<Integer, String> reverse;
/*
	static {
		funcs = new HashMap<>();
		reverse = new HashMap<>();

		for (Field field : VMFuncs.class.getDeclaredFields()) {
			try {
				bind(field);
			} catch (Exception e) {
				throw new RuntimeException("Failed to access static member via reflection");
			}
		}
	}*/
	for(var field in VMFuncs){
		bindFV(field,VMFuncs[field]);
	}

	function bindFV(field,value){//Field field) throws Exception {
		var s = field;//.getName();

		if (!s.startsWith("F_")) {
			return;
		}

		//var value = field.getInt(null);
		//s = s.substring("F_".length()).toLowerCase();
		value = parseInt(value);
		s = s.substring("F_".length).toLowerCase();
		bind(s, value);
	}

	function bind( name, code) {
		funcs[name]=code;
		reverse[code]=name;
		
	}
	
	function parse(s) {
		return funcs[s.toLowerCase().trim()];
	}
	this.parse = parse;
	
	function unparse(index) {
		return reverse.get(index);
	}
	this.unparse = unparse;
	
	function exists(name) {
		//return funcs.containsKey(name.toLowerCase().trim());
		return funcs[name.toLowerCase().trim()];
	}
	this.exists = exists;
}
