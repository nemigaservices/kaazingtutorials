/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.stock.demo;

import java.util.ArrayList;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class StockArrayAdapter extends ArrayAdapter<StockData> {
	
	private ArrayList<StockData> stockList;

	public StockArrayAdapter(Context context, int textViewResourceId, ArrayList<StockData> stockList) {
		super(context, textViewResourceId, stockList);
		this.stockList = stockList;
	}
	
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View view = convertView;
		if (view == null) {
			LayoutInflater inflater = (LayoutInflater)getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			view = inflater.inflate(R.layout.stock_item, null);
		}
		StockData data = stockList.get(position);
		if (data != null) {
			TextView companyNameTextView = (TextView)view.findViewById(R.id.company);
			companyNameTextView.setText(data.getCompanyName());
			
			TextView symbolTextView = (TextView)view.findViewById(R.id.symbol);
			symbolTextView.setText(data.getSymbol());
			
			TextView priceTextView = (TextView)view.findViewById(R.id.price);
			priceTextView.setText(String.valueOf(data.getPrice()));
			
			TextView diffTextView = (TextView)view.findViewById(R.id.priceDiff);
			if (data.getDifferenceFromPreviousValue() < 0) {
				diffTextView.setTextColor(Color.RED);
			}
			else if (data.getDifferenceFromPreviousValue() > 0) {
				diffTextView.setTextColor(Color.GREEN);
			}
			diffTextView.setText(String.format("%.2f",data.getDifferenceFromPreviousValue()));
		}
		return view;
	}

}
