//package asmcup.compiler;

//import java.util.*;

//import asmcup.vm.VMConsts;

function Compiler(){// implements VMConsts {

	var statements = this. statements = [];
	var labels = this. labels={};
	var ram = this. ram = [];
	this. pc = 0;

	function write8(value) {
		ram[pc] = (value & 0xFF);
		pc = (pc + 1) & 0xFF;
	}
	
	function writeOp(op, data) {
		if ((op >> 2) != 0) {
			throw "Opcode is greater than 2-bits";
		}
		
		if ((data >> 6) != 0) {
			throw "Opcode data is greater than 6-bits";
		}
		
		write8(op | (data << 2));
	}
	
	function write16(value) {
		write8(value & 0xFF);
		write8(value >> 8);
	}
	
	function write32(value) {
		write16(value & 0xFFFF);
		write16(value >> 16);
	}
	
	function writeFloat(value) {//float
		write32(Float.floatToRawIntBits(value));
	}
	
	function compileLines(lines) { //byte[] > String[] 
		ram = new Array(256);//byte[256];
		labels = {};//new HashMap<>();
		statements = [];//new ArrayList<>();
		pc = 0;
		
		for (var line in lines) {
			parseLine(lines[line]);
		}
		
		pc = 0;
		
		for (var statement in statements) {
			pc += statements[statement].measure();
		}
		
		pc = 0;
		
		for (var statement in statements) {
			statements[statement].compile();
		}
		
		//labels={};//.clear();
		//statements = [];
		labels = null;
		statements = null;
		pc = 0;
		
		var compiled = ram;
		ram = null;
		return compiled;
	}
	
	function compile(source) {
		return compileLines(source.split("\n"));
	}
	this.compile = compile;
	
	function parseLine(line) {
		line = line.trim();
		
		if (line.length==0){//.isEmpty()) {
			return;
		}
		
		line = parseComments(line);
		line = parseLabels(line);
		
		if (line.length==0){//.isEmpty()) {
			return;
		}
		
		//var parts = line.split("\\s+", 2);
		var parts = line.split(/[ ]+/);//, 2);
		
		if (parts.length <= 0) {
			return;
		}
		
		var cmd = parts[0].toLowerCase().trim();
		var args = parseArgs(parts);
		parseStatement(cmd, args);
	}
	
	function parseStatement(cmd,args) {
		switch (cmd) {
		case "db":
		case "db8":
			db(args);
			break;
		case "dbf":
			dbf(args);
			break;
		case "push8":
			push8(args);
			break;
		case "push8r":
			push8r(args);
			break;
		case "pop8":
			pop8(args);
			break;
		case "pop8r":
			pop8r(args);
			break;
		case "pushf":
			pushf(args);
			break;
		case "popf":
			popf(args);
			break;
		case "jne":
		case "jnz":
			jnzr(args);
			break;
		case "jnzr":
		case "jner":
			jnzr(args);
			break;
		case "jmp":
			jmp(args);
			break;
		default:
			func(cmd, args);
			break;
		}
	}
	
	var NO_DATA = undefined;//[];
	
	function func(cmd, args) {
		if (!VMFuncTable.exists(cmd)) {
			throw new IllegalArgumentException("Unknown function " + cmd);
		}
		
		immediate(OP_FUNC, VMFuncTable.parse(cmd), NO_DATA);
	}
	
	function db(args) {
		var st ={};

		statements.add(st);
		st. measure = function() {
			return args.length;
		}

		st. compile = function () {
			for (var s in args) {
				write8(parseLiteral(args[s]));
			}
		}
	}
	
	function dbf(args) {
		var st;
		statements.push(st = {});

		st.measure = function() {
				return args.length * 4;
			}
			
		st.compile = function() {
			for (var s in args) {
				writeFloat(parseFloat(args[s]));
			}
		}
	}
	
	function push8(args) {
		var s = expectOne(args);
		
		if (isLiteral(s)) {
			pushLiteral8(args);
		} else {
			pushMemory8(args);
		}
	}
	
	function pushLiteral8(args) {
		switch (parseLiteral(expectOne(args))) {
		case 0:
			immediate(OP_FUNC, F_C_0, NO_DATA);
			break;
		case 1:
			immediate(OP_FUNC, F_C_1, NO_DATA);
			break;
		case 2:
			immediate(OP_FUNC, F_C_2, NO_DATA);
			break;
		case 3:
			immediate(OP_FUNC, F_C_3, NO_DATA);
			break;
		case 4:
			immediate(OP_FUNC, F_C_4, NO_DATA);
			break;
		case 255:
			immediate(OP_FUNC, F_C_255, NO_DATA);
			break;
		default:
			immediate(OP_PUSH, MAGIC_PUSH_BYTE_IMMEDIATE, args);
			break;
		}
	}
	
	function pushMemory8(args) {
		reference(OP_PUSH, MAGIC_PUSH_BYTE_MEMORY, args);
	}
	
	function push8r(args) {
		relative(OP_PUSH, args);
	}
	
	function pop8(args) {
		reference(OP_POP, MAGIC_POP_BYTE, args);
	}
	
	function pop8r(args) {
		relative(OP_POP, args);
	}
	
	function pushf(args) {
		var s = expectOne(args);//String
		
		if (isSymbol(s)) {
			pushMemoryFloat(s);
		} else {
			pushLiteralFloat(s);
		}
	}
	
	function pushMemoryFloat(args) {
		reference(OP_PUSH, MAGIC_PUSH_FLOAT_MEMORY, args);
	}
	
	function pushLiteralFloat(s) {
		var f = parseFloat(s);
		
		if (f == 0.0) {
			immediate(OP_FUNC, F_C_0F, NO_DATA);
		} else if (f == 1.0) {
			immediate(OP_FUNC, F_C_1F, NO_DATA);
		} else if (f == 2.0) {
			immediate(OP_FUNC, F_C_2F, NO_DATA);
		} else if (f == 3.0) {
			immediate(OP_FUNC, F_C_3F, NO_DATA);
		} else if (f == 4.0) {
			immediate(OP_FUNC, F_C_4F, NO_DATA);
		} else if (!isFinite(f)) {
			immediate(OP_FUNC, F_C_INF, NO_DATA);
		} else {
			immediateFloat(OP_PUSH, MAGIC_PUSH_FLOAT_IMMEDIATE, s);
		}
	}
	
	function popf(args) {
		reference(OP_BRANCH, MAGIC_POP_FLOAT, args);
	}
	
	function jnz(args) {
		var s = expectOne(args);
		
		if (isIndirect(s)) {
			s = s.substring(1, s.length() - 1);
			reference(OP_BRANCH, MAGIC_BRANCH_INDIRECT, s);
		} else {
			reference(OP_BRANCH, MAGIC_BRANCH_IMMEDIATE, s);
		}
	}
	
	function jnzr(args) {
		relative(OP_BRANCH, args);
	}
	
	function jmp(args) {
		reference(OP_BRANCH, MAGIC_BRANCH_ALWAYS, args);
	}
	
	function isLiteral(s) {
		return s.startsWith("#");
	}
	
	function isSymbol(s) {
		//return s.matches("^[a-zA-Z_]+[a-zA-Z_0-9]*$");
		var re=/^[a-zA-Z_]+[a-zA-Z_0-9]*$/;
		
		return s.match(re);
	}
	
	function isIndirect(s) {
		return isEnclosed(s, "(", ")") || isEnclosed(s, "[", "]");
	}
	
	function isEnclosed(s,start,end) {
		if (s.startsWith(start)) {
			if (!s.endsWith(end)) {
				throw String.format("Expected '%s'", s);
			}
			
			return true;
		}
		
		return false;
	}
	
	function expectOne(args) {
		return args[0];
	}
	
	function parseComments( line) {
		var pos = line.indexOf(';');
		
		if (pos < 0) {
			return line.trim();
		}
		
		return line.substring(0, pos).trim();
	}
	
	function parseLabels(line) {
		var pos;
		
		while ((pos = line.indexOf(':')) >= 0) {
			if (pos == 0) {
				throw new IllegalArgumentException("Expected label name");
			}
			
			var name = line.substring(0, pos);
			statements.push(new Label(name));
			line = line.substring(pos + 1).trim();
		}
		
		return line.trim();
	}
	
	var EMPTY_ARGS = {};
	
	function parseArgs(parts) {
		if (parts.length <= 1) {
			return EMPTY_ARGS;
		}
		
		args = parts[1].split(",");
		
		for (var i=0; i < args.length; i++) {
			args[i] = args[i].trim();
		}
		
		return args;
	}
	
	function parseLiteral(s) {
		//if (!s.startsWith("#")) {
		//	throw new IllegalArgumentException("Expected #");
		//}
		console.log("parse literal:",s);
		if (s.indexOf("#")!=0) {
			throw ("Expected #!");
		}
		
		s = s.substring(1);
		
		if (RobotConstsTable.contains(s)) {
			return RobotConstsTable.get(s);
		}
		
		if (s.startsWith("$")) {
			return parseInt(s.substring(1), 16);
		}
		
		return parseInt(s, 10);
	}
	
	function referenceString(op, data, s) {//int int string
		var st = {}
		statements.push(st);
		st.measure =function() {
			return 2;
		}

		st.compile=function() {
			if (labels[s]==undefined){//.containsKey(s)) {
				//throw new IllegalArgumentException(String.format("Cannot find label '%s'", s));
				throw String.format("Cannot find label '%s'", s);
			}

			writeOp(op, data);
			write8(labels[s]);
		}
	}
	
	function referenceArray(op, data, args) { //int int array
		referenceString(op, data, expectOne(args));
	}
	function reference(op,data,args){
		if(args.constructor === Array)
			referenceArray(op,data,args);
		else
			referenceString(op,data,args);
	}
	function immediateByteArray(op, data,  payload) {//int int byte[]
	var st={};
		statements.push(st);
		st.measure = function() {
			return 1 + payload.length;
		}

		st.compile = function() {
			writeOp(op, data);

			for (var b in payload) {
				write8(payload[b]);
			}
		}
	}
	
	function immediateStringArray(op, data, args) {
		immediateString(op, data, expectOne(args));
	}
	
	function immediateString(op, data, s) {
		var payload = [parseLiteral(s)];
		immediateByteArray(op, data, payload);
	}
	function immediate(op, data, s){
		if(typeof s == 'undefined'){
			immediateByteArray(op,data,[]);
		}else if(typeof s == 'string'){
			immediateString(op,data,s);
		}else if(s.constructor === Array){
			immediateStringArray(op,data,s)
		}else alert("Bad type!");
	}
	
	function immediateFloat(op, data, s) {
		var st={};
		statements.push(st);

		st.measure = function() {
			return 5;
		}

		st.compile=function() {
			writeOp(op, data);
			writeFloat(parseFloat(s));
		}
		
	}
	
	function relative(op, s) {
		if (isLiteral(s)) {
			throw "Cannot address a literal for relative instruction";
		}
		
		var st={};
		statements.add(st);
		st. measure=function() {
			return 1;
		}

		st. compile=function() {
			var addr = labels.get(s);
			var r = addr - pc;

			if (r < -32 || r > 31) {
				throw "Address is not within range";
			}

			writeOp(op, 32 + r);
		}

	}
	
	function relative(op, args) {
		relative(op, expectOne(args));
	}
	
	//function Statement() {
		//public abstract int measure();
		//public abstract void compile();
	//}
	
	function Label(name) {
		Label.prototype.name = name;

		//final String name;
		
		
		this.measure = function () {
			labels[name]=pc;
			return 0;
		}
		
		this.compile = function () {
			
		}
	}
}