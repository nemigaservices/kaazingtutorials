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
            }
            else {
                //TODO: ADD code to send command "available" for this item
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

        // TODO: Add code to establish JMS connection


        // TODO: Add code to generate unique application ID and send the message


        // TODO: Add code to receive and process the message

    })
;
