/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

using System;
using Xamarin.Forms;
using System.Windows.Input;

namespace KaazingJMSXamarinDemo
{
    class KaazingDemoLoginPage : ContentPage
    {
        KaazingJMSDemoController _controller;

        public KaazingDemoLoginPage(KaazingJMSDemoController controller)
        {
            _controller = controller;
            #region Set some properties on the Page
            Padding = new Thickness(20);
            Title = "Login";
            HeightRequest = 200;
            WidthRequest = 400;
            #endregion

            #region Create some Entry controls to capture username and password.
            Entry loginInput = new Entry { Placeholder = "User Name" };
            loginInput.SetBinding(Entry.TextProperty, "UserName");
            loginInput.Focus();


            Entry passwordInput = new Entry { IsPassword = true, Placeholder = "Password" };
            passwordInput.SetBinding(Entry.TextProperty, "Password");
            #endregion

            #region Create a button to login with 
            Button loginButton = new Button {
                Text = "Login",
                BorderRadius = 5,
                TextColor = Color.White,
                BackgroundColor = Colours.BackgroundGrey
            };
            loginButton.SetBinding(BackgroundColorProperty, new Binding("LoginButtonColour"));
            loginButton.Command = new Command(o => {
                _controller.SetUsernameAndPassword(loginInput.Text, passwordInput.Text);
                this.Navigation.PopModalAsync();
            });
            loginInput.Focus();
            #endregion

            Content = new StackLayout {
                VerticalOptions = LayoutOptions.Center,
                Children = {
                    loginInput,
                    passwordInput,
                    loginButton
                },
                Spacing = 10,
            };
        }
    }
}

