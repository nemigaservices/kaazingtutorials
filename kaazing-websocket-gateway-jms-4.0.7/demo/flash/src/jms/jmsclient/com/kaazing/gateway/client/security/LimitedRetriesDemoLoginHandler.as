/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.client.security {

import flash.display.DisplayObject;

import flash.utils.ByteArray;

import mx.managers.PopUpManager;

public class LimitedRetriesDemoLoginHandler extends LoginHandler {
    private var displayObject: DisplayObject;

    private const LIMIT: int = 3;

    private var attempts: int = 0;

    public function LimitedRetriesDemoLoginHandler(displayObject: DisplayObject) {
        super(this);
        this.displayObject = displayObject;
    }


    override public function getCredentials(continuation:Function):void {
        attempts++;

        if ( attempts > LIMIT ) {
            // send an event perhaps to notify the wider application of attempt violation
            attempts = 0;
            continuation(null, null);
        } else {
            var loginWindow:LoginForm = LoginForm(PopUpManager.createPopUp(displayObject, LoginForm, false));
            PopUpManager.centerPopUp(loginWindow);
            loginWindow.continuation = continuation;
        }

    }

}
}

