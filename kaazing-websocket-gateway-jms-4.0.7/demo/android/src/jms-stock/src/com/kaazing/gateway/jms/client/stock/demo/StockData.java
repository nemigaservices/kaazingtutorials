/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.stock.demo;

public class StockData {
	
	private String companyName;
	private String symbol;
	private float price;
	private float differenceFromPreviousValue;
	
	public StockData(String companyName, String symbol, float price) {
		this.companyName = companyName;
		this.symbol = symbol;
		this.price = price;
	}
	
	/**
	 * Replace the current price with new one.
	 */
	public void setPrice(float price) {
		differenceFromPreviousValue = price - this.price;
		this.price = price;
	}
	
	public String getCompanyName() {
		return this.companyName;
	}
	
	public String getSymbol() {
		return this.symbol;
	}
	
	public float getPrice() {
		return this.price;
	}
	
	public float getDifferenceFromPreviousValue() {
		return this.differenceFromPreviousValue;
	}

}
