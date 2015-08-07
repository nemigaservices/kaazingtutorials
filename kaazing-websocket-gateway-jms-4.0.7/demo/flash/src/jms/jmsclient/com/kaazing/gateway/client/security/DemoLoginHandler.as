/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.client.security {


import flash.display.DisplayObject;

import flash.utils.ByteArray;

import mx.managers.PopUpManager;

public class DemoLoginHandler extends LoginHandler {
    private var displayObject: DisplayObject;

    public function DemoLoginHandler(displayObject: DisplayObject) {
        super(this);
        this.displayObject = displayObject;
    }


    override public function getCredentials(continuation:Function):void {
        var loginWindow:LoginForm = LoginForm(PopUpManager.createPopUp(displayObject, LoginForm, false));
        PopUpManager.centerPopUp(loginWindow);
        loginWindow.continuation = continuation;
    }


}
}
