'use strict';

angular.module("webSocketApp", [])
    .constant('webSocketConfig', {
        URL: "ws://localhost:8001/jms",
        TOPIC_PUB: "/topic/testWSTodoSnd",
        TOPIC_SUB: "/topic/testWSTodoRcv",
        username: "",
        password: ""
    })
    .controller("mainCtl", function ($scope, $log, $timeout, $http, webSocketConfig) {

        $http.get('data/todo.json').
            success(function(data, status, headers, config) {
                $scope.todos = data;
                // Add 'available' attribute to be able to deal with the race condition
                for(var i=0;i<$scope.todos.length;i++){
                    $scope.todos[i].available=true;
                }
            });
        $scope.mouseoverIndex = -1;
        $scope.data = {
            rowColor: "Blue"
        }

        $scope.handleMouseoverEvent = function (e, index, item) {
            $log.info("Event type " + e.type);
            $scope.mouseoverIndex = -1;
            if (e.type === "mouseover") {
                $scope.mouseoverIndex = index;
                //TODO: ADD code to send command "busy" for this item
                // See Send messages facilities for details on how to send the data
                $scope.sendCommand(item, "busy");
            }
            else {
                //TODO: ADD code to send command "available" for this item
                // See Send messages facilities for details on how to send the data
                $scope.sendCommand(item, "available");
            }
        }
        $scope.getDoneColor = function (item, index) {
            if (!item.available) {
                return "Busy";
            }
            else {
                if ($scope.mouseoverIndex == index) {
                    if (item.complete)
                        return 'MouseOverDone';
                    else
                        return 'MouseOverNotDone';
                }
                else if (item.complete)
                    return 'Done';
                else
                    return 'NotDone';
            }
        }

        $scope.itemClicked = function (item) {
            var msg = "Item " + item.id + " is now " + ((item.complete) ? "completed" : "incompleted!");
            $log.info(msg);
            var msgObj = {
                id: $scope.localMessages.length,
                message: msg
            }
            $scope.localMessages.push(msgObj);
            //TODO: ADD code to send command "complete" or "incomplete" for this item
            // See Send messages facilities for details on how to send the data
            $scope.sendCommand(item, ((item.complete) ? "complete" : "incomplete"))
        }

        // Logging and error handling facilities
        $scope.localMessages = [];
        $scope.webSocketMessages = [];
        $scope.logWebSocketMessageImpl = function (msg, cls) {
            if (cls === undefined || cls == null)
                cls = "info";
            $log.info("From WebSocket: " + msg);
            var msgObj = {
                id: $scope.webSocketMessages.length,
                class: "msg-" + cls,
                message: msg
            }
            $scope.webSocketMessages.push(msgObj);

        }
        $scope.logWebSocketMessage = function (msg, cls) {
            $timeout($scope.logWebSocketMessageImpl(msg, cls), 100);
        }

        $scope.handleException = function (e) {
            $log.error(e);
            $scope.logWebSocketMessage("Error! " + e, "error");
        }

        function setupSSO(webSocketFactory) {
            /* Respond to authentication challenges with popup login dialog */
            var basicHandler = new BasicChallengeHandler();
            basicHandler.loginHandler = function (callback) {
                popupLoginDialog(callback);
            }
            webSocketFactory.setChallengeHandler(basicHandler);
        }


        // TODO: Add code to establish JMS connection
        // Connection facilities
        $scope.prepareSend = function () {
            var dest = $scope.session.createTopic(webSocketConfig.TOPIC_PUB);
            $scope.producer = $scope.session.createProducer(dest);
            $scope.logWebSocketMessage("Producer is ready! AppID=" + $scope.appId);
        }

        $scope.prepareReceive = function (rcvFunction) {
            var dest = $scope.session.createTopic(webSocketConfig.TOPIC_SUB);
            $scope.consumer = $scope.session.createConsumer(dest, "appId<>'" + $scope.appId + "'");
            $scope.consumer.setMessageListener(function (message) {
                rcvFunction(message.getText());
            });
            $scope.logWebSocketMessage("Consumer is ready!");
        }

        $scope.connectToWebSocket = function () {

            $scope.logWebSocketMessage("CONNECTING TO: " + webSocketConfig.URL);

            var jmsConnectionFactory = new JmsConnectionFactory(webSocketConfig.URL);

            //setup challenge handler
            setupSSO(jmsConnectionFactory.getWebSocketFactory());
            try {
                var connectionFuture =
                    jmsConnectionFactory.createConnection(webSocketConfig.username, webSocketConfig.password, function () {
                        if (!connectionFuture.exception) {
                            try {
                                $scope.connection = connectionFuture.getValue();
                                $scope.connection.setExceptionListener($scope.handleException);

                                $scope.logWebSocketMessage("CONNECTED");

                                $scope.session = $scope.connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

                                $scope.connection.start(function () {
                                    $scope.logWebSocketMessage("JMS session created");
                                    $scope.prepareSend();
                                    $scope.prepareReceive($scope.onMessage);
                                });
                            }
                            catch (e) {
                                $scope.handleException(e);
                            }
                        }
                        else {
                            $scope.handleException(connectionFuture.exception);
                        }
                    });
            }
            catch (e) {
                $scope.handleException(e);
            }

        }
        $scope.connectToWebSocket();


        // TODO: Add code to generate unique application ID and send the message
        // Send messages facilities
        $scope.appId = (function () {
            /**! http://stackoverflow.com/a/2117523/377392 */
            var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            var ret=fmt.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return ret;
        })();
        $scope.sendCommand = function (item, command) {
            var cmd = {
                from: $scope.appId,
                command: command,
                item: item.id
            }

            var msg = angular.toJson(cmd);
            var textMsg = $scope.session.createTextMessage(msg);
            textMsg.setStringProperty("appId", $scope.appId);
            try {
                var future = $scope.producer.send(textMsg, function () {
                    if (future.exception) {
                        $scope.handleException(future.exception);
                    }
                });
            } catch (e) {
                $scope.handleException(e);
            }
            $scope.logWebSocketMessage("Send command " + msg, "sent");

        }

        // TODO: Add code to receive and process the message
        // Receive messages facilities
        $scope.onMessage=function(message){
            var cmd=angular.fromJson(message);
            $scope.logWebSocketMessage("Received from: "+cmd.from+", command: "+cmd.command+", item id: "+cmd.item,"received")
            for(var i=0;i<$scope.todos.length;i++){
                if ($scope.todos[i].id===cmd.item){
                    if (cmd.command==="busy"){
                        $scope.todos[i].available=false;
                    }
                    else if (cmd.command==="available"){
                        $scope.todos[i].available=true;
                    }
                    else if (cmd.command==="complete"){
                        $scope.todos[i].complete=true;
                    }
                    else if (cmd.command==="incomplete"){
                        $scope.todos[i].complete=false;
                    }
                }
            }
        }

    })
;
