/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using System.Threading;
using System.Windows.Controls.Primitives;
using Kaazing.Security;

namespace Kaazing.JMS.Demo
{
    /**
     * Challenge handler for Basic authentication. See RFC 2617.
     */
    public class LoginHandlerDemo : LoginHandler
    {
        private Page parent;
        
        public LoginHandlerDemo(Page mainPage)
        {
            parent = mainPage;
        }

        //handle Challenge request from server
        public PasswordAuthentication GetCredentials()
        {
            parent.Dispatcher.BeginInvoke(parent.PopupLoginPage);

            //wait user click OK or Cacel button
            parent.UserInputCompleted.WaitOne();
            return parent.Credentials;
        }    
    }
}