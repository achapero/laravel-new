<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" type="image/png/ico" href="/assets/favicon.ico" />
    <!-- <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet"/> -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- <script src='https://kit.fontawesome.com/a076d05399.js'></script> -->
    <!-- <link rel="stylesheet" href="{{url('/fonts/chequeFont.css')}}"> -->
    <script>
        var pathname = window.location.pathname;
        // alert(pathname)
        // $('#higher-level').html(pathname)
        localStorage.setItem('HigherLevel', pathname)
    </script>
    {{-- <title>{{ env('APP_NAME') }}</title> --}}

    <style>

        .ant-layout-sider {
            background-color: {{ env('MIX_NAV_BG_COLOR') }} !important;
        }

        aside .ant-menu.ant-menu-light, aside .ant-menu-light .ant-menu-sub, aside .ant-menu.ant-menu-light .ant-menu-sub {
            background-color: {{ env('MIX_NAV_BG_COLOR') }} !important;
        }

        aside .ant-menu.ant-menu-light .ant-menu-item-selected, aside .ant-menu-submenu-popup.ant-menu-light .ant-menu-item-selected {
            background-color: {{ env('MIX_NAV_HOVER_ACTIVE_COLOR') }} !important;
        }

        .PNcolor {
            background-color: {{ env('MIX_LOGIN_BG_COLOR') }} !important;
        }

    </style>
</head>
<body>
<div id="app">

</div>

<script type='text/javascript' data-cfasync='false'>
    if(localStorage.user_role == 'Merchant') {
        window.purechatApi = { l: [], t: [], on: function () { this.l.push(arguments); } }; (function () { var done = false; var script = document.createElement('script'); script.async = true; script.type = 'text/javascript'; script.src = 'https://app.purechat.com/VisitorWidget/WidgetScript'; document.getElementsByTagName('HEAD').item(0).appendChild(script); script.onreadystatechange = script.onload = function (e) { if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) { var w = new PCWidget({c: 'a3bb0cf7-49b5-48a3-8e8f-c2dfb78bbb9b', f: true }); done = true; } }; })();
    }
</script>

<script>
if(localStorage.user_role == 'Merchant') {
    purechatApi.on('chatbox:ready', function () {
        console.log('visitor',localStorage.user_role)

            /* let purechatcontainer = document.getDocumentById('purechat-container');
            purechatcontainer */

            /* $('#purechat-container').addClass('hide'); */
        purechatApi.set('visitor.firstName', localStorage.merchant_name); // Sets the visitor first name to "Joe"
        purechatApi.set('visitor.email', localStorage.email); // Sets the visitor's email address to "joe@joesmarket.com"
    });

    purechatApi.on('chat:end', function (args) {
        console.log("Visitor's chat has ended :(");
        console.log('args',args) // Prints the ID of the chatbox to the console window
        console.log(args.chatboxId) // Prints the ID of the chatbox to the console window
        console.log(args.name) // Prints the name of the visitor that started the chat
        console.log(args.email) // Prints the email of the visitor that started the chat
        console.log(args.phoneNumber) // Prints the email address of the visitor that started the chat
        console.log(args.question) // Prints the question the visitor entered when he / she started the chat
        console.log(args.transcriptId) // Prints the Id of the chat transcript
        console.log(args.startedByOperator) // Prints whether the chat was started by the operator or by the visitor
    });


}
</script>
<script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
