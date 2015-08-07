/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Browser;
using System.Threading;

using Kaazing.JMS;
using Kaazing.JMS.Stomp;
using Kaazing.Security;
using System.Windows.Controls.Primitives;

namespace Kaazing.JMS.Demo
{
    /// <summary>
    /// Top level JMS Client Demo Page
    /// </summary>
    public partial class Page : UserControl
    {
        private IConnection connection = null;
        private ISession session = null;
        private ISession transactedSession = null;
        private IMessageConsumer consumer = null;
        private IDictionary<String, List<IMessageConsumer>> consumers = null;

        private delegate void InvokeDelegate();

        // username and password from Login Popup Page
        private PasswordAuthentication _credentials;
        private AutoResetEvent _userInputCompleted = new AutoResetEvent(false);

        /// <summary>
        /// Top level JMS Client Demo Page
        /// </summary>
        public Page()
        {
            InitializeComponent();

            Uri sourceUri = Application.Current.Host.Source;

            String defaultLocation = "";
            if (sourceUri.Scheme == "file")
            {
                defaultLocation = "ws://localhost:8001";
            }
            else if (sourceUri.Scheme == "http")
            {
                defaultLocation = "ws://" + sourceUri.Host + ":" + sourceUri.Port;
            }
            else if (sourceUri.Scheme == "https")
            {
                defaultLocation = "wss://" + sourceUri.Host + ":" + sourceUri.Port;
            }

            LocationText.Text = defaultLocation + "/jms";

            if (Application.Current.InstallState == InstallState.NotInstalled)
            {
                btnInstall.IsEnabled = true;
            }
            // Create handler for authentication
            BasicChallengeHandler basicHandler = ChallengeHandlers.Load<BasicChallengeHandler>(typeof(BasicChallengeHandler));
            basicHandler.LoginHandler = new LoginHandlerDemo(this);
            ChallengeHandlers.Default = basicHandler;

        }

        public PasswordAuthentication Credentials
        {
            get
            {
                return _credentials;
            }
            set
            {
                _credentials = value;
            }
        }

        public AutoResetEvent UserInputCompleted
        {
            get
            {
                return _userInputCompleted;
            }

            set
            {
                _userInputCompleted = value;
            }
        }

        private void HandleLog(String message)
        {
            this.Dispatcher.BeginInvoke(() =>
            {
                Log("LOG: " + message);
            });
        }

        //Popup login page
        public void PopupLoginPage()
        {
            Popup p = new Popup();

            // Set the Child property of Popup to an instance of LoginPage. 
            LoginPage login = new LoginPage(this);
            p.Child = login;

            // Set where the popup will show up on the screen. 
            p.VerticalOffset = 200;
            p.HorizontalOffset = 200;

            // Open the popup. 
            p.IsOpen = true;
        }

        /*
         *  Button click handlers
         */

        private void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            // Immediately disable the connect button
            ConnectButton.IsEnabled = false;

            Log("CONNECT:" + LocationText.Text);

            String username = (UsernameText.Text.Length != 0) ? UsernameText.Text : null;
            String password = (PasswordText.Password.Length != 0) ? PasswordText.Password : null;
            String location = LocationText.Text;

            // new StompConnectionFactory() MUST be called on the UI Thread
            IConnectionFactory connectionFactory = new StompConnectionFactory(new Uri(location));

            Thread connectionThread = new Thread(new ThreadStart(() =>
            {
                try
                {
                    // connectionFactory.CreateConnection() MUST be called on a separate thread
                    // to prevent blocking the UI Thread in Silverlight
                    connection = connectionFactory.CreateConnection(username, password);

                    connection.ExceptionListener = new ExceptionHandler(this);

                    consumers = new Dictionary<String, List<IMessageConsumer>>();

                    session = connection.CreateSession(false, SessionConstants.AUTO_ACKNOWLEDGE);
                    transactedSession = connection.CreateSession(true, SessionConstants.SESSION_TRANSACTED);

                    connection.Start();

                    this.Dispatcher.BeginInvoke(() =>
                    {
                        Log("CONNECTED");

                        // Enable User Interface for Connected application
                        BeginButton.IsEnabled = true;

                        SubscribeButton.IsEnabled = true;
                        SendButton.IsEnabled = true;
                        UnsubscribeButton.IsEnabled = true;

                        CloseButton.IsEnabled = true;
                    });
                }
                catch (Exception exc)
                {
                    this.Dispatcher.BeginInvoke(() =>
                    {
                        ConnectButton.IsEnabled = true;
                        Log("EXCEPTION: " + exc.GetType().Name);
                    });
                }
            }));

            connectionThread.Start();
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            Log("CLOSING");

            if (connection != null)
            {
                // Close in a new thread to prevent blocking UI
                new Thread(new ThreadStart(() =>
                {
                    try
                    {
                        connection.Close();
                    }
                    catch (Exception exc)
                    {
                        this.Dispatcher.BeginInvoke(() =>
                        {
                            Log("EXCEPTION: " + exc.Message);
                        });
                    }
                    finally
                    {
                        connection = null;

                        ClosedHandler();
                    }
                })).Start();
            }
        }

        private void ClosedHandler()
        {
            this.Dispatcher.BeginInvoke(() =>
            {
                Log("CLOSED");

                ConnectButton.IsEnabled = true;

                // disable other buttons
                BeginButton.IsEnabled = false;
                AbortButton.IsEnabled = false;
                CommitButton.IsEnabled = false;
                TransactionSendButton.IsEnabled = false;

                SendButton.IsEnabled = false;
                SubscribeButton.IsEnabled = false;
                UnsubscribeButton.IsEnabled = false;

                CloseButton.IsEnabled = false;
            });
        }

        private void SubscribeButton_Click(object sender, RoutedEventArgs e)
        {
            // TODO: Track consumers by topic, and durable subscribers by subscription name
            Log("SUBSCRIBE:" + DestinationText.Text);

            IDestination destination;
            if (DestinationText.Text.StartsWith("/topic/"))
            {
                destination = session.CreateTopic(DestinationText.Text);
            }
            else
            {
                destination = session.CreateQueue(DestinationText.Text);
            }

            consumer = session.CreateConsumer(destination);
            consumer.MessageListener = new MessageHandler(this);

            List<IMessageConsumer> consumerList = null;
            consumers.TryGetValue(DestinationText.Text, out consumerList);
            if (consumerList == null)
            {
                consumerList = new List<IMessageConsumer>();
                consumers.Add(DestinationText.Text, consumerList);
            }
            consumerList.Add(consumer);
        }

        private void UnsubscribeButton_Click(object sender, RoutedEventArgs e)
        {
            Log("UNSUBSCRIBE:" + DestinationText.Text);
            List<IMessageConsumer> consumerList = consumers[DestinationText.Text];
            int consumerlistSize = consumerList.Count;

            if (consumerlistSize > 0 ) {
                IMessageConsumer consumer = (IMessageConsumer) consumerList[consumerlistSize-1];
                consumerList.RemoveAt(consumerlistSize-1);
                if (consumer != null) {
                    consumer.Close();
                }
                else {
                    //"ERROR: Destination not found: " + destinationName);
                }
 
            }
            else {
                // "ERROR: Destination not found: " + destinationName
            }
        }

        class MessageHandler : IMessageListener
        {
            Page page;

            internal MessageHandler(Page page)
            {
                this.page = page;
            }

            public void OnMessage(IMessage message)
            {
                page.Dispatcher.BeginInvoke(() =>
                {
                    if (message is ITextMessage) {
                        ITextMessage textMessage = (ITextMessage)message;
                        page.Log("RECEIVED ITextMessage: " + textMessage.Text);
                    }
                    else if (message is IBytesMessage) {
                        IBytesMessage msg = (IBytesMessage)message;
                        byte[] actual = new byte[(int)msg.BodyLength];
                        msg.ReadBytes(actual);
                        page.Log("RECEIVED IBytesMessage: " + BitConverter.ToString(actual));
                    }
                    else if (message is IMapMessage)
                    {
                        IMapMessage mapMessage = (IMapMessage)message;
                        IEnumerator<String> mapNames = mapMessage.MapNames;
                        while (mapNames.MoveNext())
                        {
                            String name = mapNames.Current;
                            Object obj = mapMessage.GetObject(name);
                            if (obj == null)
                            {
                                page.Log(name + ": null");
                            }
                            else if (obj.GetType().IsArray)
                            {
                                page.Log(name + ": " + BitConverter.ToString(obj as byte[]) + " (" + obj.GetType().Name + ")");
                            }
                            else
                            {
                                String type = obj.GetType().ToString();
                                page.Log(name + ": " + obj.ToString() + " (" + type + ")");
                            }
                        }
                        page.Log("RECEIVED IMapMessage:");
                    }
                    else
                    {
                        page.Log("UNKNOWN MESSAGE TYPE");
                    }
                });
            }
        }

        class ExceptionHandler : IExceptionListener
        {
            Page page;

            internal ExceptionHandler(Page page)
            {
                this.page = page;
            }

            public void OnException(JMSException exc)
            {
                if (exc is ConnectionDisconnectedException) {
                    page.ClosedHandler();
                }
                
                page.Dispatcher.BeginInvoke(() =>
                {
                    page.Log(exc.Message);
                });
                
            }
        }

        private void SendButton_Click(object sender, RoutedEventArgs e)
        {
            // Create a destination for the producer
            IDestination destination;
            if (DestinationText.Text.StartsWith("/topic/"))
            {
                destination = session.CreateTopic(DestinationText.Text);
            }
            else if (DestinationText.Text.StartsWith("/queue/"))
            {
                destination = session.CreateQueue(DestinationText.Text);
            }
            else
            {
                Log("Destination must start with /topic/ or /queue/");
                return;
            }

            // Create the message to send
            IMessage message;
            if (binaryChkBox.IsChecked.Value)
            {
                Log("SEND IBytesMessage: " + BitConverter.ToString(Encoding.UTF8.GetBytes(MessageText.Text)) + ": " + DestinationText.Text);
                message = session.CreateBytesMessage();
                ((IBytesMessage)message).WriteUTF(MessageText.Text);
            }
            else
            {
                Log("SEND ITextMessage: " + MessageText.Text + ": " + DestinationText.Text);
                message = session.CreateTextMessage(MessageText.Text);
            }

            new Thread(new ThreadStart(() =>
            {
                // Create the producer, send, and close
                IMessageProducer producer = session.CreateProducer(destination);
                try
                {
                    producer.Send(message);
                }
                catch (Exception exception)
                {
                    this.Dispatcher.BeginInvoke(() =>
                    {
                        Log("EXCEPTION: " + exception.Message);
                    });
                }
                finally
                {
                    producer.Close();
                }
            })).Start();
        }

        private void Install_Click(object sender, RoutedEventArgs e)
        {
            btnInstall.IsEnabled = false;

            try
            {
                Application.Current.Install();
            }
            catch (InvalidOperationException)
            {
                MessageBox.Show("The application is already installed.");
            }
        }

        /*
         * Console output 
         */
        private const int LOG_LIMIT = 50;
        private Queue<string> logLines = new Queue<string>();
        private void Log(string arg)
        {
            logLines.Enqueue(arg);
            if (logLines.Count > LOG_LIMIT)
            {
                logLines.Dequeue();
            }
            string[] o = logLines.ToArray<string>();

            o=o.Reverse<string>().ToArray<string>();

            Output.Text = string.Join("\n", o);
        }

        private void ClearOutput_Click(object sender, RoutedEventArgs e)
        {
            logLines.Clear();
            Output.Text = "";
        }

        private void BeginButton_Click(object sender, RoutedEventArgs e)
        {
            Log("BEGIN");
            SetTransactionGui(true);
        }

        private void CommitButton_Click(object sender, RoutedEventArgs e)
        {
            Log("COMMIT:" + TransactionNameText.Text);
            SetTransactionGui(false);
            new Thread(new ThreadStart(() =>
            {
                transactedSession.Commit();
            })).Start();

            Log("COMMITTED");
        }

        private void AbortButton_Click(object sender, RoutedEventArgs e)
        {
            Log("ABORT");
            SetTransactionGui(false);
            new Thread(new ThreadStart(() =>
            {
                transactedSession.Rollback();
            })).Start();            
        }

        private void TransactionSendButton_Click(object sender, RoutedEventArgs e)
        {

            // Create a destination for the producer
            IDestination transactionDestination;
            if (TransactionDestinationText.Text.StartsWith("/topic/"))
            {
                transactionDestination = session.CreateTopic(TransactionDestinationText.Text);
            }
            else if (TransactionDestinationText.Text.StartsWith("/queue/"))
            {
                transactionDestination = session.CreateQueue(TransactionDestinationText.Text);
            }
            else
            {
                Log("Destination must start with /topic/ or /queue/");
                return;
            }
            
            // log that we will send the message:
            Log("SEND:" + TransactionMessageText.Text + ":" + TransactionDestinationText.Text + ":" + TransactionNameText.Text);


            // Create the message to send
            IMessage message;
            if (binaryTransactionChkBox.IsChecked.Value)
            {
                message = transactedSession.CreateBytesMessage();
                ((IBytesMessage)message).WriteBytes(Encoding.UTF8.GetBytes(TransactionMessageText.Text));
            }
            else
            {
                message = transactedSession.CreateTextMessage(TransactionMessageText.Text);
            }


            new Thread(new ThreadStart(() =>
            {
                // Create the producer, send, and close
                IMessageProducer producer = transactedSession.CreateProducer(transactionDestination);
                producer.Send(message);
                producer.Close();
            })).Start();



#if NEVER
            if (binaryTransactionChkBox.IsChecked.Value)
            {
                ByteBuffer frame = new ByteBuffer();
                frame.PutString(TransactionMessageText.Text, System.Text.Encoding.UTF8);
                frame.Position = 0;
                client.Send(frame, TransactionDestinationText.Text, TransactionNameText.Text, null, new Dictionary<string, string>());
            }
            else
            {
                client.Send(TransactionMessageText.Text, TransactionDestinationText.Text, TransactionNameText.Text, null, new Dictionary<string, string>());
            }
#endif
        }

        private void SetTransactionGui(Boolean b)
        {
            AbortButton.IsEnabled = b;
            CommitButton.IsEnabled = b;
            TransactionSendButton.IsEnabled = b;
        }
    }
}