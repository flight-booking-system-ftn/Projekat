package com.isamrs.tim14.dto;

import java.util.ArrayList;

public class GraphsDTO {
	private ArrayList<String> x;
	private ArrayList<Integer> y;
	
	public GraphsDTO(ArrayList<String> x, ArrayList<Integer> y) {
		super();
		this.x= x;
		this.y = y;
	}
	public GraphsDTO() {
		this.x = new ArrayList<String>();
		this.y = new ArrayList<Integer>();
	}
	public ArrayList<String> getX() {
		return x;
	}
	public void setX(ArrayList<String> xAsix) {
		this.x = xAsix;
	}
	public ArrayList<Integer> getY() {
		return y;
	}
	public void setY(ArrayList<Integer> y) {
		this.y = y;
	}
	
}
