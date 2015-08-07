/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.auth.demo;

import java.nio.ByteBuffer;
import java.security.Principal;
import java.util.HashSet;
import java.util.Set;

import javax.security.auth.Subject;

import com.kaazing.gateway.jms.server.spi.JmsMessageType;
import com.kaazing.gateway.jms.server.spi.JmsPersistence;
import com.kaazing.gateway.jms.server.spi.JmsQueue;
import com.kaazing.gateway.jms.server.spi.JmsTopic;
import com.kaazing.gateway.jms.server.spi.security.JmsAuthorization;
import com.kaazing.gateway.jms.server.spi.security.JmsAuthorizationFactory;

public class CustomAuthorizationFactory extends JmsAuthorizationFactory {


	private static final HashSet<String> knownPublishers = new HashSet<String>();
	private static final HashSet<String> knownSubscribers = new HashSet<String>();
	private static final HashSet<String> knownTransactors = new HashSet<String>();

	static {

		// Pre-seeded data
		// user1 can publish, subscribe and transact
		// user2 can only publish
		// user3 can only subscribe
		// user4 can only subscribe
		// user5 has no authorization other than connecting

		knownPublishers.add("user1");
		knownPublishers.add("user2");

		knownSubscribers.add("user1");
		knownSubscribers.add("user3");
		knownSubscribers.add("user4");

		knownTransactors.add("user1");
	}



	public JmsAuthorization newAuthorization(Subject subject) {
		log("Creating a PublishOnlyAuthorization");
		return new CustomAuthorization(subject);
	}


	/**
	 *
	 * This class is a simple demonstration of methods that you can intercept to check
	 * for fine grained authorization that can be enforced based on the subject.
	 *
	 * This simple example, grants access to all functions if the user is AUTHORIZED
	 *
	 * You can customize these methods to suite your needs by making a complex check
	 * that involves the Subject, Topic or Queue name, Selector. You can
	 *
	 */
	class CustomAuthorization extends JmsAuthorization {

		private Subject subject;

		public CustomAuthorization(Subject subject) {
			this.subject = subject;
		}


		private boolean isSubscribeAllowed() {
			// put your own check here
			Set<Principal> principals = subject.getPrincipals();
			for(Principal p: principals) {
				if (knownSubscribers.contains(p.getName())) {
					return true;
				}
			}
			return false;
		}


		private boolean isPublishAllowed() {
			// put your own check here
			Set<Principal> principals = subject.getPrincipals();
			for(Principal p: principals) {
				if (knownPublishers.contains(p.getName())) {
					return true;
				}
			}
			return false;
		}


		private boolean isTransactAllowed() {
			// put your own check here
			Set<Principal> principals = subject.getPrincipals();
			for(Principal p: principals) {
				if (knownTransactors.contains(p.getName())) {
					return true;
				}
			}
			return false;
		}


		private boolean isAuthorized(String principal) {
			// put your own check here
			Set<Principal> principals = subject.getPrincipals();
			for(Principal p: principals) {
				if (p.getName().equals("AUTHORIZED")) {
					return true;
				}
			}
			return false;
		}

		@Override
		public boolean canDurableSubscribeToTopic(String topicName,
				String selector) {
			log("canDurableSubscribeToTopic");
			return isSubscribeAllowed();
		}


		@Override
		public boolean canSubscribeToTopic(JmsTopic topicKind,
				String topicName, String selector) {
			log("canSubscribeToTopic");
			return isSubscribeAllowed();
		}


		@Override
		public boolean canSubscribeToQueue(JmsQueue queueKind,
				String queueName, String selector) {
			log("canSubscribeToQueue");
			return isSubscribeAllowed();
		}


		@Override
		public boolean canPublishToTopic(JmsTopic topicKind, String topicName,
				JmsPersistence persistence, JmsMessageType bodyType,
				ByteBuffer body) {
			log("canPublishToTopic");
			return isPublishAllowed();
		}


		@Override
		public boolean canPublishToQueue(JmsQueue queueKind, String queueName,
				JmsPersistence persistence, JmsMessageType bodyType,
				ByteBuffer body) {
			log("canPublishToQueue");
			return isPublishAllowed();
		}

		@Override
		public boolean canTransact() {
			log("canTransact");
			return isTransactAllowed();
		}


		@Override
		public boolean canAcknowledge() {
			log("canAcknowledge");
			return isAuthorized("AUTHORIZED");
		}

		public boolean canConnect() {
			log("canConnect");
			return isAuthorized("AUTHORIZED");
		}

	}

	private static void log(String msg) {
		System.out.println("CustomAuthorizationFactory: " + msg);
	}
}
