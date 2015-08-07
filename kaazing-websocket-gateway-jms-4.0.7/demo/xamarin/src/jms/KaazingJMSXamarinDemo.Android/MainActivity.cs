/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */
using System;

using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;


namespace KaazingJMSXamarinDemo.Android
{
    [Activity(Label = "KaazingJMSXamarinDemo.Android", MainLauncher = true, Icon = "@drawable/icon")]
    public class MainActivity : AndroidActivity
    {
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            Xamarin.Forms.Forms.Init(this, bundle);

            SetPage(App.GetMainPage());
        }
    }
}


