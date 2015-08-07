// WARNING
//
// This file has been generated automatically by Xamarin Studio from the outlets and
// actions declared in your storyboard file.
// Manual changes to this file will not be maintained.
//
using System;
using Foundation;
using UIKit;
using System.CodeDom.Compiler;

namespace KaazingJMSXamarinDemo.iOS.Unified
{
	[Register ("KaazingJMSXamarinDemo_iOS_UnifiedViewController")]
	partial class KaazingJMSXamarinDemo_iOS_UnifiedViewController
	{
		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIButton clearButton { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIButton connectButton { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UITextField destinationTextField { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UITextView logTextView { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UITextField messageTextField { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIButton sendButton { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIButton subscribeButton { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UITextField uriTextField { get; set; }

		void ReleaseDesignerOutlets ()
		{
			if (clearButton != null) {
				clearButton.Dispose ();
				clearButton = null;
			}
			if (connectButton != null) {
				connectButton.Dispose ();
				connectButton = null;
			}
			if (destinationTextField != null) {
				destinationTextField.Dispose ();
				destinationTextField = null;
			}
			if (logTextView != null) {
				logTextView.Dispose ();
				logTextView = null;
			}
			if (messageTextField != null) {
				messageTextField.Dispose ();
				messageTextField = null;
			}
			if (sendButton != null) {
				sendButton.Dispose ();
				sendButton = null;
			}
			if (subscribeButton != null) {
				subscribeButton.Dispose ();
				subscribeButton = null;
			}
			if (uriTextField != null) {
				uriTextField.Dispose ();
				uriTextField = null;
			}
		}
	}
}
