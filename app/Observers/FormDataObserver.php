<?php

namespace App\Observers;

use App\Notification;
use App\FormData;
use App\User;
use App\Form;
class FormDataObserver
{
   
    public function created(FormData $form_data )
    {          
        
        if($form_data){
            $content = Form:: where('id',$form_data->form_id)->get()->pluck('form_name');
            $inputs = FormData:: where('email',$form_data->email)->orderBy('id','desc')->limit(1)->get()->pluck('inputs');
            
            if($inputs[0]){
                $notif = new Notification;
                $notif->link_id = $form_data->id;
                $notif->email =$form_data->email;
                $notif->title = $content[0];
                $notif->content =  $content[0];
                $notif->url = "/forms/submitted/".$form_data->id."";
                $notif->type = "Form";
                $notif->role = "Not Merchant";
                $notif->save(); 
            
            }
               

          
        }
          
    }

 

}