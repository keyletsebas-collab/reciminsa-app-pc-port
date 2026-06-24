; ModuleID = 'marshal_methods.armeabi-v7a.ll'
source_filename = "marshal_methods.armeabi-v7a.ll"
target datalayout = "e-m:e-p:32:32-Fi8-i64:64-v128:64:128-a:0:32-n32-S64"
target triple = "armv7-unknown-linux-android21"

%struct.MarshalMethodName = type {
	i64, ; uint64_t id
	ptr ; char* name
}

%struct.MarshalMethodsManagedClass = type {
	i32, ; uint32_t token
	ptr ; MonoClass klass
}

@assembly_image_cache = dso_local local_unnamed_addr global [132 x ptr] zeroinitializer, align 4

; Each entry maps hash of an assembly name to an index into the `assembly_image_cache` array
@assembly_image_cache_hashes = dso_local local_unnamed_addr constant [264 x i32] [
	i32 42639949, ; 0: System.Threading.Thread => 0x28aa24d => 122
	i32 67008169, ; 1: zh-Hant\Microsoft.Maui.Controls.resources => 0x3fe76a9 => 33
	i32 72070932, ; 2: Microsoft.Maui.Graphics.dll => 0x44bb714 => 57
	i32 117431740, ; 3: System.Runtime.InteropServices => 0x6ffddbc => 115
	i32 165246403, ; 4: Xamarin.AndroidX.Collection.dll => 0x9d975c3 => 67
	i32 182336117, ; 5: Xamarin.AndroidX.SwipeRefreshLayout.dll => 0xade3a75 => 85
	i32 195452805, ; 6: vi/Microsoft.Maui.Controls.resources.dll => 0xba65f85 => 30
	i32 199333315, ; 7: zh-HK/Microsoft.Maui.Controls.resources.dll => 0xbe195c3 => 31
	i32 205061960, ; 8: System.ComponentModel => 0xc38ff48 => 97
	i32 254259026, ; 9: Microsoft.AspNetCore.Components.dll => 0xf27af52 => 35
	i32 280992041, ; 10: cs/Microsoft.Maui.Controls.resources.dll => 0x10bf9929 => 2
	i32 317674968, ; 11: vi\Microsoft.Maui.Controls.resources => 0x12ef55d8 => 30
	i32 318968648, ; 12: Xamarin.AndroidX.Activity.dll => 0x13031348 => 63
	i32 336156722, ; 13: ja/Microsoft.Maui.Controls.resources.dll => 0x14095832 => 15
	i32 342366114, ; 14: Xamarin.AndroidX.Lifecycle.Common => 0x146817a2 => 74
	i32 347068432, ; 15: SQLitePCLRaw.lib.e_sqlite3.android.dll => 0x14afd810 => 61
	i32 356389973, ; 16: it/Microsoft.Maui.Controls.resources.dll => 0x153e1455 => 14
	i32 379916513, ; 17: System.Threading.Thread.dll => 0x16a510e1 => 122
	i32 385762202, ; 18: System.Memory.dll => 0x16fe439a => 105
	i32 395744057, ; 19: _Microsoft.Android.Resource.Designer => 0x17969339 => 34
	i32 435591531, ; 20: sv/Microsoft.Maui.Controls.resources.dll => 0x19f6996b => 26
	i32 442565967, ; 21: System.Collections => 0x1a61054f => 94
	i32 450948140, ; 22: Xamarin.AndroidX.Fragment.dll => 0x1ae0ec2c => 73
	i32 469710990, ; 23: System.dll => 0x1bff388e => 126
	i32 498788369, ; 24: System.ObjectModel => 0x1dbae811 => 110
	i32 500358224, ; 25: id/Microsoft.Maui.Controls.resources.dll => 0x1dd2dc50 => 13
	i32 503918385, ; 26: fi/Microsoft.Maui.Controls.resources.dll => 0x1e092f31 => 7
	i32 513247710, ; 27: Microsoft.Extensions.Primitives.dll => 0x1e9789de => 51
	i32 539058512, ; 28: Microsoft.Extensions.Logging => 0x20216150 => 48
	i32 571435654, ; 29: Microsoft.Extensions.FileProviders.Embedded.dll => 0x220f6a86 => 45
	i32 592146354, ; 30: pt-BR/Microsoft.Maui.Controls.resources.dll => 0x234b6fb2 => 21
	i32 627609679, ; 31: Xamarin.AndroidX.CustomView => 0x2568904f => 71
	i32 627931235, ; 32: nl\Microsoft.Maui.Controls.resources => 0x256d7863 => 19
	i32 662205335, ; 33: System.Text.Encodings.Web.dll => 0x27787397 => 119
	i32 672442732, ; 34: System.Collections.Concurrent => 0x2814a96c => 92
	i32 688181140, ; 35: ca/Microsoft.Maui.Controls.resources.dll => 0x2904cf94 => 1
	i32 690569205, ; 36: System.Xml.Linq.dll => 0x29293ff5 => 124
	i32 706645707, ; 37: ko/Microsoft.Maui.Controls.resources.dll => 0x2a1e8ecb => 16
	i32 709557578, ; 38: de/Microsoft.Maui.Controls.resources.dll => 0x2a4afd4a => 4
	i32 722857257, ; 39: System.Runtime.Loader.dll => 0x2b15ed29 => 116
	i32 748832960, ; 40: SQLitePCLRaw.batteries_v2 => 0x2ca248c0 => 59
	i32 759454413, ; 41: System.Net.Requests => 0x2d445acd => 108
	i32 775507847, ; 42: System.IO.Compression => 0x2e394f87 => 101
	i32 777317022, ; 43: sk\Microsoft.Maui.Controls.resources => 0x2e54ea9e => 25
	i32 789151979, ; 44: Microsoft.Extensions.Options => 0x2f0980eb => 50
	i32 804008546, ; 45: Microsoft.AspNetCore.Components.WebView.Maui => 0x2fec3262 => 38
	i32 823281589, ; 46: System.Private.Uri.dll => 0x311247b5 => 111
	i32 830298997, ; 47: System.IO.Compression.Brotli => 0x317d5b75 => 100
	i32 904024072, ; 48: System.ComponentModel.Primitives.dll => 0x35e25008 => 95
	i32 926902833, ; 49: tr/Microsoft.Maui.Controls.resources.dll => 0x373f6a31 => 28
	i32 967690846, ; 50: Xamarin.AndroidX.Lifecycle.Common.dll => 0x39adca5e => 74
	i32 992768348, ; 51: System.Collections.dll => 0x3b2c715c => 94
	i32 999186168, ; 52: Microsoft.Extensions.FileSystemGlobbing.dll => 0x3b8e5ef8 => 47
	i32 1012816738, ; 53: Xamarin.AndroidX.SavedState.dll => 0x3c5e5b62 => 84
	i32 1028951442, ; 54: Microsoft.Extensions.DependencyInjection.Abstractions => 0x3d548d92 => 42
	i32 1029334545, ; 55: da/Microsoft.Maui.Controls.resources.dll => 0x3d5a6611 => 3
	i32 1035644815, ; 56: Xamarin.AndroidX.AppCompat => 0x3dbaaf8f => 64
	i32 1044663988, ; 57: System.Linq.Expressions.dll => 0x3e444eb4 => 103
	i32 1052210849, ; 58: Xamarin.AndroidX.Lifecycle.ViewModel.dll => 0x3eb776a1 => 76
	i32 1082857460, ; 59: System.ComponentModel.TypeConverter => 0x408b17f4 => 96
	i32 1084122840, ; 60: Xamarin.Kotlin.StdLib => 0x409e66d8 => 89
	i32 1098259244, ; 61: System => 0x41761b2c => 126
	i32 1118262833, ; 62: ko\Microsoft.Maui.Controls.resources => 0x42a75631 => 16
	i32 1168523401, ; 63: pt\Microsoft.Maui.Controls.resources => 0x45a64089 => 22
	i32 1173126369, ; 64: Microsoft.Extensions.FileProviders.Abstractions.dll => 0x45ec7ce1 => 43
	i32 1178241025, ; 65: Xamarin.AndroidX.Navigation.Runtime.dll => 0x463a8801 => 81
	i32 1203215381, ; 66: pl/Microsoft.Maui.Controls.resources.dll => 0x47b79c15 => 20
	i32 1234928153, ; 67: nb/Microsoft.Maui.Controls.resources.dll => 0x499b8219 => 18
	i32 1260983243, ; 68: cs\Microsoft.Maui.Controls.resources => 0x4b2913cb => 2
	i32 1292207520, ; 69: SQLitePCLRaw.core.dll => 0x4d0585a0 => 60
	i32 1293217323, ; 70: Xamarin.AndroidX.DrawerLayout.dll => 0x4d14ee2b => 72
	i32 1324164729, ; 71: System.Linq => 0x4eed2679 => 104
	i32 1373134921, ; 72: zh-Hans\Microsoft.Maui.Controls.resources => 0x51d86049 => 32
	i32 1376866003, ; 73: Xamarin.AndroidX.SavedState => 0x52114ed3 => 84
	i32 1406073936, ; 74: Xamarin.AndroidX.CoordinatorLayout => 0x53cefc50 => 68
	i32 1430672901, ; 75: ar\Microsoft.Maui.Controls.resources => 0x55465605 => 0
	i32 1454105418, ; 76: Microsoft.Extensions.FileProviders.Composite => 0x56abe34a => 44
	i32 1461004990, ; 77: es\Microsoft.Maui.Controls.resources => 0x57152abe => 6
	i32 1462112819, ; 78: System.IO.Compression.dll => 0x57261233 => 101
	i32 1469204771, ; 79: Xamarin.AndroidX.AppCompat.AppCompatResources => 0x57924923 => 65
	i32 1470490898, ; 80: Microsoft.Extensions.Primitives => 0x57a5e912 => 51
	i32 1480492111, ; 81: System.IO.Compression.Brotli.dll => 0x583e844f => 100
	i32 1493001747, ; 82: hi/Microsoft.Maui.Controls.resources.dll => 0x58fd6613 => 10
	i32 1514721132, ; 83: el/Microsoft.Maui.Controls.resources.dll => 0x5a48cf6c => 5
	i32 1521091094, ; 84: Microsoft.Extensions.FileSystemGlobbing => 0x5aaa0216 => 47
	i32 1543031311, ; 85: System.Text.RegularExpressions.dll => 0x5bf8ca0f => 121
	i32 1546581739, ; 86: Microsoft.AspNetCore.Components.WebView.Maui.dll => 0x5c2ef6eb => 38
	i32 1551623176, ; 87: sk/Microsoft.Maui.Controls.resources.dll => 0x5c7be408 => 25
	i32 1622152042, ; 88: Xamarin.AndroidX.Loader.dll => 0x60b0136a => 78
	i32 1624863272, ; 89: Xamarin.AndroidX.ViewPager2 => 0x60d97228 => 87
	i32 1636350590, ; 90: Xamarin.AndroidX.CursorAdapter => 0x6188ba7e => 70
	i32 1639515021, ; 91: System.Net.Http.dll => 0x61b9038d => 106
	i32 1639986890, ; 92: System.Text.RegularExpressions => 0x61c036ca => 121
	i32 1654881142, ; 93: Microsoft.AspNetCore.Components.WebView => 0x62a37b76 => 37
	i32 1657153582, ; 94: System.Runtime => 0x62c6282e => 117
	i32 1658251792, ; 95: Xamarin.Google.Android.Material.dll => 0x62d6ea10 => 88
	i32 1677501392, ; 96: System.Net.Primitives.dll => 0x63fca3d0 => 107
	i32 1679769178, ; 97: System.Security.Cryptography => 0x641f3e5a => 118
	i32 1711441057, ; 98: SQLitePCLRaw.lib.e_sqlite3.android => 0x660284a1 => 61
	i32 1729485958, ; 99: Xamarin.AndroidX.CardView.dll => 0x6715dc86 => 66
	i32 1736233607, ; 100: ro/Microsoft.Maui.Controls.resources.dll => 0x677cd287 => 23
	i32 1743415430, ; 101: ca\Microsoft.Maui.Controls.resources => 0x67ea6886 => 1
	i32 1760259689, ; 102: Microsoft.AspNetCore.Components.Web.dll => 0x68eb6e69 => 36
	i32 1766324549, ; 103: Xamarin.AndroidX.SwipeRefreshLayout => 0x6947f945 => 85
	i32 1770582343, ; 104: Microsoft.Extensions.Logging.dll => 0x6988f147 => 48
	i32 1780572499, ; 105: Mono.Android.Runtime.dll => 0x6a216153 => 130
	i32 1782862114, ; 106: ms\Microsoft.Maui.Controls.resources => 0x6a445122 => 17
	i32 1788241197, ; 107: Xamarin.AndroidX.Fragment => 0x6a96652d => 73
	i32 1793755602, ; 108: he\Microsoft.Maui.Controls.resources => 0x6aea89d2 => 9
	i32 1808609942, ; 109: Xamarin.AndroidX.Loader => 0x6bcd3296 => 78
	i32 1813058853, ; 110: Xamarin.Kotlin.StdLib.dll => 0x6c111525 => 89
	i32 1813201214, ; 111: Xamarin.Google.Android.Material => 0x6c13413e => 88
	i32 1818569960, ; 112: Xamarin.AndroidX.Navigation.UI.dll => 0x6c652ce8 => 82
	i32 1828688058, ; 113: Microsoft.Extensions.Logging.Abstractions.dll => 0x6cff90ba => 49
	i32 1842015223, ; 114: uk/Microsoft.Maui.Controls.resources.dll => 0x6dcaebf7 => 29
	i32 1853025655, ; 115: sv\Microsoft.Maui.Controls.resources => 0x6e72ed77 => 26
	i32 1858542181, ; 116: System.Linq.Expressions => 0x6ec71a65 => 103
	i32 1875935024, ; 117: fr\Microsoft.Maui.Controls.resources => 0x6fd07f30 => 8
	i32 1910275211, ; 118: System.Collections.NonGeneric.dll => 0x71dc7c8b => 93
	i32 1939592360, ; 119: System.Private.Xml.Linq => 0x739bd4a8 => 112
	i32 1968388702, ; 120: Microsoft.Extensions.Configuration.dll => 0x75533a5e => 39
	i32 2003115576, ; 121: el\Microsoft.Maui.Controls.resources => 0x77651e38 => 5
	i32 2019465201, ; 122: Xamarin.AndroidX.Lifecycle.ViewModel => 0x785e97f1 => 76
	i32 2025202353, ; 123: ar/Microsoft.Maui.Controls.resources.dll => 0x78b622b1 => 0
	i32 2045470958, ; 124: System.Private.Xml => 0x79eb68ee => 113
	i32 2055257422, ; 125: Xamarin.AndroidX.Lifecycle.LiveData.Core.dll => 0x7a80bd4e => 75
	i32 2066184531, ; 126: de\Microsoft.Maui.Controls.resources => 0x7b277953 => 4
	i32 2072397586, ; 127: Microsoft.Extensions.FileProviders.Physical => 0x7b864712 => 46
	i32 2079903147, ; 128: System.Runtime.dll => 0x7bf8cdab => 117
	i32 2090596640, ; 129: System.Numerics.Vectors => 0x7c9bf920 => 109
	i32 2103459038, ; 130: SQLitePCLRaw.provider.e_sqlite3.dll => 0x7d603cde => 62
	i32 2127167465, ; 131: System.Console => 0x7ec9ffe9 => 98
	i32 2159891885, ; 132: Microsoft.Maui => 0x80bd55ad => 55
	i32 2169148018, ; 133: hu\Microsoft.Maui.Controls.resources => 0x814a9272 => 12
	i32 2181898931, ; 134: Microsoft.Extensions.Options.dll => 0x820d22b3 => 50
	i32 2192057212, ; 135: Microsoft.Extensions.Logging.Abstractions => 0x82a8237c => 49
	i32 2193016926, ; 136: System.ObjectModel.dll => 0x82b6c85e => 110
	i32 2201107256, ; 137: Xamarin.KotlinX.Coroutines.Core.Jvm.dll => 0x83323b38 => 90
	i32 2201231467, ; 138: System.Net.Http => 0x8334206b => 106
	i32 2207618523, ; 139: it\Microsoft.Maui.Controls.resources => 0x839595db => 14
	i32 2266799131, ; 140: Microsoft.Extensions.Configuration.Abstractions => 0x871c9c1b => 40
	i32 2270573516, ; 141: fr/Microsoft.Maui.Controls.resources.dll => 0x875633cc => 8
	i32 2279755925, ; 142: Xamarin.AndroidX.RecyclerView.dll => 0x87e25095 => 83
	i32 2303942373, ; 143: nb\Microsoft.Maui.Controls.resources => 0x89535ee5 => 18
	i32 2305521784, ; 144: System.Private.CoreLib.dll => 0x896b7878 => 128
	i32 2340441535, ; 145: System.Runtime.InteropServices.RuntimeInformation.dll => 0x8b804dbf => 114
	i32 2353062107, ; 146: System.Net.Primitives => 0x8c40e0db => 107
	i32 2368005991, ; 147: System.Xml.ReaderWriter.dll => 0x8d24e767 => 125
	i32 2371007202, ; 148: Microsoft.Extensions.Configuration => 0x8d52b2e2 => 39
	i32 2395872292, ; 149: id\Microsoft.Maui.Controls.resources => 0x8ece1c24 => 13
	i32 2411328690, ; 150: Microsoft.AspNetCore.Components => 0x8fb9f4b2 => 35
	i32 2427813419, ; 151: hi\Microsoft.Maui.Controls.resources => 0x90b57e2b => 10
	i32 2435356389, ; 152: System.Console.dll => 0x912896e5 => 98
	i32 2442556106, ; 153: Microsoft.JSInterop.dll => 0x919672ca => 52
	i32 2465273461, ; 154: SQLitePCLRaw.batteries_v2.dll => 0x92f11675 => 59
	i32 2471841756, ; 155: netstandard.dll => 0x93554fdc => 127
	i32 2475788418, ; 156: Java.Interop.dll => 0x93918882 => 129
	i32 2480646305, ; 157: Microsoft.Maui.Controls => 0x93dba8a1 => 53
	i32 2550873716, ; 158: hr\Microsoft.Maui.Controls.resources => 0x980b3e74 => 11
	i32 2570120770, ; 159: System.Text.Encodings.Web => 0x9930ee42 => 119
	i32 2592341985, ; 160: Microsoft.Extensions.FileProviders.Abstractions => 0x9a83ffe1 => 43
	i32 2593496499, ; 161: pl\Microsoft.Maui.Controls.resources => 0x9a959db3 => 20
	i32 2605712449, ; 162: Xamarin.KotlinX.Coroutines.Core.Jvm => 0x9b500441 => 90
	i32 2617129537, ; 163: System.Private.Xml.dll => 0x9bfe3a41 => 113
	i32 2620871830, ; 164: Xamarin.AndroidX.CursorAdapter.dll => 0x9c375496 => 70
	i32 2626831493, ; 165: ja\Microsoft.Maui.Controls.resources => 0x9c924485 => 15
	i32 2663698177, ; 166: System.Runtime.Loader => 0x9ec4cf01 => 116
	i32 2692077919, ; 167: Microsoft.AspNetCore.Components.WebView.dll => 0xa075d95f => 37
	i32 2732626843, ; 168: Xamarin.AndroidX.Activity => 0xa2e0939b => 63
	i32 2737747696, ; 169: Xamarin.AndroidX.AppCompat.AppCompatResources.dll => 0xa32eb6f0 => 65
	i32 2752995522, ; 170: pt-BR\Microsoft.Maui.Controls.resources => 0xa41760c2 => 21
	i32 2758225723, ; 171: Microsoft.Maui.Controls.Xaml => 0xa4672f3b => 54
	i32 2764765095, ; 172: Microsoft.Maui.dll => 0xa4caf7a7 => 55
	i32 2778768386, ; 173: Xamarin.AndroidX.ViewPager.dll => 0xa5a0a402 => 86
	i32 2785988530, ; 174: th\Microsoft.Maui.Controls.resources => 0xa60ecfb2 => 27
	i32 2801831435, ; 175: Microsoft.Maui.Graphics => 0xa7008e0b => 57
	i32 2806116107, ; 176: es/Microsoft.Maui.Controls.resources.dll => 0xa741ef0b => 6
	i32 2810250172, ; 177: Xamarin.AndroidX.CoordinatorLayout.dll => 0xa78103bc => 68
	i32 2831556043, ; 178: nl/Microsoft.Maui.Controls.resources.dll => 0xa8c61dcb => 19
	i32 2853208004, ; 179: Xamarin.AndroidX.ViewPager => 0xaa107fc4 => 86
	i32 2861189240, ; 180: Microsoft.Maui.Essentials => 0xaa8a4878 => 56
	i32 2892341533, ; 181: Microsoft.AspNetCore.Components.Web => 0xac65a11d => 36
	i32 2909740682, ; 182: System.Private.CoreLib => 0xad6f1e8a => 128
	i32 2911054922, ; 183: Microsoft.Extensions.FileProviders.Physical.dll => 0xad832c4a => 46
	i32 2916838712, ; 184: Xamarin.AndroidX.ViewPager2.dll => 0xaddb6d38 => 87
	i32 2919462931, ; 185: System.Numerics.Vectors.dll => 0xae037813 => 109
	i32 2946106753, ; 186: ReciminsaApp.dll => 0xaf9a0581 => 91
	i32 2959614098, ; 187: System.ComponentModel.dll => 0xb0682092 => 97
	i32 2978675010, ; 188: Xamarin.AndroidX.DrawerLayout => 0xb18af942 => 72
	i32 3038032645, ; 189: _Microsoft.Android.Resource.Designer.dll => 0xb514b305 => 34
	i32 3057625584, ; 190: Xamarin.AndroidX.Navigation.Common => 0xb63fa9f0 => 79
	i32 3059408633, ; 191: Mono.Android.Runtime => 0xb65adef9 => 130
	i32 3059793426, ; 192: System.ComponentModel.Primitives => 0xb660be12 => 95
	i32 3077302341, ; 193: hu/Microsoft.Maui.Controls.resources.dll => 0xb76be845 => 12
	i32 3079666166, ; 194: ReciminsaApp => 0xb78ff9f6 => 91
	i32 3178803400, ; 195: Xamarin.AndroidX.Navigation.Fragment.dll => 0xbd78b0c8 => 80
	i32 3220365878, ; 196: System.Threading => 0xbff2e236 => 123
	i32 3258312781, ; 197: Xamarin.AndroidX.CardView => 0xc235e84d => 66
	i32 3286872994, ; 198: SQLite-net.dll => 0xc3e9b3a2 => 58
	i32 3305363605, ; 199: fi\Microsoft.Maui.Controls.resources => 0xc503d895 => 7
	i32 3316684772, ; 200: System.Net.Requests.dll => 0xc5b097e4 => 108
	i32 3317135071, ; 201: Xamarin.AndroidX.CustomView.dll => 0xc5b776df => 71
	i32 3346324047, ; 202: Xamarin.AndroidX.Navigation.Runtime => 0xc774da4f => 81
	i32 3357674450, ; 203: ru\Microsoft.Maui.Controls.resources => 0xc8220bd2 => 24
	i32 3358260929, ; 204: System.Text.Json => 0xc82afec1 => 120
	i32 3360279109, ; 205: SQLitePCLRaw.core => 0xc849ca45 => 60
	i32 3362522851, ; 206: Xamarin.AndroidX.Core => 0xc86c06e3 => 69
	i32 3366347497, ; 207: Java.Interop => 0xc8a662e9 => 129
	i32 3374999561, ; 208: Xamarin.AndroidX.RecyclerView => 0xc92a6809 => 83
	i32 3381016424, ; 209: da\Microsoft.Maui.Controls.resources => 0xc9863768 => 3
	i32 3406629867, ; 210: Microsoft.Extensions.FileProviders.Composite.dll => 0xcb0d0beb => 44
	i32 3428513518, ; 211: Microsoft.Extensions.DependencyInjection.dll => 0xcc5af6ee => 41
	i32 3430777524, ; 212: netstandard => 0xcc7d82b4 => 127
	i32 3463511458, ; 213: hr/Microsoft.Maui.Controls.resources.dll => 0xce70fda2 => 11
	i32 3471940407, ; 214: System.ComponentModel.TypeConverter.dll => 0xcef19b37 => 96
	i32 3476120550, ; 215: Mono.Android => 0xcf3163e6 => 131
	i32 3479583265, ; 216: ru/Microsoft.Maui.Controls.resources.dll => 0xcf663a21 => 24
	i32 3484440000, ; 217: ro\Microsoft.Maui.Controls.resources => 0xcfb055c0 => 23
	i32 3485117614, ; 218: System.Text.Json.dll => 0xcfbaacae => 120
	i32 3500000672, ; 219: Microsoft.JSInterop => 0xd09dc5a0 => 52
	i32 3509114376, ; 220: System.Xml.Linq => 0xd128d608 => 124
	i32 3580758918, ; 221: zh-HK\Microsoft.Maui.Controls.resources => 0xd56e0b86 => 31
	i32 3608519521, ; 222: System.Linq.dll => 0xd715a361 => 104
	i32 3624195450, ; 223: System.Runtime.InteropServices.RuntimeInformation => 0xd804d57a => 114
	i32 3641597786, ; 224: Xamarin.AndroidX.Lifecycle.LiveData.Core => 0xd90e5f5a => 75
	i32 3643446276, ; 225: tr\Microsoft.Maui.Controls.resources => 0xd92a9404 => 28
	i32 3643854240, ; 226: Xamarin.AndroidX.Navigation.Fragment => 0xd930cda0 => 80
	i32 3657292374, ; 227: Microsoft.Extensions.Configuration.Abstractions.dll => 0xd9fdda56 => 40
	i32 3672681054, ; 228: Mono.Android.dll => 0xdae8aa5e => 131
	i32 3697841164, ; 229: zh-Hant/Microsoft.Maui.Controls.resources.dll => 0xdc68940c => 33
	i32 3724971120, ; 230: Xamarin.AndroidX.Navigation.Common.dll => 0xde068c70 => 79
	i32 3748608112, ; 231: System.Diagnostics.DiagnosticSource => 0xdf6f3870 => 99
	i32 3754567612, ; 232: SQLitePCLRaw.provider.e_sqlite3 => 0xdfca27bc => 62
	i32 3786282454, ; 233: Xamarin.AndroidX.Collection => 0xe1ae15d6 => 67
	i32 3792276235, ; 234: System.Collections.NonGeneric => 0xe2098b0b => 93
	i32 3823082795, ; 235: System.Security.Cryptography.dll => 0xe3df9d2b => 118
	i32 3841636137, ; 236: Microsoft.Extensions.DependencyInjection.Abstractions.dll => 0xe4fab729 => 42
	i32 3849253459, ; 237: System.Runtime.InteropServices.dll => 0xe56ef253 => 115
	i32 3876362041, ; 238: SQLite-net => 0xe70c9739 => 58
	i32 3889960447, ; 239: zh-Hans/Microsoft.Maui.Controls.resources.dll => 0xe7dc15ff => 32
	i32 3896106733, ; 240: System.Collections.Concurrent.dll => 0xe839deed => 92
	i32 3896760992, ; 241: Xamarin.AndroidX.Core.dll => 0xe843daa0 => 69
	i32 3928044579, ; 242: System.Xml.ReaderWriter => 0xea213423 => 125
	i32 3931092270, ; 243: Xamarin.AndroidX.Navigation.UI => 0xea4fb52e => 82
	i32 3955647286, ; 244: Xamarin.AndroidX.AppCompat.dll => 0xebc66336 => 64
	i32 3980434154, ; 245: th/Microsoft.Maui.Controls.resources.dll => 0xed409aea => 27
	i32 3987592930, ; 246: he/Microsoft.Maui.Controls.resources.dll => 0xedadd6e2 => 9
	i32 4025784931, ; 247: System.Memory => 0xeff49a63 => 105
	i32 4046471985, ; 248: Microsoft.Maui.Controls.Xaml.dll => 0xf1304331 => 54
	i32 4068434129, ; 249: System.Private.Xml.Linq.dll => 0xf27f60d1 => 112
	i32 4073602200, ; 250: System.Threading.dll => 0xf2ce3c98 => 123
	i32 4094352644, ; 251: Microsoft.Maui.Essentials.dll => 0xf40add04 => 56
	i32 4100113165, ; 252: System.Private.Uri => 0xf462c30d => 111
	i32 4102112229, ; 253: pt/Microsoft.Maui.Controls.resources.dll => 0xf48143e5 => 22
	i32 4125707920, ; 254: ms/Microsoft.Maui.Controls.resources.dll => 0xf5e94e90 => 17
	i32 4126470640, ; 255: Microsoft.Extensions.DependencyInjection => 0xf5f4f1f0 => 41
	i32 4127667938, ; 256: System.IO.FileSystem.Watcher => 0xf60736e2 => 102
	i32 4150914736, ; 257: uk\Microsoft.Maui.Controls.resources => 0xf769eeb0 => 29
	i32 4164802419, ; 258: System.IO.FileSystem.Watcher.dll => 0xf83dd773 => 102
	i32 4182413190, ; 259: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.dll => 0xf94a8f86 => 77
	i32 4213026141, ; 260: System.Diagnostics.DiagnosticSource.dll => 0xfb1dad5d => 99
	i32 4271975918, ; 261: Microsoft.Maui.Controls.dll => 0xfea12dee => 53
	i32 4292120959, ; 262: Xamarin.AndroidX.Lifecycle.ViewModelSavedState => 0xffd4917f => 77
	i32 4294648842 ; 263: Microsoft.Extensions.FileProviders.Embedded => 0xfffb240a => 45
], align 4

@assembly_image_cache_indices = dso_local local_unnamed_addr constant [264 x i32] [
	i32 122, ; 0
	i32 33, ; 1
	i32 57, ; 2
	i32 115, ; 3
	i32 67, ; 4
	i32 85, ; 5
	i32 30, ; 6
	i32 31, ; 7
	i32 97, ; 8
	i32 35, ; 9
	i32 2, ; 10
	i32 30, ; 11
	i32 63, ; 12
	i32 15, ; 13
	i32 74, ; 14
	i32 61, ; 15
	i32 14, ; 16
	i32 122, ; 17
	i32 105, ; 18
	i32 34, ; 19
	i32 26, ; 20
	i32 94, ; 21
	i32 73, ; 22
	i32 126, ; 23
	i32 110, ; 24
	i32 13, ; 25
	i32 7, ; 26
	i32 51, ; 27
	i32 48, ; 28
	i32 45, ; 29
	i32 21, ; 30
	i32 71, ; 31
	i32 19, ; 32
	i32 119, ; 33
	i32 92, ; 34
	i32 1, ; 35
	i32 124, ; 36
	i32 16, ; 37
	i32 4, ; 38
	i32 116, ; 39
	i32 59, ; 40
	i32 108, ; 41
	i32 101, ; 42
	i32 25, ; 43
	i32 50, ; 44
	i32 38, ; 45
	i32 111, ; 46
	i32 100, ; 47
	i32 95, ; 48
	i32 28, ; 49
	i32 74, ; 50
	i32 94, ; 51
	i32 47, ; 52
	i32 84, ; 53
	i32 42, ; 54
	i32 3, ; 55
	i32 64, ; 56
	i32 103, ; 57
	i32 76, ; 58
	i32 96, ; 59
	i32 89, ; 60
	i32 126, ; 61
	i32 16, ; 62
	i32 22, ; 63
	i32 43, ; 64
	i32 81, ; 65
	i32 20, ; 66
	i32 18, ; 67
	i32 2, ; 68
	i32 60, ; 69
	i32 72, ; 70
	i32 104, ; 71
	i32 32, ; 72
	i32 84, ; 73
	i32 68, ; 74
	i32 0, ; 75
	i32 44, ; 76
	i32 6, ; 77
	i32 101, ; 78
	i32 65, ; 79
	i32 51, ; 80
	i32 100, ; 81
	i32 10, ; 82
	i32 5, ; 83
	i32 47, ; 84
	i32 121, ; 85
	i32 38, ; 86
	i32 25, ; 87
	i32 78, ; 88
	i32 87, ; 89
	i32 70, ; 90
	i32 106, ; 91
	i32 121, ; 92
	i32 37, ; 93
	i32 117, ; 94
	i32 88, ; 95
	i32 107, ; 96
	i32 118, ; 97
	i32 61, ; 98
	i32 66, ; 99
	i32 23, ; 100
	i32 1, ; 101
	i32 36, ; 102
	i32 85, ; 103
	i32 48, ; 104
	i32 130, ; 105
	i32 17, ; 106
	i32 73, ; 107
	i32 9, ; 108
	i32 78, ; 109
	i32 89, ; 110
	i32 88, ; 111
	i32 82, ; 112
	i32 49, ; 113
	i32 29, ; 114
	i32 26, ; 115
	i32 103, ; 116
	i32 8, ; 117
	i32 93, ; 118
	i32 112, ; 119
	i32 39, ; 120
	i32 5, ; 121
	i32 76, ; 122
	i32 0, ; 123
	i32 113, ; 124
	i32 75, ; 125
	i32 4, ; 126
	i32 46, ; 127
	i32 117, ; 128
	i32 109, ; 129
	i32 62, ; 130
	i32 98, ; 131
	i32 55, ; 132
	i32 12, ; 133
	i32 50, ; 134
	i32 49, ; 135
	i32 110, ; 136
	i32 90, ; 137
	i32 106, ; 138
	i32 14, ; 139
	i32 40, ; 140
	i32 8, ; 141
	i32 83, ; 142
	i32 18, ; 143
	i32 128, ; 144
	i32 114, ; 145
	i32 107, ; 146
	i32 125, ; 147
	i32 39, ; 148
	i32 13, ; 149
	i32 35, ; 150
	i32 10, ; 151
	i32 98, ; 152
	i32 52, ; 153
	i32 59, ; 154
	i32 127, ; 155
	i32 129, ; 156
	i32 53, ; 157
	i32 11, ; 158
	i32 119, ; 159
	i32 43, ; 160
	i32 20, ; 161
	i32 90, ; 162
	i32 113, ; 163
	i32 70, ; 164
	i32 15, ; 165
	i32 116, ; 166
	i32 37, ; 167
	i32 63, ; 168
	i32 65, ; 169
	i32 21, ; 170
	i32 54, ; 171
	i32 55, ; 172
	i32 86, ; 173
	i32 27, ; 174
	i32 57, ; 175
	i32 6, ; 176
	i32 68, ; 177
	i32 19, ; 178
	i32 86, ; 179
	i32 56, ; 180
	i32 36, ; 181
	i32 128, ; 182
	i32 46, ; 183
	i32 87, ; 184
	i32 109, ; 185
	i32 91, ; 186
	i32 97, ; 187
	i32 72, ; 188
	i32 34, ; 189
	i32 79, ; 190
	i32 130, ; 191
	i32 95, ; 192
	i32 12, ; 193
	i32 91, ; 194
	i32 80, ; 195
	i32 123, ; 196
	i32 66, ; 197
	i32 58, ; 198
	i32 7, ; 199
	i32 108, ; 200
	i32 71, ; 201
	i32 81, ; 202
	i32 24, ; 203
	i32 120, ; 204
	i32 60, ; 205
	i32 69, ; 206
	i32 129, ; 207
	i32 83, ; 208
	i32 3, ; 209
	i32 44, ; 210
	i32 41, ; 211
	i32 127, ; 212
	i32 11, ; 213
	i32 96, ; 214
	i32 131, ; 215
	i32 24, ; 216
	i32 23, ; 217
	i32 120, ; 218
	i32 52, ; 219
	i32 124, ; 220
	i32 31, ; 221
	i32 104, ; 222
	i32 114, ; 223
	i32 75, ; 224
	i32 28, ; 225
	i32 80, ; 226
	i32 40, ; 227
	i32 131, ; 228
	i32 33, ; 229
	i32 79, ; 230
	i32 99, ; 231
	i32 62, ; 232
	i32 67, ; 233
	i32 93, ; 234
	i32 118, ; 235
	i32 42, ; 236
	i32 115, ; 237
	i32 58, ; 238
	i32 32, ; 239
	i32 92, ; 240
	i32 69, ; 241
	i32 125, ; 242
	i32 82, ; 243
	i32 64, ; 244
	i32 27, ; 245
	i32 9, ; 246
	i32 105, ; 247
	i32 54, ; 248
	i32 112, ; 249
	i32 123, ; 250
	i32 56, ; 251
	i32 111, ; 252
	i32 22, ; 253
	i32 17, ; 254
	i32 41, ; 255
	i32 102, ; 256
	i32 29, ; 257
	i32 102, ; 258
	i32 77, ; 259
	i32 99, ; 260
	i32 53, ; 261
	i32 77, ; 262
	i32 45 ; 263
], align 4

@marshal_methods_number_of_classes = dso_local local_unnamed_addr constant i32 0, align 4

@marshal_methods_class_cache = dso_local local_unnamed_addr global [0 x %struct.MarshalMethodsManagedClass] zeroinitializer, align 4

; Names of classes in which marshal methods reside
@mm_class_names = dso_local local_unnamed_addr constant [0 x ptr] zeroinitializer, align 4

@mm_method_names = dso_local local_unnamed_addr constant [1 x %struct.MarshalMethodName] [
	%struct.MarshalMethodName {
		i64 0, ; id 0x0; name: 
		ptr @.MarshalMethodName.0_name; char* name
	} ; 0
], align 8

; get_function_pointer (uint32_t mono_image_index, uint32_t class_index, uint32_t method_token, void*& target_ptr)
@get_function_pointer = internal dso_local unnamed_addr global ptr null, align 4

; Functions

; Function attributes: "min-legal-vector-width"="0" mustprogress "no-trapping-math"="true" nofree norecurse nosync nounwind "stack-protector-buffer-size"="8" uwtable willreturn
define void @xamarin_app_init(ptr nocapture noundef readnone %env, ptr noundef %fn) local_unnamed_addr #0
{
	%fnIsNull = icmp eq ptr %fn, null
	br i1 %fnIsNull, label %1, label %2

1: ; preds = %0
	%putsResult = call noundef i32 @puts(ptr @.str.0)
	call void @abort()
	unreachable 

2: ; preds = %1, %0
	store ptr %fn, ptr @get_function_pointer, align 4, !tbaa !3
	ret void
}

; Strings
@.str.0 = private unnamed_addr constant [40 x i8] c"get_function_pointer MUST be specified\0A\00", align 1

;MarshalMethodName
@.MarshalMethodName.0_name = private unnamed_addr constant [1 x i8] c"\00", align 1

; External functions

; Function attributes: "no-trapping-math"="true" noreturn nounwind "stack-protector-buffer-size"="8"
declare void @abort() local_unnamed_addr #2

; Function attributes: nofree nounwind
declare noundef i32 @puts(ptr noundef) local_unnamed_addr #1
attributes #0 = { "min-legal-vector-width"="0" mustprogress "no-trapping-math"="true" nofree norecurse nosync nounwind "stack-protector-buffer-size"="8" "target-cpu"="generic" "target-features"="+armv7-a,+d32,+dsp,+fp64,+neon,+vfp2,+vfp2sp,+vfp3,+vfp3d16,+vfp3d16sp,+vfp3sp,-aes,-fp-armv8,-fp-armv8d16,-fp-armv8d16sp,-fp-armv8sp,-fp16,-fp16fml,-fullfp16,-sha2,-thumb-mode,-vfp4,-vfp4d16,-vfp4d16sp,-vfp4sp" uwtable willreturn }
attributes #1 = { nofree nounwind }
attributes #2 = { "no-trapping-math"="true" noreturn nounwind "stack-protector-buffer-size"="8" "target-cpu"="generic" "target-features"="+armv7-a,+d32,+dsp,+fp64,+neon,+vfp2,+vfp2sp,+vfp3,+vfp3d16,+vfp3d16sp,+vfp3sp,-aes,-fp-armv8,-fp-armv8d16,-fp-armv8d16sp,-fp-armv8sp,-fp16,-fp16fml,-fullfp16,-sha2,-thumb-mode,-vfp4,-vfp4d16,-vfp4d16sp,-vfp4sp" }

; Metadata
!llvm.module.flags = !{!0, !1, !7}
!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!llvm.ident = !{!2}
!2 = !{!"Xamarin.Android remotes/origin/release/8.0.4xx @ 82d8938cf80f6d5fa6c28529ddfbdb753d805ab4"}
!3 = !{!4, !4, i64 0}
!4 = !{!"any pointer", !5, i64 0}
!5 = !{!"omnipotent char", !6, i64 0}
!6 = !{!"Simple C++ TBAA"}
!7 = !{i32 1, !"min_enum_size", i32 4}
