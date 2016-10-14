
var loadText = function(url, cbfn) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            cbfn(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function loadScripts(){

}

var sheets={};
function loadImageSheets(ondone){
    var names=['battery','gold','grass','ground','hazards','obstacles','robot','wall'];
    var loadedCount = 0;
    for(var i=0;i<names.length;i++){
        var img = document.createElement('img');
        var name = '/'+names[i]+'.png' 
        img.src='..'+name;
        img.onload = function(){
            if(++loadedCount==names.length){
                ondone();
            }
        }
        sheets[name]=img;
    }
}

function findImageSheet(path){
    return sheets[path];
}

function Random(){

}

Random.prototype.nextInt =function(rng){
    if(rng==undefined){
        return ((Math.random()-0.5)*32767*2)|0
    }
    return (Math.random()*rng)|0;
}
Random.prototype.nextFloat =function(rng){

    return Math.random();
}

var Float = new function(){
    var f32f = new Float32Array(1);
    var i32f = new Int32Array(f32f.buffer);
    this.floatToRawIntBits = function(value){
        f32f[0]=value;
        return i32f[0];
    }


    var i32i = new Int32Array(1);
    var f32i = new Float32Array(i32i.buffer);
    this.intBitsToFloat = function(value){
        i32i[0]=value;
        return f32i[0];
    }

    this.isNaN=function(f){
        return f!=f;
    }
}
Float.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
function System(){
    
}

System.currentTimeMillis=function(){return performance.now();}

Random.prototype.nextBoolean =function(){
    return (Math.random()>0.5)?true:false;
}

function Graphics(canvas){
	this.canvas = canvas;
	this.rotation =0;
    this.ctx = canvas.getContext('2d');
}

function Color(){

}
Color.BLACK = 'black';

Color.WHITE = 'white';

Graphics.prototype.setColor=function(col){
this.ctx.fillStyle = this.ctx.strokeStyle = col;
}


Graphics.prototype.fillRect=function(x,y,w,h){
this.ctx.fillRect(x,y,w,h);
}

Graphics.prototype.drawRect=function(x,y,w,h){
this.ctx.strokeRect(x,y,w,h);

}

Graphics.prototype.drawString=function(str,x,y){
//console.log("drawString");
this.ctx.fillText(str,x,y);

}

Graphics.prototype.drawImage=function(img,x,y,w,h){
    x=x==null?undefined:x;
    y=y==null?undefined:y;
    w=w==null?undefined:w;
    h=h==null?undefined:h;
    if(this.rotation!=0){
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.rotate(this.rotation+(Math.PI*0.0));//*Math.PI/180);
        this.ctx.drawImage(img,0,0);//x,y);//,w,h);
        this.ctx.restore();
    }
    else this.ctx.drawImage(img,x,y);//,w,h);
}

Graphics.prototype.getTransform=function(){
    return {rotation:this.rotation};
}

Graphics.prototype.setTransform=function(tfm){
    this.rotation = tfm.rotation;
}
Graphics.prototype.rotate=function(angle,centx,centy){
    this.rotation = angle;
    this.centerX = centx;
    this.centerY = centy;
}
function String(){
}

String.format = function(fmt,val0,val1,val2,val3){
    var scn =0;
    var str='';
    var argi=1;
    while(scn<fmt.length){
        var fnd = fmt.indexOf('%',scn);
        if(fnd<0){str+=fmt.substr(scn);break;}
        else str += fmt.substr(scn,fnd-scn);
        if(fnd+1<fmt.length){
            switch(fmt[fnd+1]){
                case 'd' : str+=parseInt(arguments[argi++]);break;
                case 'f' : str+=parseFloat(arguments[argi++]);break;
                case 's' : str+=''+arguments[argi++];break;
                case 'x' : str+=''+(arguments[argi++]|0).toString(16);break;
                default: 
                str+='<unknown fmt specifier>';
                break;
            }
        }else break;
        scn = fnd+2;
    }
    return str;
}

function UndoManager(){
    
}

UndoManager.prototype.undo = function(){
    
}

UndoManager.prototype.redo = function(){
    
}

function Toolkit(){
}

Toolkit.getDefaultToolkit = function(){
    return {getSystemClipboard:function(){}};
}
function JMenuItem(name){
    this.name = name;
    this.actionListeners = [];
}
JMenuItem.prototype.setEnabled = function(enabled){
    this.enabled = enabled;
}
JMenuItem.prototype.setAccelerator = function(acc){
    this.accelerator = acc;//KeyStroke.getKeyStroke("control Z"));
}
JMenuItem.prototype.addActionListener = function(fn){
    this.actionListeners.push(fn);
}

function JSeparator(){
}

function KeyStroke(){

}

KeyStroke.getKeyStroke = function(str){
    //"control Z")
}

function KeyAdapter(){

}

function MouseAdapter(){

}

function KeyEvent(){

}

KeyEvent.VK_DELETE = 'delete';
KeyEvent.VK_Z = 'z';
KeyEvent.VK_Y = 'y';

function Font(){

}

Font.MONOSPACED = 'monospaced';
Font.PLAIN = 'plain';