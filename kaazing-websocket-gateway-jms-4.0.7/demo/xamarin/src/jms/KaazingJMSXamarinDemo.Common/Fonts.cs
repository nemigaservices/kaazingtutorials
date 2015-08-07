/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */
using Xamarin.Forms;

namespace KaazingJMSXamarinDemo
{
    static class Fonts
    {
        public static Font LargeTitle;
        public static Font Title;
        public static Font SmallTitle;

        /// <summary>
        ///   Initialize the fonts for our application. The fonts used changes from
        ///   platform to platform.
        /// </summary>
        static Fonts()
        {
            Device.OnPlatform(() => {
                LargeTitle = Font.OfSize("HelveticaNeue-UltraLight", 32);
                Title = Font.OfSize("HelveticaNeue-Light", 20);
                SmallTitle = Font.OfSize("HelveticaNeue-Light", 15);
            }, () => {
                LargeTitle = Font.SystemFontOfSize(32);
                Title = Font.SystemFontOfSize(20);
                SmallTitle = Font.SystemFontOfSize(15);
            }, () => {
                LargeTitle = Font.SystemFontOfSize(60);
                Title = Font.SystemFontOfSize(46);
                SmallTitle = Font.SystemFontOfSize(30);
            }
            );
        }

        static int PlatformSize(int size)
        {
            return Device.OnPlatform(size, size, (int)(size * 1.3));
        }
    }
}
