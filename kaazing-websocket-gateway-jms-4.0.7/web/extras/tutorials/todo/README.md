# Kaazing Shared TODO Application

Application loads the list of tasks and allows multiple users to mark particular tasks as complete/incomplete. To deal with potential race condition, application disables item's complete/incomplete checkbox once the other user has mouse over checkbox area of this item.

**Application uses [AngularJS](http://www.angular.org) to simplify JavaScript development.**

## Organization of an application

Application contains the following folders:
1. **css** - contains CSS file for the application
2. **data** - contains mock-up json file for todo items
3. **js**
    - *controller* AngularJS controllers used in the application. This application uses single controller *app.js* which contains initial controller with the markers that are needed to start developing the tutorial from the scratch.
     *app-complete.js* contains the final code of the controller that should be used with **todo-final.html**
    - *vendor* Contains Kaazing JavaScript for JMS libraries. ** When developing new application copy all contents of this folder**
4. **bower.json** file contains the information about required libraries. To obtain the libraries, navigate to the root directory of an application and run:
```
bower install
```
5. **todo.html** - contains the HTML markup of the application, but uses controller specified in **app.js**. This file is intended to be used when developing code yourself as specified in [Tutorial: Using Kaazing Gateway with JavaScript/Angular](http://www.cnn.com)
6. **todo-complete.html** - contains the HTML markup of the application, but uses controller specified in **app-complete.js**. This is a fully functional application.
 
  
