//package asmcup.vm;

//public interface VMConsts extends VMFuncs {
	var OP_FUNC = 0;
	var OP_PUSH = 1;
	var OP_POP = 2;
	var OP_BRANCH = 3;
	
	var MAGIC_PUSH_BYTE_MEMORY = 0;
	var MAGIC_PUSH_FLOAT_MEMORY = 31;
	var MAGIC_PUSH_BYTE_IMMEDIATE = 32;
	var MAGIC_PUSH_FLOAT_IMMEDIATE = 33;
	
	var MAGIC_POP_BYTE = 0;
	var MAGIC_POP_FLOAT = 31;
	var MAGIC_POP_BYTE_INDIRECT = 32;
	var MAGIC_POP_FLOAT_INDIRECT = 33;
	
	var MAGIC_BRANCH_ALWAYS = 31;
	var MAGIC_BRANCH_IMMEDIATE = 32;
	var MAGIC_BRANCH_INDIRECT = 33;
	
//}
