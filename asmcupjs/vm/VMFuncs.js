//package asmcup.vm;

var VMFuncs = new function() {
	this. F_NOP = 0;
	
	// Casting
	this. F_B2F = 1;
	this. F_F2B = 2;
	
	// Bitwise (8-bit)
	this. F_NOT = 3;
	this. F_OR = 4;
	this. F_AND = 5;
	this. F_XOR = 6;
	this. F_SHL = 7;
	this. F_SHR = 8;
	
	// Arithmetic (8-bit)
	this. F_ADD8 = 9;
	this. F_SUB8 = 10;
	this. F_MUL8 = 11;
	this. F_DIV8 = 12;
	this. F_MADD8 = 13;
	
	// Arithmetic (floating)
	this. F_NEGF = 14;
	this. F_ADDF = 15;
	this. F_SUBF = 16;
	this. F_MULF = 17;
	this. F_DIVF = 18;
	this. F_MADDF = 19;
	
	// Math (floating)
	this. F_COS = 20;
	this. F_SIN = 21;
	this. F_TAN = 22;
	this. F_ACOS = 23;
	this. F_ASIN = 24;
	this. F_ATAN = 25;
	this. F_ABSF = 26;
	this. F_MINF = 27;
	this. F_MAXF = 28;
	this. F_POW = 29;
	this. F_LOG = 30;
	this. F_LOG10 = 31;
	
	// Conditional
	this. F_IF_EQ8 = 32;
	this. F_IF_NE8 = 33;
	this. F_IF_LT8 = 34;
	this. F_IF_LTE8 = 35;
	this. F_IF_GT8 = 36;
	this. F_IF_GTE8 = 37;
	
	this. F_IF_LTF = 38;
	this. F_IF_LTEF = 39;
	this. F_IF_GTF = 40;
	this. F_IF_GTEF = 41;
	
	// Integer constants
	this. F_C_0 = 42;
	this. F_C_1 = 43;
	this. F_C_2 = 44;
	this. F_C_3 = 45;
	this. F_C_4 = 46;
	this. F_C_255 = 47;
	
	// Float constants
	this. F_C_0F = 48;
	this. F_C_1F = 49;
	this. F_C_2F = 50;
	this. F_C_3F = 51;
	this. F_C_4F = 52;
	this. F_C_INF = 53;
	this. F_ISNAN = 54;
	
	this. F_DUP8 = 55;
	this. F_DUPF = 56;
	
	
	this. F_IO = 63;
}

for(var f in VMFuncs){
	window[f] = VMFuncs[f];
}
