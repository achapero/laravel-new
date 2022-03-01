<?php

namespace App\Observers;

use App\Notification;
use App\Ticket;
use App\User;
use App\UserAccountLink;
use App\UserExtensionField;
class TicketObserver
{

    public function creating(Ticket $ticket) {
        $ticket->status_change_updated_at = date('Y-m-d H:i:s');
    }
    public function created(Ticket $ticket)
    {
        
        $email = User::where('id', $ticket->submitted_by)->get()->pluck('email');

        $notif = new Notification;
        $notif->link_id = $ticket->id;
        $notif->email = $email[0];
        $notif->title = "".$ticket->ticket_subject." [## ".$ticket->id." ##]";
        $notif->content = "submitted a ticket";
        $notif->url = "/tickets/ticket/".$ticket->id."";
        $notif->type = "Ticket";
        $notif->role = "Not Merchant";
        $notif->save();

        $receive_alerts = User::where('receive_alerts', '1')->get();
        $merchant_name = UserExtensionField::where('user_id', $ticket->submitted_by)->get()->pluck('merchant_name');
        $merchant_name = $merchant_name->first();
        if($receive_alerts){
            foreach ($receive_alerts as $key => $alert) {
                if($alert['receive_alerts'] == 1) {
                    $data = array(
                        'to_name' => $alert['name'],
                        'to_email' => $alert['email'],
                        'subject' => 'New Ticket',
                        'from_name' => env('MAIL_FROM_NAME').' Support',
                        'from_email' => env('MAIL_FROM_ADDRESS'),
                        'template' => 'admin.emails.email-tickets',
                        'body_data' => [
                            'name' => $alert['name'],
                            "email"=> $alert['email'],
                            'link'=> '',
                            'ticket_full_name'=> $merchant_name,
                            'ticket_subject'=> $ticket->ticket_subject,
                            'description'=> strlen($ticket->ticket_description) >= 200 ? substr($ticket->ticket_description,0,200).'...' : $ticket->ticket_description,
                        ]
                    );
                    event(new \App\Events\SendMailEvent($data));
                }
            }
        }

    }

    public function updated(Ticket $ticket)
    
    {

      

        if($ticket->ticket_status == "Awaiting Customer Reply"){
            $email = User::where('id',$ticket->submitted_by)->get()->pluck('email');
            $name = User::where('id',$ticket->submitted_by)->get()->pluck('name');
            $notif = new Notification;
            $notif->link_id = $ticket->id;
            $notif->email = $email[0];
            $notif->title = $ticket->ticket_subject;
            $notif->content = "replied to a ticket";
            $notif->url = "/tickets/ticket/".$ticket->id."";
            $notif->type = "Ticket";
            $notif->role = "Merchant";
            if(!$ticket->isDirty('assigned_to')){
                $notif->save();
            }
        }

        if($ticket->ticket_status == "Awaiting Support Reply"){
            $email = User::where('id', $ticket->submitted_by)->get()->pluck('email');
            $notif = new Notification;
            $notif->link_id = $ticket->id ? $ticket->id: 0;
            $notif->email = $email[0];
            $notif->title = $ticket->ticket_subject;
            $notif->content = "replied to a ticket";
            $notif->url = "/tickets/ticket/".$ticket->id."";
            $notif->type = "Ticket";
            $notif->role = "Manager";
            if(!$ticket->isDirty('assigned_to')){
                $notif->save();
            }
         
        }

        if($ticket->isDirty('assigned_to')){
     
            $email =  User::where('id',$ticket->assigned_to)->get()->pluck('email');

            $checkdouble = Notification::where('role','Merchant Ticket')->where("link_id",$ticket->id)->get();
            foreach($checkdouble as $key =>$check){
                if($check['email'] != $email[0]){
                    $check->delete();
                }
            }

            $notif = new Notification;
            $notif->link_id = $ticket->id ? $ticket->id: 0;
            $notif->email = $email[0];
            $notif->title = $ticket->ticket_subject;
            $notif->content = "You assigned by this ticket";
            $notif->url = "/tickets/ticket/".$ticket->id."";
            $notif->type = "Ticket";
            $notif->role = "Merchant Ticket";
            $notif->save();
          }
      

    }





}
