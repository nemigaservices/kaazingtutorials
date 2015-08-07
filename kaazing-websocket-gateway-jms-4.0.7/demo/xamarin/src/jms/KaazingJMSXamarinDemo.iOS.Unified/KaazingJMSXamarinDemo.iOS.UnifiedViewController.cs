/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */
using System;
using System.Drawing;

using Foundation;
using UIKit;

using Kaazing.JMS;
using Kaazing.JMS.Stomp;
using System.Collections.Generic;
using Kaazing.Security;
using System.Threading;
using Kaazing.HTML5;
using System.Threading.Tasks;

namespace KaazingJMSXamarinDemo.iOS.Unified
{
    public partial class KaazingJMSXamarinDemo_iOS_UnifiedViewController : UIViewController
    {
        bool _isConnected = false;
        IConnection connection = null;
        ISession session = null;
        IMessageConsumer consumer = null;
        IDictionary<String, List<IMessageConsumer>> consumers = null;

        static bool UserInterfaceIdiomIsPhone {
            get { return UIDevice.CurrentDevice.UserInterfaceIdiom == UIUserInterfaceIdiom.Phone; }
        }

        public KaazingJMSXamarinDemo_iOS_UnifiedViewController(IntPtr handle) : base(handle)
        {
        }

        public override void DidReceiveMemoryWarning()
        {
            // Releases the view if it doesn't have a superview.
            base.DidReceiveMemoryWarning();
            // Release any cached data, images, etc that aren't in use.
        }

        #region View lifecycle

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();

            EnableUI(false);

            BasicChallengeHandler basicHandler = ChallengeHandlers.Load<BasicChallengeHandler>(typeof(BasicChallengeHandler));
            basicHandler.LoginHandler = new LoginHandlerDemo(this);
            ChallengeHandlers.Default = basicHandler;

            connectButton.TouchUpInside += async (sender, e) => {
                try {
                    if (!_isConnected) {
                        string uri = uriTextField.Text;
                        Log("CONNECTING: " + uri);

                        await Task.Factory.StartNew(() => {
                            IConnectionFactory connectionFactory = new StompConnectionFactory(new Uri(uri));
                            connection = connectionFactory.CreateConnection(null, null);

                            connection.ExceptionListener = new ExceptionHandler(this);

                            consumers = new Dictionary<String, List<IMessageConsumer>>();

                            session = connection.CreateSession(false, SessionConstants.AUTO_ACKNOWLEDGE);

                            connection.Start();
                        });

                        Log("CONNECTED");
                        //Enable User Interface for Connected application
                        EnableUI(true);
                    } else {
                        Log("CLOSE");
                        if (connection != null) {
                            connection.Close();
                        }

                        Log("DISCONNECTED");
                        EnableUI(false);
                    }

                } catch(Exception exc) {
                    if (connection != null) {
                        connection.Close();
                    }

                    Log("CONNECTION FAILED: " + exc.Message);
                    EnableUI(false);
                }
            }; 

            subscribeButton.TouchUpInside += (sender, e) => {
                // TODO: Track consumers by topic, and durable subscribers by subscription name
                Log("SUBSCRIBE:" + destinationTextField.Text);

                IDestination destination;
                if (destinationTextField.Text.StartsWith("/topic/")) {
                    destination = session.CreateTopic(destinationTextField.Text);
                } else {
                    destination = session.CreateQueue(destinationTextField.Text);
                }

                consumer = session.CreateConsumer(destination);
                consumer.MessageListener = new MessageHandler(this);

                List<IMessageConsumer> consumerList = null;
                try {
                    consumerList = consumers[destinationTextField.Text];
                } catch(KeyNotFoundException) {
                    consumerList = new List<IMessageConsumer>();
                }
                consumerList.Add(consumer);

                try {
                    consumers.Add(destinationTextField.Text, consumerList);
                } catch(ArgumentException) {
                    // we catch the ArgumentException here, because in Java the the VALUE
                    // is replaced, if a KEY already exists:
                    List<IMessageConsumer> oldValue = consumers[destinationTextField.Text];
                    consumers.Remove(destinationTextField.Text);
                    consumers.Add(destinationTextField.Text, consumerList);
                }
            };

            sendButton.TouchUpInside += (sender, e) => {
                // Create a destination for the producer
                IDestination destination;
                if (destinationTextField.Text.StartsWith("/topic/")) {
                    destination = session.CreateTopic(destinationTextField.Text);
                } else if (destinationTextField.Text.StartsWith("/queue/")) {
                    destination = session.CreateQueue(destinationTextField.Text);
                } else {
                    Log("Destination must start with /topic/ or /queue/");
                    return;
                }

                // Create the message to send
                IMessage message;
                Log("SEND ITextMessage: " + messageTextField.Text);
                message = session.CreateTextMessage(messageTextField.Text);

                // Create the producer, send, and close
                IMessageProducer producer = session.CreateProducer(destination);
                producer.Send(message);
                producer.Close();

            };

            clearButton.TouchUpInside += (sender, e) => logTextView.Text = "";
        }

        public void Log(string message)
        {
            InvokeOnMainThread(delegate {  
                logTextView.Text = logTextView.Text + "\n" + message;
            });
        }

        public void EnableUI(bool enable)
        {
            InvokeOnMainThread(delegate {  
                if (enable) {
                    _isConnected = true;
                    connectButton.SetTitle("Disconnect", UIControlState.Normal);
                    subscribeButton.Enabled = true;
                    sendButton.Enabled = true;
                } else {
                    _isConnected = false;
                    connectButton.SetTitle("Connect", UIControlState.Normal);
                    subscribeButton.Enabled = false;
                    sendButton.Enabled = false;
                }
            });
        }

        public override void ViewWillAppear(bool animated)
        {
            base.ViewWillAppear(animated);
        }

        public override void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);
        }

        public override void ViewWillDisappear(bool animated)
        {
            base.ViewWillDisappear(animated);
        }

        public override void ViewDidDisappear(bool animated)
        {
            base.ViewDidDisappear(animated);
        }

        #endregion

        ///
        /// Handle server authentication challenge request,
        /// Popup a login window for username/password
        ///
        public PasswordAuthentication AuthenticationHandler()
        {
            PasswordAuthentication credentials = null;
            AutoResetEvent userInputCompleted = new AutoResetEvent(false);

            InvokeOnMainThread(delegate {  
                UIAlertView alertView = new UIAlertView();
                alertView.AlertViewStyle = UIAlertViewStyle.LoginAndPasswordInput;
                alertView.Title = "Login Form";
                alertView.AddButton("Login");
                alertView.Show();
                alertView.Clicked += (sender, buttonArgs) => { 
                    credentials = new PasswordAuthentication(alertView.GetTextField(0).Text, alertView.GetTextField(1).Text.ToCharArray());
                    userInputCompleted.Set();
                };
            });
            // wait user click 'Login' on login window
            userInputCompleted.WaitOne();

            return credentials;
        }

        class ExceptionHandler : IExceptionListener
        {
            KaazingJMSXamarinDemo_iOS_UnifiedViewController _controller;

            internal ExceptionHandler(KaazingJMSXamarinDemo_iOS_UnifiedViewController controller)
            {
                _controller = controller;
            }

            public void OnException(JMSException exc)
            {
                _controller.Log(exc.Message);
            }
        }

        class MessageHandler : IMessageListener
        {
            KaazingJMSXamarinDemo_iOS_UnifiedViewController _controller;

            internal MessageHandler(KaazingJMSXamarinDemo_iOS_UnifiedViewController controller)
            {
                _controller = controller;
            }

            public void OnMessage(IMessage message)
            {
                if (message is ITextMessage) {
                    ITextMessage textMessage = (ITextMessage)message;
                    _controller.Log("RECEIVED ITextMessage: " + textMessage.Text);
                } else if (message is IBytesMessage) {
                    IBytesMessage msg = (IBytesMessage)message;
                    byte[] actual = new byte[(int)msg.BodyLength];
                    msg.ReadBytes(actual);
                    _controller.Log("RECEIVED IBytesMessage: " + BitConverter.ToString(actual));
                } else if (message is IMapMessage) {
                    IMapMessage mapMessage = (IMapMessage)message;
                    IEnumerator<String> mapNames = mapMessage.MapNames;
                    while (mapNames.MoveNext()) {
                        String name = mapNames.Current;
                        Object obj = mapMessage.GetObject(name);
                        if (obj == null) {
                            _controller.Log(name + ": null");
                        } else if (obj.GetType().IsArray) {
                            _controller.Log(name + ": " + BitConverter.ToString(obj as byte[]) + " (byte[])");
                        } else {
                            String type = obj.GetType().ToString();
                            _controller.Log(name + ": " + obj.ToString() + " (" + type + ")");
                        }
                    }
                    _controller.Log("RECEIVED IMapMessage:");
                } else {
                    _controller.Log("UNKNOWN MESSAGE TYPE");
                }
            }
        }


        public class LoginHandlerDemo : LoginHandler
        {
            private KaazingJMSXamarinDemo_iOS_UnifiedViewController _controller;

            /// <summary>
            /// constructor
            /// <para>pass in main form for callback</para>
            /// </summary>
            /// <param name="form"></param>
            public LoginHandlerDemo(KaazingJMSXamarinDemo_iOS_UnifiedViewController controller)
            {
                _controller = controller;
            }

            #region LoginHandler Members

            PasswordAuthentication LoginHandler.GetCredentials()
            {
                return _controller.AuthenticationHandler();
            }

            #endregion
        }
    }
}

