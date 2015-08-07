/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.demo;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.io.File;
import java.io.InputStream;
import java.io.IOException;
import java.util.Properties;

import javax.naming.NamingException;
import javax.swing.JFrame;

public class JmsFrame extends JFrame {

    private static final long serialVersionUID = 3412240189439244444L;

    public JmsFrame(String title) {
        super(title);
    }

    public static void main(String[] args) {
        // Schedule a job for the event-dispatching thread: creating and showing this application's GUI.
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                JmsFrame frame = new JmsFrame("Java Message Service Demo");
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.init();
                frame.pack();
                frame.setVisible(true);
            }
        });
    }

    public void init() {
        JmsPanel webSocketPanel = new JmsPanel();
        try {
            // delegate initial context environment values to properties file
            Properties env = new Properties();
            InputStream is = null;
            try {
                is = JmsFrame.class.getResourceAsStream("/jms.properties");
                env.load(is);
            } catch (IOException ioe) {
                ioe.printStackTrace();
            } finally {
                if (is != null) {
                    try {
                        is.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            webSocketPanel.initJndi(env);
        } catch (NamingException e) {
            e.printStackTrace();
        }

        setBackground(Color.WHITE);
        Container p = this.getContentPane();
        p.setBackground(Color.WHITE);
        p.setLayout(new BorderLayout());
        p.add(webSocketPanel, BorderLayout.CENTER);
    }
}
