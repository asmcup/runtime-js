//package asmcup.sandbox;

//import java.io.*;
//import java.nio.file.*;

//import javax.swing.*;
//import javax.swing.filechooser.FileNameExtensionFilter;

function SeededRNG(_seed) {
    this.seed = _seed === undefined ? 0 : _seed;
}

SeededRNG.prototype.random = function() {
    var x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
}

function Util(){//s {
	function readAsString(path){//String path){//} throws IOException {
		return readAsString(new File(path));
	}
	
	function readAsString(file){//File file){// throws IOException {
		return readAsString(file.toPath());
	}
	
	function readAsString(path){//Path path) throws IOException {
		return new String(Files.readAllBytes(path));
	}
	
	function readAsString(frame,ext,desc){//JFrame frame, String ext, String desc) throws IOException {
		var file = findFileOpen(frame, ext, desc);
		
		if (file == null) {
			return null;
		}
		
		return readAsString(file);
	}
	
	function write(path,text){//Path path, String text) throws IOException {
		Files.write(path, text.getBytes("ASCII"));
	}
	
	function write(file,text){//File file, String text) throws IOException {
		write(file.toPath(), text);
	}
	
	function write(frame,ext,desc,text){//JFrame frame, String ext, String desc, String text) throws IOException {
		var file = findFileSave(frame, ext, desc);
		
		if (file == null) {
			return;
		}
		
		write(file, text);
	}
	
	//public static File findFileOpen(JFrame frame, String ext, String desc) {
	function findFileOpen(frame,string,desc){//JFrame frame, String ext, String desc) {
		var chooser = new JFileChooser();
		chooser.setFileFilter(new FileNameExtensionFilter(desc, ext));
		
		if (chooser.showOpenDialog(frame) != JFileChooser.APPROVE_OPTION) {
			return null;
		}
		
		return chooser.getSelectedFile();
	}
	
	//public static File findFileSave(JFrame frame, String ext, String desc) {
	function findFileSave(frame,etx,desc){//JFrame frame, String ext, String desc) {
		var chooser = new JFileChooser();
		chooser.setFileFilter(new FileNameExtensionFilter(desc, ext));
		
		if (chooser.showSaveDialog(frame) != JFileChooser.APPROVE_OPTION) {
			return null;
		}
		
		return chooser.getSelectedFile();
	}
}
