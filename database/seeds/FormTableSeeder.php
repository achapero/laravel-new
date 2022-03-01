<?php

use Illuminate\Database\Seeder;
use App\Form;
class FormTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Form::create([
            "form_name" => "Point of Success",
            "form_shortname" => "pointofsuccess",
            "form_title" => "Thank you for being part of the Point of Success Family!",
            "form_description" => 'Please make sure you have 2 Month\'s worth of processing statement readily available to upload.  Consecutive Months are required and your request will not be processed if you fail to provide these to us.  (Exceptions are made for NEW Business Accounts.) 
                
For Merchants that are requesting to sign up for POSPay Processing, you will also need to submit a Voided Business Check so that we can verify the account details. 
                
After submitting this form, a Customer Success Representative will contact you shortly with your Personalized Rate Quote or to complete your Merchant Processing Application. ',
            "form_pages" => "3",
            "submit_header" => "Please Submit Your Application then submit your processing statements",
            "submit_message" => 'Please click on "Submit" below for the final step of submitting your processing statements. Providing us with Statements allows us to give you an accurate Quote.  Please make sure to complete this final step.  
                
If you are signing up for POSPay Processing, a copy of your voided Business Check is also required.
                
You will be directed to a secure upload site, and be given the email address where you can send them. ',
            "redirect_to" => "thankyou"
        ]);
 

        // \DB::statement("INSERT INTO `form_inputs`(`id`, `form_id`, `inputs`) VALUES (1, 1, '')");
      
    }
}
