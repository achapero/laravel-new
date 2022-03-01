<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use Auth;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\HistoricalPasswordCount;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handles Registration Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'Merchant',
            'status' => 'Inactive'
        ]);



        $token = $user->createToken('promisenetwork')->accessToken;

        $to_name = $request->name;
        $to_email = $request->email;
        $id = $user->id;
        $from= "registration";

        $data = array(
            'to_name' => $to_name,
            'to_email' => $to_email,
            'subject' => 'Welcome to Promise Network',
            'from_name' => env('MAIL_FROM_NAME'),
            'from_email' => env('MAIL_FROM_ADDRESS'),
            'template' => 'admin.emails.email-confirmation',
            'body_data' => array(
                'name' => $request->name,
                "email"=>$to_email,
                'link'=> url("/verify/$token/$from")
            )
        );


        event(new \App\Events\SendMailEvent($data));

        // Mail::send('admin.emails.email-confirmation',$data, function($message) use ($to_name, $to_email) {
        //     $message->to($to_email,$to_name)->subject('Welcome to Promise Network');;
        //     $message->from('support@promise.network','Promise Network');
        // });


        $hpc = HistoricalPasswordCount::create([
            'user_id' => $user->id,
            'password' => Hash::make($request->password)

        ]);


        $default = urlencode('https://ui-avatars.com/api/'.$user->name.'/100/0D8ABC/fff/2/0/1');
        $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $user->email ) ) ).'?d='.$default;
        // $user['image_url'] = $img;
        $user['image_url'] = $user->upload ? $user->upload : env('DEFAULT_IMAGE');

        return response()->json(['success'=> true,'data' => $user,'token' => $token], 200);
    }

    /**
     * Handles Login Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::guard('web')->user();
            if($user->status == 'Active') {
                $token = $user->createToken('promisenetwork')->accessToken;

                // $default = urlencode('https://ui-avatars.com/api/'.$user->name.'/100/0D8ABC/fff/2/0/1');
                // $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $user->email ) ) ).'?d='.$default;
                // $user['image_url'] = $img;

                $img = "";
                // if($user->upload){
                //     $img =$user->upload;
                // }else{
                //     $default = urlencode('https://ui-avatars.com/api/'.$user->name.'/100/0D8ABC/fff/2/0/1');
                //     $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $user->email ) ) ).'?d='.$default;
                // }
                $img = $user->upload ? $user->upload : env('DEFAULT_IMAGE');

                // $user_online = \App\User::find($user->id);
                // $user_online->online_status = 1;
                // $user_online->save();

                $user['image_url'] = $img;

                return response()->json([
                    'success'=> true,
                    'data' => $user,
                    'token' => $token,
                ], 200);

                // return response()->json(['success'=> true,'data' => $user,'token' => $token], 200);
            } else if ($user->status == 'Invited') {
                $token = $user->createToken('promisenetwork')->accessToken;
                return response()->json(['success' => false,'error' => 'Please verify your email address','token' => $token], 401);
            } else {
                return response()->json(['success' => false,'error' => 'Username or Password is Invalid','res' => $credentials], 401);
            }

        } else {
            return response()->json(['success' => false,'error' => 'Username or Password is Invalid','res' => $credentials], 401);
        }



    }


    /**
     * Returns Authenticated User Details
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function details()
    {
        return response()->json(['user' => auth()->user()], 200);
    }

    public function registrationVerify(Request $request) {


            $user=  Auth::guard('api')->user();
            $user->status = 'Active';
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->save();

        return response()->json([
            'success' => true
        ]);
    }


    public function verify(Request $request) {

        $this->validate($request, [
            'password' => 'required|min:6',
              ]);
             $user=  Auth::guard('api')->user();

             $hpc = HistoricalPasswordCount::create([
                'user_id' => $user->id,
                'password' => Hash::make($request->password)

            ]);

            $user->status = 'Active';
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->password = Hash::make($request->password) ;
            $user->save();




        return response()->json([
            'success' => true
        ]);
    }

    public function auth(Request $request){

        return response()->json(['success'=> true],200);
    }

    public function logout(Request $request) {
        $user_online = \App\User::find($request->user_id);
        // $user_online->online_status = 0;
        // $user_online->save();

        return response()->json(['success'=> true,'data' => $user_online], 200);
    }
}
