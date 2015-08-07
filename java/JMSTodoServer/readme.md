# JMS Server component to run ToDo application for Kaazing Tutorial: "Using Kaazing Gateway with JavaScript/Angular"
## Creating shared TODO Application

### Application organization and logic
This standalone application implements the Spring Boot JMS Client that receives the data on **testWSTodoSnd** topic, stores it in the database (*not implemented*) and sends it back on **testWSTodoRcv** topic.

Both topics are specified in *org.kaazing.tutorials.todoserver.Constant* class.

Data is being sent and transmitted as the text message containing JSON payload; *org.kaazing.tutorials.todoserver.KaazingTestMessageData* class contains the data wrapper class. 

The *org.kaazing.tutorials.todoserver.DataProccesor* class contains all the code for receiving, storing to the database (placeholder is marked with **TODO**) and sending the messages back.

To assure that the sender will not receive its own message, application uses string property **appId** that is used in a filter of the receiving client; for simplicity  **appId** is also transmitted as the part of the message itself.

### Running the application
To run the application with [Gradle](https://gradle.org/) navigate to the root of an application (the directory that contains *build.gradle*) and run the following commands:

```
gradle clean
gradle run
```
---

### Notes
1. You should use Gradle 2.5 and above
2. Application expects ActiveMQ Server running on a default port (61616) on the same host. To modify the server confiration change its url in **application.properties** file; entry *spring.activemq.broker-url*


