/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.stock.demo;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;

import javax.jms.Connection;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.kaazing.gateway.jms.client.ConnectionDisconnectedException;
import com.kaazing.gateway.jms.client.JmsConnectionFactory;

public class JMSStockDemoActivity extends Activity {

    private static String TAG = "com.kaazing.gateway.jms.client.android.demo.stock";

    private Button connectBtn;
    private Button disconnectBtn;
    private Button pauseBtn;
    private Button resumeBtn;
    private EditText locationText;
    private ListView stockListView;

    private DispatchQueue dispatchQueue;
    private Connection connection;
    private StockArrayAdapter stockArrayAdapter;
    private ArrayList<StockData> stockList = new ArrayList<StockData>();
	private HashMap<String, StockData> stockDataMap = new HashMap<String, StockData>();

	private Toast currentToast;
	private View toastView;

    /**
     * Called when the activity is first created.
     * @param savedInstanceState If the activity is being re-initialized after
     * previously being shut down then this Bundle contains the data it most
     * recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		Log.i(TAG, "onCreate");
        setContentView(R.layout.main);

        connectBtn = (Button)findViewById(R.id.connectBtn);
        disconnectBtn = (Button)findViewById(R.id.disconnectBtn);
        pauseBtn = (Button)findViewById(R.id.pauseBtn);
        resumeBtn = (Button)findViewById(R.id.resumeBtn);
        locationText = (EditText)findViewById(R.id.locationText);
        stockListView = (ListView)findViewById(R.id.stockListView);

        LayoutInflater inflater = getLayoutInflater();
        toastView = inflater.inflate(R.layout.toast_notification, (ViewGroup)findViewById(R.id.toast_layout_root));


        stockArrayAdapter = new StockArrayAdapter(this, R.layout.stock_item, stockList);
        stockListView.setAdapter(stockArrayAdapter);

        connectBtn.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				connectBtn.setEnabled(false);
				dispatchQueue = new DispatchQueue("DispatchQueue");
		        dispatchQueue.start();
		        dispatchQueue.waitUntilReady();
				connect();
			}
		});

        disconnectBtn.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				disconnect();
			}
		});

        pauseBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				pauseBtn.setEnabled(false);
				dispatchQueue.dispatchAsync(new Runnable() {
					@Override
					public void run() {
						try {
							connection.stop();
							logMessage("PAUSED");
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									resumeBtn.setEnabled(true);
								}
							});
						} catch (JMSException e) {
							e.printStackTrace();
						}
					}
				});
			}
		});

        resumeBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				resumeBtn.setEnabled(false);
				dispatchQueue.dispatchAsync(new Runnable() {
					@Override
					public void run() {
						try {
							connection.start();
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									pauseBtn.setEnabled(true);
								}
							});
						} catch (JMSException e) {
							e.printStackTrace();
						}
					}
				});
			}
		});

    }

    public void onPause() {
    	if (connection != null) {
    		dispatchQueue.dispatchAsync(new Runnable() {
				@Override
				public void run() {
					try {
						connection.stop();
					} catch (JMSException e) {
						e.printStackTrace();
					}
				}
			});
    	}

    	super.onPause();
    }

    public void onResume() {
    	if (connection != null) {
    		dispatchQueue.dispatchAsync(new Runnable() {
				@Override
				public void run() {
					try {
						connection.start();
					} catch (JMSException e) {
						e.printStackTrace();
					}
				}
			});
    	}

    	super.onResume();
    }

   public void onDestroy() {
	   if (connection != null) {
		   disconnect();
	   }
	   super.onStop();
   }

   private void connect() {
    	// Since createConnection() is a blocking method which will not return until
    	// the connection is established or connection fails, it is a good practice to
    	// establish connection on a separate thread so that UI is not blocked.
    	dispatchQueue.dispatchAsync(new Runnable() {
			public void run() {
				try {
					String location = locationText.getText().toString();
					JmsConnectionFactory connectionFactory = JmsConnectionFactory.createConnectionFactory(URI.create(location));
					connection = connectionFactory.createConnection();
					logMessage("CONNECTED");
					connection.start();
					Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
					Topic topic = session.createTopic("/topic/stock");
					MessageConsumer consumer = session.createConsumer(topic);
					consumer.setMessageListener(new StockMessageListener());
					updateButtonsForConnected();
					connection.setExceptionListener(new ConnectionExceptionListener());
				} catch (Exception e) {
					e.printStackTrace();
					logMessage("EXCEPTION: " + e.getMessage());
					updateButtonsForDisconnected();
				}
			}
		});
    }

    private void disconnect() {
    	disconnectBtn.setEnabled(false);
    	dispatchQueue.removePendingJobs();
    	dispatchQueue.quit();
    	new Thread(new Runnable() {
			public void run() {
				try {
					connection.close();
					logMessage("DISCONNECTED");
				} catch (JMSException e) {
					e.printStackTrace();
					logMessage(e.getMessage());

				}
				finally {
					connection = null;
					updateButtonsForDisconnected();
				}
			}
		}).start();
    }

    private void updateButtonsForConnected() {
    	runOnUiThread(new Runnable() {
			public void run() {
				connectBtn.setEnabled(false);
		    	disconnectBtn.setEnabled(true);
		    	pauseBtn.setEnabled(true);
		    	resumeBtn.setEnabled(false);
			}
		});
    }

    private void updateButtonsForDisconnected() {
    	runOnUiThread(new Runnable() {
			public void run() {
				connectBtn.setEnabled(true);
		    	disconnectBtn.setEnabled(false);
		    	pauseBtn.setEnabled(false);
		    	resumeBtn.setEnabled(false);
			}
		});
    }

    private void logMessage(final String message) {
    	runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (currentToast != null) {
					currentToast.cancel();
				}
				TextView text = (TextView) toastView.findViewById(R.id.toastMessageText);
				text.setText(message);

				currentToast = new Toast(getBaseContext());
				currentToast.setDuration(Toast.LENGTH_SHORT);
				currentToast.setView(toastView);
				currentToast.show();
			}
		});
    }

    private class ConnectionExceptionListener implements ExceptionListener {

		public void onException(final JMSException exception) {
			logMessage(exception.getMessage());
			if (exception instanceof ConnectionDisconnectedException) {
				updateButtonsForDisconnected();
			}
		}
    }

	private class StockMessageListener implements MessageListener {

			public void onMessage(Message message) {
				try {
					if (message instanceof TextMessage) {
		                String stockMessage = ((TextMessage)message).getText();
		                String[] stockDataElements = stockMessage.split(":");
		                final String companyName = stockDataElements[0];
		                final String symbol = stockDataElements[1];
		                final float  price = Float.parseFloat(stockDataElements[2]);
		                runOnUiThread(new Runnable() {
							@Override
							public void run() {
								StockData existingData = stockDataMap.get(symbol);
								if (existingData == null) {
									StockData stockData = new StockData(companyName, symbol, price);
									stockDataMap.put(symbol, stockData);
									stockList.add(stockData);
								}
								else {
									existingData.setPrice(price);
								}
								stockArrayAdapter.notifyDataSetChanged();
							}
						});
		            }
		            else {
		                logMessage("INVALID MESSAGE TYPE: "+message.getClass().getSimpleName());
		            }

				}
				catch (Exception ex) {
					ex.printStackTrace();
					logMessage(ex.getMessage());
				}
			}
	}

}

