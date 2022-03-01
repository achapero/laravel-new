<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\HistoricalPasswordCount;
use App\UserExtensionField;
use App\ClearentMerchant;
use App\MerchantGiftCardAccount;
use App\PaysafeAccount;
use App\UserAccountLink;
use App\UserAdditionalOwner;
use App\UserRecentActivity;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(isset($request->only)) {
            $data = User::select('id','name','email')
                        ->where('role','Merchant')
                        ->groupBy('id')
                        ->orderBy('name','asc')
                        ->with('user_fields')
                        ->get();
        } else if(isset($request->not_employee)) {
            $data = User::select('id','name','email', 'role')->where('role','<>','Merchant')->orderBy('name','asc')->get();
        } else if(isset($request->unverified)) {
            $data = User::select('id','name','email')->whereIn('status',['Inactive','Invited'])->orderBy('email','asc')->get();
        } else if($request->page_number) {


            $online_users = \App\User::online()->get();
            if(count($online_users) > 0) {
                $online_users = array_column($online_users->toArray(),'id');
            } else {
                $online_users = [];
            }
            $whereInRoles = $request->role ? $request->role : [];
            $whereInStatus = $request->status ? $request->status : [];

            $data = User::select([
                // DB::raw('(GROUP_CONCAT(user_account_links.link_id SEPARATOR ",")) as `link_ids`'),
                DB::raw("DATE_FORMAT(users.created_at, '%Y-%m-%d %h:%i %p') AS created_at_srt"),
                'users.*',
                // DB::raw('(SELECT * FROM paysafe_accounts WHERE paysafe_accounts.merchant_number = user_account_links.link_id) as `paysafe_original`')
            ])
            ->leftJoin('user_account_links','user_account_links.user_id','=','users.id')
            ->leftJoin('user_extension_fields','user_extension_fields.user_id','=','users.id')
            // ->leftJoin(DB::raw("(SELECT
            //         IF ( type = 'paysafe', ( SELECT merchant_number FROM paysafe_accounts WHERE id = user_account_links.link_id ),
            //         IF ( type = 'x`', user_account_links.link_id, IF ( type = 'clearent', user_account_links.link_id, link_id ) )
            //         ) AS `link_id`, type , user_id
            //     FROM user_account_links) AS `user_account_links`") ,'user_account_links.user_id','=','users.id'
            // )
            ->where(function($q) use ($request) {
                $q->where('name','LIKE',"%$request->filter_value%")
                ->orWhere('users.id','LIKE',"%$request->filter_value%")
                ->orWhere('email','LIKE',"%$request->filter_value%")
                ->orWhere('role','LIKE',"%$request->filter_value%")
                ->orWhere('status','LIKE',"%$request->filter_value%")
                ->orWhere('user_account_links.link_id','LIKE',"%$request->filter_value%")
                ->orWhere('user_extension_fields.merchant_name','LIKE',"%$request->filter_value%")
                ->orWhere('user_extension_fields.account_type','LIKE',"%$request->filter_value%")
                ->orWhere(DB::raw("DATE_FORMAT(users.created_at, '%Y-%m-%d %h:%i %p')"), 'LIKE',"%$request->filter_value%")
                ->orWhere('user_extension_fields.team_name','LIKE',"%$request->filter_value%");
            });

            if(count($whereInRoles) > 0) {
                $data->whereIn('role', $whereInRoles);
            }

            if(count($whereInStatus) > 0) {
                $data->whereIn('status', $whereInStatus);
            }

            if($request->online_status == '1'){
                $data->whereIn('users.id', $online_users);
            }

            if($request->column) {
                if($request->column != '' && $request->column != 'undefined') {
                     $data->orderBy(isset($request->column) ? $request->column : 'id', isset($request->order)  ? $request->order : 'desc');
                }
             }

            $data = $data->limit($request->page_size)
            ->offset($request->page_size * ($request->page_number -1))
            ->with('user_links')
            ->with('user_links.clearent')
            ->with('user_links.boarding')
            ->with('user_links.paysafe')
            ->with('user_links.gift')
            ->with('authnet_merchant')
            ->with('user_fields')
            ->groupBy('id')
            ->get();

            if($request->filter_value != '') {
                $total_count = $data;
            } else {
                if($request->online_status == 1){
                    $total_count = $data;
                } else {
                    $total_count = User::all();
                }
            }
            $total_count = $total_count->count();

            foreach ($data as $key => $value) {
                $mid = [];
                $paysafe_names = [];
                $clearent_names = [];
                $gift_names = [];
                foreach($value['user_links'] as $key_u =>$a){
                    if($a['type'] == 'profile'){
                        $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                        array_push($mid, $mid_data);
                    }

                    if($a['type'] == 'paysafe'){

                        $paysafe = PaysafeAccount::where('id', $a['link_id'])->get();
                        // $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                        $mid_data = count($paysafe) > 0 ? '<span>'.$paysafe[0]['merchant_number'].'</span>' : '';
                        array_push($mid, $mid_data);

                        // $data[$key]['paysafe'] = $paysafe;
                        $paysafe_data = count($paysafe) > 0 ?
                            '<a
                                style="color: #20a8d8; cursor : pointer;"
                                href="/reporting/paysafe/accounts/'.$paysafe[0]['merchant_number'].'"
                            >
                                '.$this->limit($paysafe[0]['merchant_name'], 15).'
                            </a>':
                            [];
                        array_push($paysafe_names, $paysafe_data);
                    }

                    if($a['type'] == 'clearent'){
                        $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                        array_push($mid, $mid_data);
                        $clearent = ClearentMerchant::where('merchantNumber',$a['link_id'])->get();
                        // $data[$key]['clearent'] = $clearent;
                        $clearent_data = count($clearent) > 0 ?
                            '<a
                                style="color: #20a8d8; cursor : pointer;"
                                href="/reporting/clearent/accounts/'.$clearent[0]['merchantNumber'].'"
                            >
                                '.$this->limit($clearent[0]['merchantDBA'], 15).'
                            </a>':
                            [];
                        array_push($clearent_names, $clearent_data);
                    }

                    if($a['type'] == 'gift'){
                        $gift = $this->getGiftCardAccount($a['link_id']);
                        // $gift = MerchantGiftCardAccount::where('id',$a['link_id'])->get();
                        // $data[$key]['gift'] = $gift;
                        $gift_data = count($gift) > 0 ?
                            '<span>'.$this->limit($gift[0]['merchant_name'], 15).'</span>':
                            [];
                        array_push($gift_names, $gift_data);
                    }

                    if($a['type'] == 'boarding'){
                        $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                        array_push($mid, $mid_data);
                        $boarding = \App\ClearentBoarding::where('merchantNumber',$a['link_id'])->get();
                        // $data[$key]['boarding'] = $boarding;
                    }
                }
                $data[$key]['mid_values'] = count($mid) > 0 ? $mid : '';
                $data[$key]['paysafe_names'] = count($paysafe_names) > 0 ? $paysafe_names : 'None';
                $data[$key]['clearent_names'] = count($clearent_names) > 0 ? $clearent_names : 'None';
                $data[$key]['gift_names'] = count($gift_names) > 0 ? $gift_names : 'None';
            }

            return response()->json([
                'success'=> true,
                'data' => $data,
                'total_count' =>$total_count,
                'whereInRoles' => $whereInRoles,
                'online_users' => $online_users
            ]);
        } else {
            $data = User::select(
                'users.*',
                'user_account_links.link_id as user_link_id',
                'user_account_links.type as user_link_type',
            )
            ->leftJoin('user_account_links', 'users.id','=','user_account_links.user_id')
            ->orderBy('id','desc')
            ->with('user_fields')
            ->groupBy('users.email');

            if(auth()->user()->role == 'Merchant: Tickets Only') {
                $data = $data->where('user_account_links.link_id', auth()->user()->id)->where('user_account_links.type', 'merchantTickets');
            }
            $data = $data->get();

            // foreach ($data as $key => $value) {
            //     $default = urlencode('https://ui-avatars.com/api/'.$value->name.'/100/0D8ABC/fff/2/0/1');
            //     $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $value->email ) ) ).'?d='.$default;
            //     $value['image_url'] = $img;
            // }
        }

        return response()->json([
            'success'=> true,
            'data' => $data,
        ]);
    }

    private function getGiftCardAccount($link_id, $find = null) {
        $url = env('PNGIFT_URL')."/api/gift_card_accounts?link_id=$link_id&find=$find";
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                                                'Content-Type: application/json',
                                                'Authorization: Bearer '.env('PNGIFT_API_KEY'),
                                            ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);
        // dd($result);

        $result = json_decode($result, true);
        $result = $result['data'];
        return $result;
    }

    private function limit($var, $limit=15)
    {
        if ( strlen($var) > $limit ) {
            return substr($var, 0, $limit) . '...';
        } else {
            return $var;
        }
    }

    public function profiles(Request $request)
    {
        $online_users = \App\User::online()->get();
        if(count($online_users) > 0) {
            $online_users = array_column($online_users->toArray(),'id');
        } else {
            $online_users = [];
        }
        $whereInRoles = $request->role ? $request->role : [];
        $whereInStatus = $request->status ? $request->status : [];

        $data = User::select([
            DB::raw("DATE_FORMAT(users.created_at, '%Y-%m-%d %h:%i %p') AS created_at_srt"),
            'users.*',
        ])
        ->leftJoin('user_account_links','user_account_links.user_id','=','users.id')
        ->leftJoin('user_extension_fields','user_extension_fields.user_id','=','users.id')
        ->where(function($q) use ($request) {
            $q->where('name','LIKE',"%$request->filter_value%")
            ->orWhere('users.id','LIKE',"%$request->filter_value%")
            ->orWhere('email','LIKE',"%$request->filter_value%")
            ->orWhere('role','LIKE',"%$request->filter_value%")
            ->orWhere('status','LIKE',"%$request->filter_value%")
            ->orWhere('user_account_links.link_id','LIKE',"%$request->filter_value%")
            ->orWhere('user_extension_fields.merchant_name','LIKE',"%$request->filter_value%")
            ->orWhere('user_extension_fields.account_type','LIKE',"%$request->filter_value%")
            ->orWhere(DB::raw("DATE_FORMAT(users.created_at, '%Y-%m-%d %h:%i %p')"), 'LIKE',"%$request->filter_value%")
            ->orWhere('user_extension_fields.team_name','LIKE',"%$request->filter_value%");
        });

        if(count($whereInRoles) > 0) {
            $data->whereIn('role', $whereInRoles);
        }

        if(count($whereInStatus) > 0) {
            $data->whereIn('status', $whereInStatus);
        }

        if($request->online_status == '1'){
            $data->whereIn('users.id', $online_users);
        }

        if($request->column && $request->order) {
            if(
                $request->column != '' && $request->column != 'undefined' && $request->column != 'null'  &&
                $request->order != ''  && $request->order != 'undefined' && $request->order != 'null'
            ) {
                $data->orderBy(isset($request->column) ? $request->column : 'id', isset($request->order)  ? $request->order : 'desc');
            }
        } else {
            $data->orderBy('id','desc');
        }

        $data = $data->limit($request->page_size)
        ->offset($request->page_size * ($request->page_number -1))
        ->with('user_links')
        ->with('user_links.clearent')
        ->with('user_links.boarding')
        ->with('user_links.paysafe')
        // ->with('user_links.gift')
        ->with('authnet_merchant')
        ->with('user_fields')
        ->groupBy('id')
        ->get();

        foreach ($data as $key => $value) {
            $mid = [];
            $paysafe_names = [];
            $clearent_names = [];
            $gift_names = [];
            foreach($value['user_links'] as $key_u =>$a){
                if($a['type'] == 'profile'){
                    $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                    array_push($mid, $mid_data);
                }

                if($a['type'] == 'paysafe'){
                    // $data[$key]['paysafe'] = $paysafe;
                    // $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                    // array_push($mid, $mid_data);

                    $paysafe = $a['paysafe'];

                    $mid_data = count($paysafe) > 0 ? '<span>'.$this->last_limit($paysafe[0]['merchant_number']).'</span>' : '';
                    array_push($mid, $mid_data);

                    $paysafe_data = count($paysafe) > 0 ?
                        '<a
                            style="color: #20a8d8; cursor : pointer;"
                            href="/reporting/paysafe/accounts/'.$paysafe[0]['merchant_number'].'"
                        >
                            '.$this->limit($paysafe[0]['merchant_name'], 15).'
                        </a>':
                        [];
                    array_push($paysafe_names, $paysafe_data);
                }

                if($a['type'] == 'clearent'){
                    // $clearent = ClearentMerchant::where('merchantNumber',$a['link_id'])->get();
                    // $data[$key]['clearent'] = $clearent;

                    $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                    array_push($mid, $mid_data);

                    $clearent = $a['clearent'];
                    $clearent_data = count($clearent) > 0 ?
                        '<a
                            style="color: #20a8d8; cursor : pointer;"
                            href="/reporting/clearent/accounts/'.$clearent[0]['merchantNumber'].'"
                        >
                            '.$this->limit($clearent[0]['merchantDBA'], 15).'
                        </a>':
                        [];
                    array_push($clearent_names, $clearent_data);
                }

                if($a['type'] == 'gift'){
                    // $gift = MerchantGiftCardAccount::where('id',$a['link_id'])->get();
                    // $data[$key]['gift'] = $gift;

                    $gift = $this->getGiftCardAccount($a['link_id'], true);
                    // $gift = $a['gift'];
                    $gift_data = $gift ?
                        '<span>'.$this->limit($gift['merchant_name'], 15).'</span>':
                        [];
                    array_push($gift_names, $gift_data);
                }

                if($a['type'] == 'boarding'){
                    // $boarding = \App\ClearentBoarding::where('merchantNumber',$a['link_id'])->get();
                    $mid_data = '<span>'.$this->last_limit($a['link_id'], 4).'</span>';
                    array_push($mid, $mid_data);

                    // $boarding = $a['boarding'];
                    // $data[$key]['boarding'] = $boarding;
                }
            }
            $data[$key]['mid_values'] = count($mid) > 0 ? $mid : '';
            $data[$key]['paysafe_names'] = count($paysafe_names) > 0 ? $paysafe_names : 'None';
            $data[$key]['clearent_names'] = count($clearent_names) > 0 ? $clearent_names : 'None';
            $data[$key]['gift_names'] = count($gift_names) > 0 ? $gift_names : 'None';
        }


        if($request->filter_value != '') {
            $total_count = $data;
        } else {
            if($request->online_status == 1){
                $total_count = $data;
            } else {
                $total_count = User::all();
            }
        }
        $total_count = $total_count->count();

        return response()->json([
            'success'=> true,
            'data' => $data,
            'total_count' =>$total_count,
            'whereInRoles' => $data,
            'online_users' => $online_users
        ]);
    }

    private function last_limit($var, $limit=4)
    {
        if ( strlen($var) > $limit ) {
            return '****'.substr($var, 0, $limit);
        } else {
            return $var;
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $this->validate($request, [
        //     'name' => 'required|min:3',
        //     'email' => 'required|email|unique:users',
        //     'password' => 'required|min:6',
        // ]);

        // $findEmail = User::where('email', $request->email)->get();
        // if($findEmail){
        //     return response()->json(['success'=> false, 'Message' => "Email is already in use"], 500);
        // }

        $default = urlencode('https://ui-avatars.com/api/'.$request->name.'/100/0D8ABC/fff/2/0/1');
        $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $request->email ) ) ).'?d='.$default;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'upload' => $img,
            'role' => $request->role,
            'status' => $request->status ? $request->status : 'Active',
            'init_login' => $request->role != 'Merchant' ? 0 : 1 ,
            'password' => Hash::make($request->password),
        ]);

        if($request->company){
            if($request->requestMID){
                $merchantNumber = $this->generateMerchantNumber();
                $formdata = new \App\FormData ;
                $formdata->form_id = 1 ;
                $formdata->email = $request->email;
                // $formdata->inputs = "";

                $_array =
                    array(
                        'DbaOfBusiness' => $request->company,
                    );


                $formdata->inputs = json_encode($_array);

                $formdata->saveQuietly();

                $clearentReservedMID = \App\ClearentReservedMID::create([
                    'user_id' => $user->id,
                    'merchantNumber' => $merchantNumber
                ]);
             }
        }

        if($request->date_entered_by){
            $date_entered_by = User::find($user->id) ;
            $date_entered_by->save();
        }

        $uef =  UserExtensionField::create([
            'user_id' =>  $user->id,
            'merchant_name' =>  isset($request->company) ? $request->company : "" ,
            'date_entered_by' => $request->date_entered_by,

        ]);

        $hpc = HistoricalPasswordCount::create([
            'user_id' =>  $user->id,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success'=> true,
            'data' => $user,
            // 'request' => $request,
        ], 200);

        // $token = $user->createToken('promisenetwork')->accessToken;

        // $to_name = $request->email;
        // $to_email = $request->email;
        // $id = $user->id;
        // $from= "invitation";
        // //get first name and last name
        // $name = $request->name;
        // $parts = explode(" ", $name);
        // if(count($parts) > 1) {
        //     $lastname = array_pop($parts);
        //     $firstname = implode(" ", $parts);
        // }
        // else
        // {
        //     $firstname = $name;
        //     $lastname = " ";
        // }


        // $data = array(
        //     'to_name' => $to_name,
        //     'to_email' => $to_email,
        //     'subject' => 'Invitation from Promise Network',
        //     'from_name' => env('MAIL_FROM_NAME').' Support',
        //     'from_email' => env('MAIL_FROM_ADDRESS'),
        //     'template' => 'admin.emails.invitation-from-promisenetwork',
        //     'body_data' => [
        //         'name' => $request->email,
        //         "email"=>$to_email,
        //         "firstname"=> $firstname,
        //         "lastname"=> $lastname,
        //         "company"=>$request->company,
        //         'link'=> url("/verify/$token/$from")
        //     ]
        // );


        // event(new \App\Events\SendMailEvent($data));



        // $send_to  = User::where("role","Super Admin")->get();

        //     foreach($send_to as $key => $a){

        //         $to_email = $a['email'];
        //         $to_name = $a['email'];
        //         $new = array(
        //             'to_name' => $to_name,
        //             'to_email' => $to_email,
        //             'subject' => 'New User Invited Alert',
        //             'from_name' => env('MAIL_FROM_NAME').' Support',
        //             'from_email' => env('MAIL_FROM_ADDRESS'),
        //             'template' => 'admin.emails.new-people-invitation-from-promisenetwork',
        //             'body_data' => [
        //                 'name' =>$request->email,
        //                 "email"=>$request->email,
        //                 "firstname"=>$firstname,
        //                 "lastname"=>$lastname,
        //                 "company"=>$request->company,
        //                 'link'=> url("/profiles/$user->id")
        //             ]
        //         );


        //         event(new \App\Events\SendMailEvent($new));
        //     }


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $_data = User::find($id);
        $_data_ext = UserExtensionField::where('user_id',$id)->get();
        $_data_owner = UserAdditionalOwner::where('user_id',$id)->get();
        if(!$_data) {
            return response()->json([
                'success' => false,
                'message' => 'User Data Not Founds'
            ], 404);
        }

        $data = [];
        $img = "";
        if ($_data->upload) {
            $img =$_data->upload;
        } else {
            // $default = urlencode('https://ui-avatars.com/api/'.$_data->name.'/100/0D8ABC/fff/2/0/1');
            // $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $_data->email ) ) ).'?d='.$default;
            // $img =  env('DEFAULT_IMAGE');
            $img =  '';
        }

        $data['image_url'] = $img;

        $data['id'] = $_data->id;
        $data['email'] = $_data->email;
        $data['name'] = $_data->name;
        $data['phone_number'] = $_data->phone_number;
        $data['address'] = $_data->address;
        $data['preferred_email'] = $_data->preferred_email;
        $data['role'] = $_data->role;
        $data['status'] = $_data->status;
        $data['upload'] = $_data->upload;
        $data['init_login_date'] = $_data->init_login_date;
        $data['created_at'] =  $_data->created_at;
        $data['updated_at'] = $_data->updated_at;
        $data['receive_alerts'] = $_data->receive_alerts;


        foreach($_data_ext as $key => $_data_ex){

            $data['owner_address'] =$_data_ex->owner_address;
            $data['website'] =$_data_ex->website;
            $data['other_phone_number'] = $_data_ex->other_phone_number;
            $data['assigned_to'] = $_data_ex->assigned_to;
            $data['industry'] = $_data_ex->industry;
            $data['type'] = $_data_ex->type;
            $data['iso_agent_reseller'] = $_data_ex->iso_agent_reseller;
            $data['date_modified_by'] = $_data_ex->date_modified_by;
            $data['date_entered_by'] = $_data_ex->date_entered_by;
            $data['billing_address'] = $_data_ex->billing_address;
            $data['shipping_address'] = $_data_ex->shipping_address;
            $data['tin'] = $_data_ex->tin;
            $data['irs_name'] = $_data_ex->irs_name;
            $data['description'] = $_data_ex->description;
            $data['merchant_number'] =$_data_ex->merchant_number;
            $data['ssn_last_4_digits'] =$_data_ex->ssn_last_4_digits;
            $data['percentage_of_ownership'] =$_data_ex->percentage_of_ownership;
            $data['team_name'] =$_data_ex->team_name;
            $data['account_type'] =$_data_ex->account_type;
            $data['merchant_name'] = $_data_ex->merchant_name;
            $data['bank_name'] = $_data_ex->bank_name;
            $data['routing_number'] = $_data_ex->routing_number;
            $data['account_number'] = $_data_ex->account_number;
            $data['credit_decision_date'] = $_data_ex->credit_decision_date;
            $data['monthly_limit'] = $_data_ex->monthly_limit;
            $data['front_end'] = $_data_ex->front_end;
            $data['back_end'] = $_data_ex->back_end;
            $data['etc_type'] = $_data_ex->etc_type;
            $data['discount_method'] = $_data_ex->discount_method;
            $data['days_hold'] = $_data_ex->days_hold;
            $data['dda_number'] = $_data_ex->dda_number;
            $data['sic_code'] = $_data_ex->sic_code;
            $data['annex_number'] = $_data_ex->annex_number;
            $data['discover_number'] = $_data_ex->discover_number;
            $data['waive_etf'] = $_data_ex->waive_etf;
            $data['chain_code'] = $_data_ex->chain_code;
            $data['tc_date'] = $_data_ex->tc_date;
            $data['virtual_terminal_un'] = $_data_ex->virtual_terminal_un;
            $data['virtual_terminal_pw'] = $_data_ex->virtual_terminal_pw;
            // $data['updated_at'] = $_data_ex->updated_at;
        }

        // foreach($_data_owner as $key => $_data_ow){
        //     $data['merchant_name'] =$_data_ow->merchant_name;
        //     $data['merchant_number'] =$_data_ow->merchant_number;
        //     $data['percentage_of_ownership'] =$_data_ow->percentage_of_ownership;
        //     $data['ssn_last_4_digits'] =$_data_ow->ssn_last_4_digits;
        // }

        $data['owner'] =$_data_owner;

        return response()->json([
            'success' => true,
            'data' => $data
        ]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'user with id ' . $id . ' not found'
            ], 400);
        }

        if($request->owner){
            $user_owner = UserAdditionalOwner::where('user_id', $id)->delete();
            foreach ($request->owner as $key => $value) {
                // $user_owner = UserAdditionalOwner::where('user_id', $id)->delete();

                $UserAdditionalOwner = new UserAdditionalOwner();
                $UserAdditionalOwner->user_id = $id;
                if(@isset($value['merchant_name'])) {
                    $UserAdditionalOwner->merchant_name = $value['merchant_name'];
                }
                if(@isset($value['merchant_number'])) {
                    $UserAdditionalOwner->merchant_number = $value['merchant_number'];
                }
                if(@isset($value['percentage_of_ownership'])) {
                    $UserAdditionalOwner->percentage_of_ownership = $value['percentage_of_ownership'];
                }
                if(@isset($value['ssn_last_4_digits'])) {
                    $UserAdditionalOwner->ssn_last_4_digits = $value['ssn_last_4_digits'];
                }
                $UserAdditionalOwner->save();
            }
        }

        if(isset($request->init_login)) {
            $user = User::find($id);
            $user->init_login = 0;
            $user->init_login_date = date('Y-m-d H:i:s');
            $user->save();

            event(new \App\Events\UserInitLoginUpdated($user, $request->eula_pdf));

            return response()->json([
                'success' => true,
                'data' =>  $user,
                // 'user_owners'=>$user_owner,
            ]);
        } else if ($request->from == "PageUserEdit") {
            $user = User::find($id);
            $user = $user->fill($request->all());
            $user->password = Hash::make($request->phone_number);
            $user=$user->save();

            return response()->json([
                'success' => true,
                // 'data' =>  $request['data']->phone_number,
                'save' =>  $user,
                // 'user_owners'=>$user_owner,
            ]);
        } else {
            $user = User::find($id);
            $user->updated_at = date('Y-m-d H:i:s');
            $user->save();

            $upload = '';
            if($request->image_url) {
                if(strpos($request->image_url , 'data:image') === 0) {
                    $upload  = $this->saveImage($request->image_url);
                } else {
                    $upload  = $request->image_url;
                }
            } else{
                $upload  = $user->upload;
            }

            if($request->main){
                $user = User::find($id);
                $user->fill($request->main);
                $user->upload =  $request->image_url ? $upload : '';
                $user->save();
            }

            if($request->extension){
                $userExt = UserExtensionField::updateOrCreate(
                    [
                        'user_id' => $id
                    ],
                    $request->extension
                );

                $userExt->date_modified_by = auth()->user()->name;
                // $userExt->updated_at = date('Y-m-d H:i:s');
                $userExt = $userExt->save();
            } else {
                $userExt = UserExtensionField::where('user_id', $id)->first();
                if(!$userExt) {
                    $userExt = new UserExtensionField();
                }
                $userExt->date_modified_by = auth()->user()->name;
                // $userExt->updated_at = date('Y-m-d H:i:s');
                $userExt = $userExt->save();
            }

            if($request->settings){
                $user = User::find($id);
                $user->phone_number =  $request->settings['phone_number'];
                $user->address =  $request->settings['address'];
                $user->email =  $request->settings['email'];
                $user->preferred_email =  $request->settings['preferred_email'];
                $user->name=  $request->settings['name'];
                // $user->upload =  $upload;
                $user->save();
            }

            // $user->phone_number =  $request->phone_number;
            // $user->address =  $request->address;
            // $user->email =  $request->email;
            // $user->preferred_email =  $request->preferred_email;
            // $user->role=  $request->role;
            // $user->status=  $request->status;
            // $user->name=  $request->name;
            // $user->upload =  $upload;
            // $user->save();


            // if(sizeof($userExt)== 0) {
            // if(!$userExt) {
                //     $_data_user_add = new UserExtensionField() ;
                //     $_data_user_add->user_id= $id;

                //     data_user_add->owner_address= $request->owner_address ;
                //     $_data_user_add->website= $request->website ;
                //     $_data_user_add->other_phone_number =$request->other_phone_number ;
                //     $_data_user_add->assigned_to=$request->assigned_to ;
                //     $_data_user_add->industry=$request->industry ;
                //     $_data_user_add->type=$request->type ;
                //     $_data_user_add->iso_agent_reseller=$request->iso_agent_reseller ;

                //     $_data_user_add->billing_address=$request->billing_address ;
                //     $_data_user_add->shipping_address=$request->shipping_address ;
                //     $_data_user_add->tin=$request->tin ;
                //     $_data_user_add->irs_name=$request->irs_name ;
                //     $_data_user_add->billing_address=$request->billing_address ;
                //     $_data_user_add->team_name=$request->team_name ;
                //     $_data_user_add->account_type=$request->account_type ;
                //     $_data_user_add->merchant_number =$request->merchant_number ;
                //     $_data_user_add->percentage_of_ownership =$request->percentage_of_ownership ;
                //     $_data_user_add->ssn_last_4_digits =$request->ssn_last_4_digits ;
                //     $_data_user_add->merchant_name=$request->merchant_name ;
                //     $_data_user_add->date_modified_by =$request->date_modified_by ;
                //     $_data_user_add->bank_name=$request->bank_name ;
                //     $_data_user_add->routing_number =$request->routing_number ;
                //     $_data_user_add->account_number =$request->account_number ;

                //     $_data_user_add->virtual_terminal_un =$request->virtual_terminal_un ;
                //     $_data_user_add->virtual_terminal_pw =$request->virtual_terminal_pw ;

                //     $_data_user_add->credit_decision_date=$request->credit_decision_date ;
                //     $_data_user_add->monthly_limit=$request->monthly_limit ;
                //     $_data_user_add->front_end=$request->front_end ;
                //     $_data_user_add->back_end=$request->back_end ;
                //     $_data_user_add->etc_type=$request->etc_type ;
                //     $_data_user_add->discount_method=$request->discount_method ;
                //     $_data_user_add->days_hold=$request->days_hold ;
                //     $_data_user_add->dda_number=$request->dda_number ;
                //     $_data_user_add->sic_code=$request->sic_code ;
                //     $_data_user_add->annex_number=$request->annex_number ;
                //     $_data_user_add->discover_number=$request->discover_number ;
                //     $_data_user_add->waive_etf=$request->waive_etf ;
                //     $_data_user_add->chain_code=$request->chain_code ;
                //     $_data_user_add->tc_date=$request->tc_date ;
                //     $_data_user_add->save();
            // }else{
                //     foreach($userExt as $key => $_data_user) {
                //         $_data_user->owner_address = $request->owner_address ;
                //         $_data_user->website = $request->website ;
                //         $_data_user->other_phone_number = $request->other_phone_number ;
                //         $_data_user->assigned_to = $request->assigned_to ;
                //         $_data_user->industry = $request->industry ;
                //         $_data_user->type = $request->type ;
                //         $_data_user->iso_agent_reseller = $request->iso_agent_reseller ;
                //         $_data_user->billing_address = $request->billing_address ;
                //         $_data_user->shipping_address = $request->shipping_address ;
                //         $_data_user->tin = $request->tin ;
                //         $_data_user->irs_name = $request->irs_name ;
                //         $_data_user->team_name = $request->team_name ;
                //         $_data_user->account_type = $request->account_type ;
                //         $_data_user->description = $request->description ;

                //         $_data_user->merchant_number  = $request->merchant_number ;
                //         $_data_user->ssn_last_4_digits  = $request->ssn_last_4_digits ;
                //         $_data_user->percentage_of_ownership  = $request->percentage_of_ownership ;
                //         $_data_user->merchant_name = $request->merchant_name ;
                //         $_data_user->date_modified_by  = $request->date_modified_by ;
                //         $_data_user->bank_name = $request->bank_name ;
                //         $_data_user->routing_number  = $request->routing_number ;
                //         $_data_user->account_number = $request->account_number ;

                //         $_data_user->virtual_terminal_un  = $request->virtual_terminal_un ;
                //         $_data_user->virtual_terminal_pw  = $request->virtual_terminal_pw ;

                //         $_data_user->credit_decision_date = $request->credit_decision_date ;
                //         $_data_user->monthly_limit = $request->monthly_limit ;
                //         $_data_user->front_end = $request->front_end ;
                //         $_data_user->back_end = $request->back_end ;
                //         $_data_user->etc_type = $request->etc_type ;
                //         $_data_user->discount_method = $request->discount_method ;
                //         $_data_user->days_hold = $request->days_hold ;
                //         $_data_user->dda_number = $request->dda_number ;
                //         $_data_user->sic_code = $request->sic_code ;
                //         $_data_user->annex_number = $request->annex_number ;
                //         $_data_user->discover_number = $request->discover_number ;
                //         $_data_user->waive_etf = $request->waive_etf ;
                //         $_data_user->chain_code = $request->chain_code ;
                //         $_data_user->tc_date = $request->tc_date ;
                //         $userExt->save();
                //     }
            // }
            return response()->json([
                'success' => true,
                'data' =>  auth()->user()->name,
                'main' =>  $request->main,
                'extension' =>  $request->extension,
                'user' =>  $user,
                // 'request main'=>$request->main,
                // 'request extension'=>$request->extension,
                // 'request settings'=>$request->settings,
                // 'save'=>$user_image,
            ]);

        }

    }

    public function updatePass(Request $request, $id)
    {
        $request->isMandatory;
        $credentials = [
            'id' =>$id,
            'password'=> $request->cur_password
        ];
        //current pass validate
       if( Auth::guard('web')->attempt($credentials)){
             $this->validate($request, [
            'password' => 'required|min:6',
              ]);


                $history_passwords = HistoricalPasswordCount:: where('user_id',$id)->orderBy('id','desc')->limit(4)->get();
                $a = "";
                foreach($history_passwords  as $keys => $history_password){

                    $hash = $history_password['password'];
                     if (password_verify($request->password, $hash)) {
                            if(password_verify($request->cur_password, $hash)){
                                $a = "This is your Current Password. Please create a new unique password" ;
                            } else{
                                $a = "This password has already been used. Please create a new unique password" ;
                            }
                       }

                }

                if($a == ""){
                    $user = User::find($id);
                    $user->password = Hash::make($request->password) ;
                    $user->save();

                    $hpc = HistoricalPasswordCount::create([
                        'user_id' => $id,
                        'password' => Hash::make($request->password),
                        // 'mandatory'=> $request->isMandatory == null ? null : $request->isMandatory ,
                        'mandatory'=> $request->isMandatory == null ? 'Yes' : $request->isMandatory ,
                    ]);



                }

                return response()->json(['success'=> true,'data' =>'user updated' , 'message'=>$a], 200);

       } else{
        return response()->json(['success'=> false,'data' =>'user not updated']);
       }

    }

    public function updatePasswordFromProfile(Request $request, $id)

    {
            $this->validate($request, [
            'password' => 'required|min:6',
              ]);

            $history_passwords = HistoricalPasswordCount:: where('user_id',$id)->orderBy('id','desc')->limit(4)->get();
            $a = "";
            foreach($history_passwords  as $keys => $history_password){

                $hash = $history_password['password'];
                 if (password_verify($request->password, $hash)) {
                        $a = "This password has already been used on this Account, Please create a new unique password" ;
                  }
            }

            if($a == ""){
                $user = User::find($id);
                $user->password = Hash::make($request->password) ;
                $user->init_login = $user->init_login ? 1 : 0;
                $user->save();

                $hpc = HistoricalPasswordCount::create([
                    'user_id' => $id,
                    'password' => Hash::make($request->password)

                ]);


            }

            return response()->json(['success'=> true,'data' =>'user updated' , 'message'=> $a], 200);

    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);
        $userExtensionField = UserExtensionField::where('user_id', $id)->first();
        // $userAccountLink = UserAccountLink::find($id);
        // $userAdditionalOwner = UserAdditionalOwner::where('user_id', $id)->first();
        // $userRecentActivity = UserRecentActivity::where('user_id', $id)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User with id ' . $id . ' not found'
            ], 400);
        }
        // else {
        //     return response()->json([
        //         'success' => true,
        //         'message' => 'User with id ' . $id . ' found'
        //     ], 200);
        // }
        if ($user->delete()) {
            if (!$userExtensionField) {
                return response()->json([
                    'success' => true
                ]);
            } else {
                $userExtensionField->delete();
                return response()->json([
                    'success' => true
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User could not be deleted'
            ], 500);
        }


    }

    public function filtered(Request $request, $id) {


        $whereInRoles = [];
        if($request->show_super_admin == 'true') {
            array_push($whereInRoles,'Super Admin');
        }
        if($request->show_manager == 'true') {
            array_push($whereInRoles,'Manager');
        }
        if($request->show_merchant == 'true') {
            array_push($whereInRoles,'Merchant');
        }

        if($request->show_admin == 'true') {
            array_push($whereInRoles,'Admin');
        }


        $whereInStatus = [];
        if($request->show_active == 'true') {
            array_push($whereInStatus,'Active');
        }

        if($request->show_inactive == 'true') {
            array_push($whereInStatus,'Inactive');
        }
        if($request->show_inquiry == 'true') {
            array_push($whereInStatus,'Inquiry');
        }
        if($request->show_invited == 'true') {
            array_push($whereInStatus,'Invited');
        }

        // This
        $users = User::select('users.*')->whereIn('role',$whereInRoles)->whereIn('status',$whereInStatus)
        ->leftJoin('user_extension_fields','user_extension_fields.user_id','=','users.id')
        ->where(function($q) use ($request) {
            $q->where('name','LIKE',"%$request->filter_value%")
            ->orWhere('email','LIKE',"%$request->filter_value%")
            ->orWhere('role','LIKE',"%$request->filter_value%")
            ->orWhere('status','LIKE',"%$request->filter_value%")
            ->orWhere('user_extension_fields.merchant_name','LIKE',"%$request->filter_value%");
        })->limit($request->page_size)
        ->offset($request->page_size * ($request->page_number -1) )
        ->orderBy($request->sort_order != false ? $request->sort_order['column'] : 'name',$request->sort_order != false ? $request->sort_order['order']:'asc')
        ->with('user_links')
        ->with('authnet_merchant')
        ->with('user_fields')
        ->get();

        foreach ($users as $key => $value) {

            $img = "";
            if($value->upload){
                $img =$value->upload;
            }else{
                $default = urlencode('https://ui-avatars.com/api/'.$value->name.'/100/0D8ABC/fff/2/0/1');
                $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $value->email ) ) ).'?d='.$default;
            }

            $value['image_url'] = $img;
            // $default = urlencode('https://ui-avatars.com/api/'.$value->name.'/100/0D8ABC/fff/2/0/1');
            // $img =  'https://www.gravatar.com/avatar/'.md5( strtolower( trim( $value->email ) ) ).'?d='.$default;
            // $value['image_url'] = $img;
            foreach($value['user_links'] as $key_u =>$a){
                if($a['type'] == 'clearent'){
                    $clearent = ClearentMerchant::where('merchantNumber',$a['link_id'])->get()->toArray();
                    $users[$key]['clearent'] = $clearent;
                }
                if($a['type'] == 'paysafe'){
                    $paysafe = PaysafeAccount::where('id',$a['link_id'])->get()->toArray();
                    $users[$key]['paysafe'] = $paysafe;
                }
                if($a['type'] == 'gift'){
                    $gift = $this->getGiftCardAccount($a['link_id']);
                    // $gift = MerchantGiftCardAccount::where('id',$a['link_id'])->get()->toArray();
                    $users[$key]['gift'] = $gift;
                }
                if($a['type'] == 'boarding'){
                    $boarding = \App\ClearentBoarding::where('merchantNumber',$a['link_id'])->get()->toArray();
                    $users[$key]['boarding'] = $boarding;
                }

            }
        }

        if($request->filter_value != '') {
            $total_count = $users;
        } else {
            $total_count = User::all();
        }

        $total_count = $total_count->count();

        return response()->json([
            'success'=> true,
            'data' => $users,
            'total_count' =>$total_count,
            'whereInRoles' => $whereInRoles
        ]);

    }



    public function filtered_new(Request $request) {
        $total_count = User::all();
        $total_count = $total_count->count();


        return response()->json([
            'success'=> true,
            'total_count' => $total_count,
        ]);

    }


    public function getMids (Request $request){
        $users = User::where('id',$request->id)
        ->with('user_links')
        ->with('user_fields')
        ->with('authnet_merchant')
        ->get();

        foreach ($users as $key => $value) {



            foreach($value['user_links'] as $key_u =>$a){
                if($a['type'] == 'clearent'){
                    $clearent = ClearentMerchant::find($a['link_id']);
                    $users[$key]['clearent'] = $clearent;
                }
                if($a['type'] == 'paysafe'){
                    $paysafe = PaysafeAccount::find($a['link_id']);
                    $users[$key]['paysafe'] = $paysafe;
                }
                if($a['type'] == 'gift'){
                    // $gift = MerchantGiftCardAccount::find($a['link_id']);
                    $gift = $this->getGiftCardAccount($a['link_id'], true);
                    $users[$key]['gift'] = $gift;
                }

            }
        }

        return response()->json([
            'success'=> true,
            'data' => $users,
        ]);
    }


    public function getPasswordAge(Request $request){

        $id= $request->id;
        $passAge =HistoricalPasswordCount:: where('user_id',$id)->orderBy('id','desc')->limit(1)->get();

        $a = "";
        $user_id ="";
        $mandatory ="";
        foreach($passAge as $key => $pass) {
           $a = $pass['created_at'];
           $user_id = $pass['user_id'];
           $mandatory = $pass['mandatory'];
        }
        return response()->json([
            'success'=> true,
            'data' =>  $a ,
            'user_id'=>$user_id,
            'mandatory'=>  $mandatory
        ]);

    }

    public function isMandatory(Request $request){

        $id= $request->user_id;
        $passAge =HistoricalPasswordCount:: where('user_id',$id)->orderBy('id','desc')->limit(1)->get();
        return response()->json([
            'success'=> true,
             'data' =>  $passAge

        ]);

    }

    public function updateMandatory(Request $request){

        $id= $request->user_id;
        $passAge =HistoricalPasswordCount:: where('user_id',$id)->orderBy('id','desc')->limit(1)->get();
        foreach($passAge as $key => $pass) {
            $pass['mandatory'] = 'Yes';
            $pass->save();
        }
        return response()->json([
            'success'=> true,
        ]);

    }

    public function changeEmail(Request $request){

        $name = "";

        $_data = User::find($request->id);
        $_data->email = $request->email;
        $name = $_data->name;
        $_data->status ="Unverified";
        $_data->save();


        $token = $_data->createToken('promisenetwork')->accessToken;


        $to_name = $name;
        $to_email = $request->email;
        $id = $request->id;
        $from= "updateEmail";
        $data = array(  'name' => $request->name,
                        "email"=>$to_email,
                        'link'=> url("/verify/$token/$from")
                    );

        $mail_data = array(
            'to_name' => $to_name,
            'to_email' => $to_email,
            'subject' => 'Promise Network',
            'from_name' => env('MAIL_FROM_NAME').' Support',
            'from_email' => env('MAIL_FROM_ADDRESS'),
            'template' => 'admin.emails.email-confirmation',
            'body_data' => [
                'name' => $request->name,
                "email"=>$to_email,
                'link'=> url("/verify/$token/$from")
            ]
        );


        event(new \App\Events\SendMailEvent($mail_data));
        // Mail::send('admin.emails.email-confirmation',$data, function($message) use ($to_name, $to_email) {
        //     $message->to($to_email,$to_name)->subject('Promise Network');;
        //     $message->from('support@promise.network','Promise Network');
        // });



        return response()->json([
            'success'=> true
        ]);
    }

    public function user_list(Request $request){
        $role = $request->role;

        if($role) {
            $data = User::whereIn('role',$role)->with('user_fields')->get();
        } else {
            $data = User::with('user_fields')->get();
        }


        return response()->json([
            'success'=> true,
            'data'=>$data,
        ]);
    }

    private function saveImage($imageData) {
        $imageData = str_replace('data:image/jpeg;base64,', '', $imageData);
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        $imageData = base64_decode($imageData);
        $source = imagecreatefromstring($imageData);
        $rotate = imagerotate($source, 0, 0); // if want to rotate the image
        $imageName = 'assets/images/'.rand().'.png';
        $imageSave = imagejpeg($rotate,$imageName,100);
        imagedestroy($source);

        return $imageName;
    }

    public function CheckReporting(Request $request ){

        $user = auth()->user();
        if(auth()->user()->role == 'Merchant') {
            $paysafes = PaysafeAccount::get();
            $user_accounts_paysafe = UserAccountLink:: where('user_id',$user->id)->where('type','paysafe')->get();

            $arr = [];
            foreach($paysafes as $key => $paysafe){

                foreach($user_accounts_paysafe as $key => $user_account) {
                    if($paysafe['id']==$user_account['link_id']) {
                        array_push($arr, "paysafe");
                    }
                 }
            }


            $merchant_accounts = ClearentMerchant :: get();
            $user_accounts_clearent = UserAccountLink:: where('user_id',$user->id)->where('type','clearent')->get();
            foreach($merchant_accounts as $key => $merchant_account){
                foreach($user_accounts_clearent as $key => $user_account) {
                    if($merchant_account['merchantNumber']==$user_account['link_id']) {
                        array_push($arr,"clearent");
                    }
                 }
            }



            return response()->json([
                'success'=> true,
                'data' => $arr,
                ]);
        }


    }

    public function checkEemail(Request $request)
    {
        $data = User::where('email', $request->email)->first();

        if ($data) {
            return response()->json([
                'success' => true
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User with email ' . $request->email . ' not found'
            ], 400);
        }
    }

    public function updateEemail(Request $request)
    {
        // $credentials = [
        //     'email' => $request->email_old,
        //     'password' => $request->password
        // ];
        $hashed_password = Hash::make($request->password);
        // $data = User::where('email', $request->email_old)->get();
        $data = User::where('email', $request->email_old)->first();
        $password = $data->password ? $data->password : $data->pluck('password');

        if($data){
            // $data->email = $request->email;
            // $data = $data->save();
            // return response()->json([
            //     'success' => true,
            //     'data' => $data
            // ]);
            if(Hash::check($request->password, $data->pluck('password')[0])) {
                $data->email = $request->email;
                $data = $data->save();
                return response()->json([
                    'success' => true
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'password is wrong',
                    // 'email_old' => $request->email_old,
                    // 'password_old' =>  $password,
                    'email' => $request->email,
                ], 400);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User with is not found',
                'email_old' => $request->email_old,
                'email' => $request->email,
            ], 400);
        }
    }

    public function profileEmailChage(Request $request)
    {
        $data = User::where('email', $request->password)->first();

        if($data) {
            return response()->json([
                'success' => false,
                'message' => 'Email is already in used',
            ]);
        } else {
            $email = User::where('id', $request->id)->first();
            $email->email = $request->confirm;
            $email = $email->save();

            return response()->json([
                'success' => true,
                'data' => $email
            ]);
        }
    }

    public function profileUpdate(Request $request)
    {
        $update_query = User::find($request->id);
        $image_url = '';
        if ($request->file('image_url')) {
            $userImageFile = $request->file('image_url');
            $userImageFileName = $userImageFile->getClientOriginalName();
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('profiles', $userImageFilePath, 'public');
            $userImageFileSize = $this->formatSizeUnits($userImageFile->getSize());

            $update_query->upload = $userImageFilePath;
            $image_url = $userImageFilePath;
        }

        $update_query->phone_number =  $request['phone_number'];
        $update_query->address =  $request['address'];
        $update_query->email =  $request['email'];
        $update_query->preferred_email =  $request['preferred_email'];
        $update_query->name=  $request['name'];
        $update_query->save();

        $user = User::find($request->id);
        return response()->json([
            'success' => true,
            'user'=> $user,
        ]);
    }

    public function updateReceivedTicketAlert(Request $request)
    {
        $data = User::find($request->user_id);

        if ($data) {
            $data->receive_alerts = $request->receive_alerts;
            $data->save();
        }
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    public function getReceivedTicketAlert(Request $request)
    {
        $data = User::where('id', $request->user_id)->get();

        return response()->json([
            'success' => true,
            'user' => $data
        ]);
    }

}
