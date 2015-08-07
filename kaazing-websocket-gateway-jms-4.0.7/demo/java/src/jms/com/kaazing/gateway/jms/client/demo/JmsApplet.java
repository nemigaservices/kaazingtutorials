/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.demo;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.net.URL;
import java.util.Hashtable;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.swing.JApplet;

public class JmsApplet extends JApplet {

    private static final long serialVersionUID = 3412240189439244444L;

    public void init() {
        JmsPanel webSocketPanel = new JmsPanel();
        try {
            // delegate initial context environment values to applet parameters
            Hashtable<Object, Object> env = new Hashtable<Object, Object>() {
                private static final long serialVersionUID = 1L;

                @Override
                public synchronized Object get(Object key) {
                    Object value = super.get(key);
                    if (value == null) {
                        String name = (key != null) ? key.toString() : null;
                        return getParameter(name);
                    }
                    return value;
                }

            };
            env.put(Context.APPLET, this);
            webSocketPanel.initJndi(env);
        } catch (NamingException e) {
            e.printStackTrace();
        }

        setBackground(Color.WHITE);
        Container p = this.getContentPane();
        p.setBackground(Color.WHITE);

        p.setLayout(new BorderLayout());

        URL documentUrl = getDocumentBase();
        String locationUrl = null;
        if (documentUrl.getProtocol().equalsIgnoreCase("https")) {
            locationUrl = "wss://";
        } else {
            locationUrl = "ws://";
        }

        String host = documentUrl.getHost();
        int port = documentUrl.getPort();

        // if no port was specified we display (and use) the defaults.
        if (port == -1) {
            port = locationUrl.startsWith("ws://") ? 80 : 443;
        }
        locationUrl += host + ":" + port;

        webSocketPanel.location.setText(locationUrl + "/jms");
        p.add(webSocketPanel, BorderLayout.CENTER);
    }
}