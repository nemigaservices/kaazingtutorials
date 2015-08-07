/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

using System;
using Kaazing.Security;

namespace KaazingJMSXamarinDemo
{
    public class KaazingDemoLoginHandler : LoginHandler
    {
        KaazingJMSDemoController _controller;

        /// <summary>
        /// constructor
        /// <para>pass in main form for callback</para>
        /// </summary>
        /// <param name="form"></param>
        public KaazingDemoLoginHandler(KaazingJMSDemoController controller)
        {
            _controller = controller;
        }

        #region LoginHandler Members
        PasswordAuthentication LoginHandler.GetCredentials()
        {
            return _controller.AuthenticationHandler();
        }
        #endregion
    }
}

