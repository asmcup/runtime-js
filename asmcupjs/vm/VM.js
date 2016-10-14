//package asmcup.vm;
//import java.io.DataInputStream;
//import java.io.DataOutputStream;
//import java.io.IOException;

function VM(ram) {
    //implements VMConsts {
    if (ram) {
        if (ram.length != 256) {
            throw "Memory must be 256 bytes";
        }
        this.ram = ram;
    } else
        this.ram = new Array(256);
    this.pc = this.sp = 0;
    //int,int
    this.io = false;
    //boolean
}
VM.prototype.fromStream = function(stream) {
    //DataInputStream stream) throws IOException {
    this.ram = new byte[256];
    stream.readFully(this.ram);
    this.pc = stream.readUnsignedByte() & 0xFF;
    this.sp = stream.readUnsignedByte() & 0xFF;
    this.io = stream.readBoolean();
}
VM.prototype.save = function(stream) {
    //DataOutputStream stream) throws IOException {
    stream.write(this.ram);
    stream.writeByte(this.pc);
    stream.writeByte(this.sp);
    stream.writeBoolean(this.io);
}
VM.prototype.getProgramCounter = function() {
    return this.pc;
}
VM.prototype.getStackPointer = function() {
    return 0xFF - this.sp;
}
VM.prototype.getMemory = function() {
    return this.ram;
}
VM.prototype.read8pc = function() {
    var value = this.ram[this.pc] & 0xFF;
    this.pc = (this.pc + 1) & 0xFF;
    return value;
}
VM.prototype.read8 = function(addr) {
    return addr!=undefined?this.ram[addr & 0xFF] & 0xFF:this.read8pc()
        
}
VM.prototype.read8indirect = function() {
    return this.ram[this.read8()] & 0xFF;
}
VM.prototype.read16pc = function() {
    return this.read8() | (this.read8() << 8);
}
VM.prototype.read16 = function(addr) {
    return addr!=undefined?this.read8(addr) | (this.read8(addr + 1) << 8):this.read16pc()
}
VM.prototype.read32pc = function() {
    return this.read16() | (this.read16() << 16);
}
VM.prototype.read32 = function(addr) {
    return addr!=undefined?this.read16(addr) | (this.read16(addr + 2) << 16):this.read32pc();
}
VM.prototype.readFloat = function() {
    return Float.intBitsToFloat(this.read32());
}
VM.prototype.readFloatIndirect = function() {
    return Float.intBitsToFloat(this.read32(this.read8()));
}
VM.prototype.write8 = function(addr, value) {
    this.ram[addr & 0xFF] = value & 0xff;
}
VM.prototype.write16 = function(addr, value) {
    this.write8(addr, value);
    this.write8(addr + 1, value >> 8);
}
VM.prototype.write32 = function(addr, value) {
   this. write16(addr, value);
   this.write16(addr + 2, value >> 16);
}
VM.prototype.writeFloat = function(addr, value) {
    this.write32(addr, Float.floatToRawIntBits(value));
}
VM.prototype.push8 = function(x) {
    if(typeof (x)=='boolean')x=x==true?1:0;
    this.ram[0xFF - this.sp] = x;
    this.sp = (this.sp + 1) & 0xFF;
}
//VM.prototype.push8bool = function(x) {
    //boolean
//    this.push8(x ? 1 : 0);
//}

VM.prototype.push16 = function(x) {
    this.push8(x);
    this.push8(x >> 8);
}
VM.prototype.push32 = function(x) {
    this.push16(x);
    this.push16(x >> 16);
}
VM.prototype.pushFloat = function(x) {
    this.push32(Float.floatToRawIntBits(x));
}
//VM.prototype.pushFloat = function(x) {
//    this.pushFloat(x);
//}
VM.prototype.pop8 = function() {
    this.sp = (this.sp - 1) & 0xFF;
    return this.ram[0xFF - this.sp] & 0xFF;
}
VM.prototype.pop16 = function() {
    return (this.pop8() << 8) | this.pop8();
}
VM.prototype.pop32 = function() {
    return (this.pop16() << 16) | this.pop16();
}
VM.prototype.popFloat = function() {
    return Float.intBitsToFloat(this.pop32());
}
VM.prototype.peek8 = function() {
    return this.peek8(0);
}
VM.prototype.peek8 = function(r) {
    return this.ram[0xFF - ((this.sp + r + 1) & 0xFF)] & 0xFF;
}
VM.prototype.peek16 = function() {
    return this.peek8() | (this.peek8(1) << 8);
}
VM.prototype.peek16 = function(r) {
    return this.peek8(r) | (this.peek8(r + 1) << 8);
}
VM.prototype.peek32 = function() {
    return this.peek16() | (this.peek16(2) << 16);
}
VM.prototype.peekFloat = function() {
    return Float.intBitsToFloat(this.peek32());
}
VM.prototype.checkIO = function() {
    var x = this.io;
    this.io = false;
    return x;
}
VM.prototype.tick = function() {
    var bits = this.read8();
    var opcode = bits & 0b11;
    var data = bits >> 2;
    switch (opcode) {
    case OP_FUNC:
        this.op_func(data);
        break;
    case OP_PUSH:
        this.op_push(data);
        break;
    case OP_POP:
        this.op_pop(data);
        break;
    case OP_BRANCH:
        this.op_branch(data);
        break;
    }
}
VM.prototype.op_func = function(data) {
    switch (data) {
    case F_NOP:
        break;
    case F_B2F:
        this.pushFloat(this.pop8());
        break;
    case F_F2B:
        this.push8(this.popFloat());
        break;
    case F_NOT:
        this.push8(~this.pop8());
        break;
    case F_OR:
        this.push8(this.pop8() | this.pop8());
        break;
    case F_AND:
        this.push8(this.pop8() & this.pop8());
        break;
    case F_XOR:
        this.push8(this.pop8() ^ this.pop8());
        break;
    case F_SHL:
        this.push8(this.pop8() << 1);
        break;
    case F_SHR:
        this.push8(this.pop8() >> 1);
        break;
    case F_ADD8:
        this.push8(this.pop8() + this.pop8());
        break;
    case F_SUB8:
        this.push8(this.pop8() - this.pop8());
        break;
    case F_MUL8:
        this.push8(this.pop8() * this.pop8());
        break;
    case F_DIV8:
        this.push8(this.pop8() / this.pop8());
        break;
    case F_MADD8:
        this.push8(this.pop8() * this.pop8() + this.pop8());
        break;
    case F_NEGF:
        this.pushFloat(-this.popFloat());
        break;
    case F_ADDF:
        this.pushFloat(this.popFloat() + this.popFloat());
        break;
    case F_SUBF:
        this.pushFloat(this.popFloat() - this.popFloat());
        break;
    case F_MULF:
        this.pushFloat(this.popFloat() * this.popFloat());
    case F_DIVF:
        this.pushFloat(this.popFloat() / this.popFloat());
        break;
    case F_MADDF:
        this.pushFloat(this.popFloat() * this.popFloat() + this.popFloat());
        break;
    case F_COS:
        this.pushFloat(Math.cos(this.popFloat()));
        break;
    case F_SIN:
        this.pushFloat(Math.sin(this.popFloat()));
        break;
    case F_TAN:
        this.pushFloat(Math.tan(this.popFloat()));
        break;
    case F_ACOS:
        this.pushFloat(Math.acos(this.popFloat()));
        break;
    case F_ASIN:
        this.pushFloat(Math.asin(this.popFloat()));
        break;
    case F_ATAN:
        this.pushFloat(Math.atan(this.popFloat()));
        break;
    case F_ABSF:
        this.pushFloat(Math.abs(this.popFloat()));
        break;
    case F_MINF:
        this.pushFloat(Math.min(this.popFloat(), this.popFloat()));
        break;
    case F_MAXF:
        this.pushFloat(Math.max(this.popFloat(), this.popFloat()));
        break;
    case F_POW:
        this.pushFloat(Math.pow(this.popFloat(), this.popFloat()));
        break;
    case F_LOG:
        this.pushFloat(Math.log(this.popFloat()));
        break;
    case F_LOG10:
        this.pushFloat(Math.log10(this.popFloat()));
        break;
    case F_IF_EQ8:
        this.push8(this.pop8() == this.pop8());
        break;
    case F_IF_NE8:
        this.push8(this.pop8() != this.pop8());
        break;
    case F_IF_LT8:
        this.push8(this.pop8() < this.pop8());
        break;
    case F_IF_LTE8:
        this.push8(this.pop8() <=this.pop8());
        break;
    case F_IF_LTF:
        this.push8(this.popFloat() < this.popFloat());
        break;
    case F_IF_LTEF:
        this.push8(this.popFloat() <= this.popFloat());
        break;
    case F_IF_GTF:
        this.push8(this.popFloat() > this.popFloat());
        break;
    case F_IF_GTEF:
        this.push8(this.popFloat() <= this.popFloat());
        break;
    case F_C_0:
        this.push8(0);
        break;
    case F_C_1:
        this.push8(1);
        break;
    case F_C_2:
        this.push8(2);
        break;
    case F_C_3:
        this.push8(3);
        break;
    case F_C_4:
        this.push8(4);
        break;
    case F_C_255:
        this.push8(0xFF);
        break;
    case F_C_0F:
        this.pushFloat(0.0);
        break;
    case F_C_1F:
        this.pushFloat(1.0);
        break;
    case F_C_2F:
        this.pushFloat(2.0);
        break;
    case F_C_3F:
        this.pushFloat(3.0);
        break;
    case F_C_4F:
        this.pushFloat(4.0);
        break;
    case F_C_INF:
        this.pushFloat(Float.POSITIVE_INFINITY);
        break;
    case F_ISNAN:
        this.push8(Float.isNaN(this.popFloat()));
        break;
    case F_DUP8:
        this.push8(this.peek8());
        break;
    case F_DUPF:
        this.pushFloat(this.peekFloat());
        break;
    case F_IO:
        this.io = true;
        break;
    }
}
VM.prototype.op_push = function(data) {
    switch (data) {
    case MAGIC_PUSH_BYTE_IMMEDIATE:
        this.push8(this.read8());
        break;
    case MAGIC_PUSH_BYTE_MEMORY:
        this.push8(this.read8indirect());
        break;
    case MAGIC_PUSH_FLOAT_IMMEDIATE:
        this.pushFloat(this.readFloat());
        break;
    case MAGIC_PUSH_FLOAT_MEMORY:
        this.pushFloat(this.readFloatIndirect());
        break;
    default:
        this.push8(this.read8(this.pc + data - 32));
        break;
    }
}
VM.prototype.op_pop = function(data) {
    switch (data) {
    case MAGIC_POP_BYTE:
        this.write8(this.pop8(), this.pop8());
        break;
    case MAGIC_POP_FLOAT:
        this.writeFloat(this.pop8(), this.popFloat());
        break;
    case MAGIC_POP_BYTE_INDIRECT:
        this.write8(this.read8indirect(), this.pop8());
        break;
    case MAGIC_POP_FLOAT_INDIRECT:
        this.writeFloat(this.read8indirect(),this. popFloat());
        break;
    default:
        this.write8(this.pc + data - 32, this.pop8());
        break;
    }
}
VM.prototype.op_branch = function(data) {
    var addr;
    switch (data) {
    case MAGIC_BRANCH_ALWAYS:
        this.pc = this.read8();
        break;
    case MAGIC_BRANCH_IMMEDIATE:
        addr = this.read8();
        if (this.pop8() != 0) {
            this.pc = addr;
        }
        break;
    case MAGIC_BRANCH_INDIRECT:
        addr = this.read8indirect();
        if (this.pop8() != 0) {
            this.pc = addr;
        }
        break;
    default:
        if (this.pop8() != 0) {
            this.pc = (this.pc + data - 32) & 0xFF;
        }
        break;
    }
}
