package org.kaazing.tutorials.todoserver;

import javax.jms.ConnectionFactory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.JmsListenerContainerFactory;
import org.springframework.jms.config.SimpleJmsListenerContainerFactory;

@SpringBootApplication
@EnableJms
public class Application {
	private static boolean run=true;

    @Bean // Strictly speaking this bean is not necessary as boot creates a default
    JmsListenerContainerFactory<?> myJmsContainerFactory(ConnectionFactory connectionFactory) {
        SimpleJmsListenerContainerFactory factory = new SimpleJmsListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        // !!!!! This statement as well as the entry in application properties "spring.jms.pubSubDomain=true" forces the application to use
        // topics instead of the queues
        factory.setPubSubDomain(true);
        return factory;
    }

    public static void main(String[] args) {
    	
        // Launch the application
        SpringApplication.run(Application.class, args);

        // Send a message
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() {
                run=false;
            }
        }));
        
        while(run){};
    }

}