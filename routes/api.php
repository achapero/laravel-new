<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\User;
use App\UserAccountLink;
use App\Form;
use App\FormData;
use App\FormInput;
use App\Ticket;
use App\TicketResponse;
use App\PortfolioSnapshot;
use App\PaysafeBatchDetail;

use App\MerchantGiftCardAccountController;
use App\MerchantGuide;
use App\WebHook;
use App\DeviceMgmtController;
use App\Notification;
use Illuminate\Support\Facades\Mail;
use Ddeboer\Imap\Server;
use Ixudra\Curl\Facades\Curl;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\UserExtensionField;

use JoliCode\Slack\ClientFactory;
use JoliCode\Slack\Exception\SlackErrorResponse;



use App\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'api'], function () {

    // GIFT CARD TERMINAL API
    Route::post('info/checkbalance','Swagger\InfoCheckBalanceController@infoCheckBalance');
    Route::post('pos/checkbalance','Swagger\POSController@checkBalance');
    Route::post('pos/activate','Swagger\POSController@activate');
    Route::post('pos/addvalue','Swagger\POSController@addvalue');
    Route::post('pos/redeem','Swagger\POSController@redeem');
    Route::post('pos/void','Swagger\POSController@void');
    Route::post('pos/return','Swagger\POSController@return');
    Route::post('pos/transactionhistory','Swagger\POSController@transactionHistory');
    Route::post('provision/procure','Swagger\ProvisionController@procure');
    Route::post('provision/resendsms','Swagger\ProvisionController@resendSMS');
    Route::post('provision/addvalue','Swagger\ProvisionController@addValue');
    Route::post('System/Version','Swagger\SystemController@version');
    Route::post('system/ValidateHardwareID','Swagger\SystemController@validateHardwareId');

    Route::post('POS/CheckBalance','Swagger\POSController@checkBalance');
    Route::post('POS/Activate','Swagger\POSController@activate');
    Route::post('POS/AddValue','Swagger\POSController@addvalue');
    Route::post('POS/Redeem','Swagger\POSController@redeem');
    Route::post('POS/Void','Swagger\POSController@void');
    Route::post('POS/Return','Swagger\POSController@return');
    Route::post('POS/TransactionHistory','Swagger\POSController@transactionHistory');
    Route::post('Provision/Procure','Swagger\ProvisionController@procure');
    Route::post('Provision/ResendSms','Swagger\ProvisionController@resendSMS');
    Route::post('Provision/AddValue','Swagger\ProvisionController@addValue');

});
Route::group(['prefix' => 'api/v1'], function () {
    Route::group(['middleware' => 'auth:api'],function() {

        Route::get('users/filtered_new','API\v1\UserController@filtered_new');
        Route::get('users/profiles','API\v1\UserController@profiles');
        Route::apiResource('notification','API\v1\NotificationController');
        Route::apiResource('users','API\v1\UserController');
        Route::post('users/profileUpdate','API\v1\UserController@profileUpdate');

        Route::post('users/check_email','API\v1\UserController@checkEemail');
        Route::post('update_email','API\v1\UserController@updateEemail');
        Route::post('profile_update_email','API\v1\UserController@profileEmailChage');


        Route::post('users/getMids','API\v1\UserController@getMids');
        Route::post('users/updateReceivedTicketAlert','API\v1\UserController@updateReceivedTicketAlert');
        Route::get('users_getReceivedTicketAlert','API\v1\UserController@getReceivedTicketAlert');


        Route::put('users/{id}/updatePassword','API\v1\UserController@updatePass');
        Route::put('users/{id}/updatePasswordFromProfile','API\v1\UserController@updatePasswordFromProfile');
        Route::post('users/changeEmail','API\v1\UserController@changeEmail');
        Route::post('getPasswordAge','API\v1\UserController@getPasswordAge');
        Route::post('getPasswordAge/updateMandatory','API\v1\UserController@updateMandatory');
        Route::post('getPasswordAge/isMandatory','API\v1\UserController@isMandatory');


        Route::post('users/filtered','API\v1\UserController@filtered');
        Route::post('users/userList','API\v1\UserController@user_list');

    });

    Route::post('login', 'API\v1\AuthController@login');
    Route::post('logout', 'API\v1\AuthController@logout');
    Route::post('register', 'API\v1\AuthController@register');
    Route::post('registrationVerify', 'API\v1\AuthController@registrationVerify');
    Route::post('verify', 'API\v1\AuthController@verify');
    Route::apiResource('forgotpassword', 'API\v1\ForgotPasswordController');

});

