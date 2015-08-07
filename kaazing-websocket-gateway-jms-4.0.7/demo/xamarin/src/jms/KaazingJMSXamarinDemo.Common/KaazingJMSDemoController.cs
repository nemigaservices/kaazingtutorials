/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

using System;
using Xamarin.Forms;
using Kaazing.JMS;
using Kaazing.JMS.Stomp;
using System.Collections.Generic;
using Kaazing.Security;
using System.Threading.Tasks;
using Kaazing.HTML5;
using System.Threading;
using System.Diagnostics;

namespace KaazingJMSXamarinDemo
{
    public class KaazingJMSDemoController
    {
        protected KaazingJMSDemoPage _demoPage;

        bool _isConnected = false;
        string _username = null;
        string _password = null;
        AutoResetEvent _userInputCompleted;

        IConnection _connection = null;
        ISession _session = null;
        IMessageConsumer _consumer = null;
        IDictionary<String, List<IMessageConsumer>> _consumers = null;

        public KaazingJMSDemoController(KaazingJMSDemoPage demoPage)
        {
            _demoPage = demoPage;

            BasicChallengeHandler basicHandler = ChallengeHandlers.Load<BasicChallengeHandler>(typeof(BasicChallengeHandler));
            basicHandler.LoginHandler = new KaazingDemoLoginHandler(this);
            ChallengeHandlers.Default = basicHandler;

            _userInputCompleted = new AutoResetEvent(false);
        }

        public void SetUsernameAndPassword(string username, string password)
        {
            _username = username;
            _password = password;

            // Once the member variables are set, now unblock the other
            // thread so that it can create credentials using the username/password.
            _userInputCompleted.Set();
        }

        async public void ConnectOrDisconnect(object sender, EventArgs eventArgs)
        {
            try {

                if (!_isConnected) {
                    string uriInput = _demoPage.URI;
                    _demoPage.Log("CONNECTING: " + uriInput);
                    await Task.Factory.StartNew(() => {
                        IConnectionFactory connectionFactory = new StompConnectionFactory(new Uri(uriInput));
                        _connection = connectionFactory.CreateConnection(null, null);

                        _connection.ExceptionListener = new ExceptionHandler(_demoPage);
                        _consumers = new Dictionary<String, List<IMessageConsumer>>();
                        _session = _connection.CreateSession(false, SessionConstants.AUTO_ACKNOWLEDGE);

                        _connection.Start();
                    });

                    _demoPage.Log("CONNECTED");

                    // Enable User Interface for Connected application
                    _demoPage.EnableUI(true);
                    _isConnected = true;

                } else {
                    _demoPage.Log("CLOSE");

                    if (_connection != null) {
                        CloseConsumers();
                        _consumers.Clear();
                        _connection.Close();
                    }

                    _demoPage.Log("DISCONNECTED");
                    _isConnected = false;
                    _demoPage.EnableUI(false);
                    _connection = null;
                }

            } catch(Exception exc) {
                if (_connection != null) {
                    CloseConsumers();
                    _consumers.Clear();
                    _connection.Close();
                }

                _demoPage.Log("CONNECTION FAILED: " + exc.Message);
                _demoPage.EnableUI(false);
            }
        }

        async public void Subscribe(object sender, EventArgs eventArgs)
        { 
            string destinationInput = _demoPage.Destination;
            _demoPage.Log("SUBSCRIBE:" + destinationInput);

            await Task.Factory.StartNew(() => { 
                IDestination destination;
                if (destinationInput.StartsWith("/topic/")) {
                    destination = _session.CreateTopic(destinationInput);
                } else {
                    destination = _session.CreateQueue(destinationInput);
                }
                _consumer = _session.CreateConsumer(destination);
                _consumer.MessageListener = new MessageHandler(_demoPage);

                List<IMessageConsumer> consumerList = null;
                try {
                    consumerList = _consumers[destinationInput];
                } catch(KeyNotFoundException) {
                    consumerList = new List<IMessageConsumer>();
                }
                consumerList.Add(_consumer);

                try {
                    _consumers.Add(destinationInput, consumerList);
                } catch(ArgumentException) {
                    // we catch the ArgumentException here, because in Java the the VALUE
                    // is replaced, if a KEY already exists:
                    List<IMessageConsumer> oldValue = _consumers[destinationInput];
                    _consumers.Remove(destinationInput);
                    _consumers.Add(destinationInput, consumerList);
                }
            });
        }

        async public void SendMessage(object sender, EventArgs eventArgs)
        {
            string destinationInput = _demoPage.Destination;
            string messageInput = _demoPage.Message;

            // Create a destination for the producer
            IDestination destination;
            if (destinationInput.StartsWith("/topic/")) {
                destination = _session.CreateTopic(destinationInput);
            } else if (destinationInput.StartsWith("/queue/")) {
                destination = _session.CreateQueue(destinationInput);
            } else {
                _demoPage.Log("Destination must start with /topic/ or /queue/");
                return;
            }

            await Task.Factory.StartNew(() => {
                // Create the message to send
                IMessage message;
                message = _session.CreateTextMessage(messageInput);

                // Create the producer, send, and close
                IMessageProducer producer = _session.CreateProducer(destination);
                producer.Send(message);
                producer.Close();
            });
            _demoPage.Log("SEND ITextMessage: " + messageInput);
        }

        public void  ClearLog(object sender, EventArgs eventArgs)
        {
            Device.BeginInvokeOnMainThread(() => {
                _demoPage.LogView = "";
            });
        }

        public  PasswordAuthentication AuthenticationHandler()
        {
            PasswordAuthentication credentials = null;
            try {
                _userInputCompleted.Reset();
                Device.BeginInvokeOnMainThread(() => {
                    _demoPage.Navigation.PushModalAsync(new KaazingDemoLoginPage(this));
                });
                _userInputCompleted.WaitOne();
                credentials = new PasswordAuthentication(_username, _password.ToCharArray());
            } catch(Exception ex) {
                _demoPage.Log(ex.Message);
            }
            return credentials;
        }

        private void CloseConsumers()
        {
            foreach(var consumers in _consumers.Values) {
                foreach(var consumer in consumers){
                    consumer.Close();
                }
            }
        }

        class ExceptionHandler : IExceptionListener
        {
            KaazingJMSDemoPage _demoPage;

            internal ExceptionHandler(KaazingJMSDemoPage demoPage)
            {
                _demoPage = demoPage;
            }

            public void OnException(JMSException exc)
            {
                _demoPage.Log(exc.Message);
            }
        }

        class MessageHandler : IMessageListener
        {
            KaazingJMSDemoPage _demoPage;

            internal MessageHandler(KaazingJMSDemoPage demoPage)
            {
                _demoPage = demoPage;
            }

            public void OnMessage(IMessage message)
            {
                if (message is ITextMessage) {
                    ITextMessage textMessage = (ITextMessage)message;
                    _demoPage.Log("RECEIVED ITextMessage: " + textMessage.Text);
                } else if (message is IBytesMessage) {
                    IBytesMessage msg = (IBytesMessage)message;
                    byte[] actual = new byte[(int)msg.BodyLength];
                    msg.ReadBytes(actual);
                    _demoPage.Log("RECEIVED IBytesMessage: " + BitConverter.ToString(actual));

                } else if (message is IMapMessage) {
                    IMapMessage mapMessage = (IMapMessage)message;
                    IEnumerator<String> mapNames = mapMessage.MapNames;
                    while (mapNames.MoveNext()) {
                        String name = mapNames.Current;
                        Object obj = mapMessage.GetObject(name);
                        if (obj == null) {
                            _demoPage.Log(name + ": null");
                        } else if (obj.GetType().IsArray) {
                            _demoPage.Log(name + ": " + BitConverter.ToString(obj as byte[]) + " (byte[])");
                        } else {
                            String type = obj.GetType().ToString();
                            _demoPage.Log(name + ": " + obj.ToString() + " (" + type + ")");
                        }
                    }
                    _demoPage.Log("RECEIVED IMapMessage:");
                } else {
                    _demoPage.Log("UNKNOWN MESSAGE TYPE");
                }
            }
        }
    }
}

