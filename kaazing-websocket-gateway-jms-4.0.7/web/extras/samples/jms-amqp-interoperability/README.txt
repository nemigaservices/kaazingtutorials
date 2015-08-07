====
    Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
====

Kaazing WebSocket Gateway - JMS Edition: JMS-AMQP Interoperability Sample Applications

The jms-amqp-interoperability folder contains the following sample applications that demonstrate JMS-to-AMQP interoperability. This folder contains examples of an AMQP producer and consumer that deal with messages which, after being translated into JMS, become JMS MapMessages.

1. AmqpJmsMessageProducerApp
   This class uses an AMQP Java client library to send messages to an AMQP server. This class also encodes the AMQP messages to allow them to be JMS MapMessages when translated to JMS. The topic name is 'destination'. The following is a high-level overview of the steps performed:
       a. Establish an AMQP connection to an AMQP server.
       b. Create a channel.
       c. Declare an exchange with exchange name 'jms.durable.topic' and exchange type 'topic'.
       d. Build AMQP properties and add JMS message headers and JMS message properties as AMQP content property headers.
       e. Encode an AMQP body comprising the JMS headers, JMS properties, and JMS MapMessage body.
       d. Publish the AMQP message to the AMQP server.

2. AmqpJmsMessageConsumerApp
   This class uses an AMQP Java client library to create a consumer on the topic 'destination'. The following is a high-level overview of the steps performed:
        a. Establish a connection to an AMQP server.
        b. Create a channel.
        c. Declare an exchange with exchange name 'jms.durable.topic' and exchange type 'topic'.
        d. Since it is  a topic, a queue is declared internally with a unique UUID.
        e. Bind a channel to that queue with exchange name 'jms.durable.topic' and routing key 'destination'.
        f. Use the 'basicConsume' API in the channel to consume messages published to the topic 'destination'.
        g. Whenever an AMQP message is received via the callback 'handleDelivery', decode it from the JMS message.
        
        NOTE: Only JMS TextMessage and JMS MapMessage are currently available in this sample app.

Steps to Run the Sample App

To run the sample:

1. Start the AMQP server.
2. Install and configure Kaazing WebSocket Gateway - JMS Edition to run against the AMQP server. See the documentation topic “Integrate RabbitMQ Messaging” for more information.
3. Start Kaazing Gateway.
4. Run the out-of-the-box JavaScript JMS demo by going to http://localhost:8001/demo.
5. In the demo, click Connect.
6. Subscribe to /topic/destination.
7. Send a message. You should see the message received in the demo.
8. Now copy the AMQP client library (amqp-client.jar) from the GATEWAY_HOME/lib/ to the lib folder of the sample project.
   The JAR should be available inside the GATEWAY_HOME/lib directory once you have set up the Gateway to use the AMQP server as the backend server. Note that the library must be named "amqp-client.jar" for the next step to succeed.
9. Import the project into Eclipse.
10. Run AmqpJmsMessageProducerApp.java as a Java Application from Eclipse. The JavaScript demo should receive the MapMessage.
11. Run AmqpJmsMessageConsumerApp.java as a Java Application from Eclipse. If you send a message (JMS TextMessage or JMS MapMessage) to the Gateway, you will see that the message is received in the Eclipse console.


