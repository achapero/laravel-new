<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use ScoutElastic\Searchable;
// use Shetabit\Visitor\Traits\Visitor;
// /asdasd
// use Shetabit\Visitor\Traits\Visitable;


class User extends Authenticatable
{
    // use HasApiTokens, Notifiable;

    use HasApiTokens, Notifiable, Searchable;
    protected $indexConfigurator = \App\Scout\UserIndexConfigurator::class;
    protected $searchRules = [
        \App\Scout\Rules\UsersSearchRule::class
    ];

    // Here you can specify a mapping for model fields
    protected $mapping = [
        'properties' => [
            'link_id' => [
                'type' => 'text',
                'fields' => [
                    'raw' => [
                        'type' => 'keyword',
                    ]
                ]
            ],
            'email' => [
                'type' => 'text',
                "search_analyzer" => "my_email_analyzer",
                'analyzer' => 'my_email_analyzer',
                'fields' => [

                    'email' => [
                        'type' => 'text',
                        'analyzer' => 'my_email_analyzer',
                    ]
                ],
            ],
            'phone_number' => [
                'type' => 'text',
                'fields' => [
                    'raw' => [
                        'type' => 'keyword',
                    ]
                ]
            ],
        ]
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','role','status','paysafe_id','auth_id','clearent_id','init_login','init_login_date', 'upload', 'receive_alerts','address'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'init_login' => 'boolean',
        'online_status' => 'boolean',
        'receive_alerts' => 'boolean',
    ];

    // public function formdataresponse() {
    //     return $this->hasMany('App\FormDataResponse','created_by');
    // }
    // public function ticket_responses() {
    //     return $this->hasMany('App\TicketResponse','created_by');
    // }
    // // public function ticket_assign_notifs() {
    // //     return $this->hasMany('App\TicketAssignNotifs','user_id');
    // // }
    // public function paysafe_account() {
    //     return $this->hasMany('App\PaysafeAccount','user_id');
    // }
    // public function merchant_files() {
    //     return $this->hasMany('App\MerchantFiles','user_id');
    // }
    // public function user_links() {
    //     return $this->hasMany('App\UserAccountLink','user_id');
    // }
    // public function user_fields() {
    //     return $this->hasOne('App\UserExtensionField','user_id');
    // }
    // public function user_recent_activities() {
    //     return $this->hasMany('App\UserRecentActivity','user_id');
    // }
    // public function authnet_merchant() {
    //     return $this->hasOne('App\AuthNetMerchant','user_id');
    // }
    // public function user_profile() {
    //     return $this->hasMany('App\UserProfile','user_id');
    // }
    // public function parent_profile() {
    //     return $this->hasMany('App\UserProfile','profile_id');
    // }
    // public function user_additional_owner() {
    //     return $this->hasMany('App\UserAdditionalOwner', 'user_id');
    // }
    // public function ticket_note() {
    //     return $this->belongsTo('App\TicketNote', 'user_id');
    // }
}
