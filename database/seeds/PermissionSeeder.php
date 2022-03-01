<?php

use Illuminate\Database\Seeder;
use App\Form;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = \App\User::where('status', 'Active')->get();

        foreach ($users as $key => $value) {
            if($value->role == 'Super Admin' || $value->role == 'Admin' ) {
                // Marketplace
                    $create = \App\UserPermission::create([
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Marketplace',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Dashboard
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Dashboard',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Boarding
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'reserve_btn',
                        'status' =>  1,
                    ]);

                // Files
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  1,
                    ]);

                // Add New Form
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Add New Form',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Form List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);

                // Submitted List Forms
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);

                // Gift Cards
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_dashboard',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_terminal_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_report',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_data_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_account_setting',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_disabled_gift_card_btn',
                        'status' =>  1,
                    ]);
                // View Disabled Gift Card List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);

                // Gift Card Logs
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Card Logs',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // Guides
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_video_guide_btn',
                        'status' =>  1,
                    ]);
                // Clearent
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Paysafe
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Tickets
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'archived_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'assigned_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'update_status_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'delete_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'merge_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // PAN Request
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN Request',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // PAN List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);

                // Invite People
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Invite People',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // Profiles
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'permission_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_profile_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_account_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_asset_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_file_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_authnet_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_extra_user_btn',
                        'status' =>  1,
                    ]);
                // Assets Management
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                // Virtual Page
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Virtual Page',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // View As
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
            }
            if($value->role == 'Manager') {
                // Marketplace
                    $create = \App\UserPermission::create([
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Marketplace',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Dashboard
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Dashboard',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Boarding
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'reserve_btn',
                        'status' =>  0,
                    ]);

                // Files
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  1,
                    ]);

                // Add New Form
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Add New Form',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Form List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Submitted List Forms
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Gift Cards
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_dashboard',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_terminal_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_report',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_data_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_account_setting',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_disabled_gift_card_btn',
                        'status' =>  1,
                    ]);
                // View Disabled Gift Card List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);

                // Gift Card Logs
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Card Logs',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Guides
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_video_guide_btn',
                        'status' =>  1,
                    ]);
                // Clearent
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Paysafe
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Tickets
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'archived_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'assigned_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'update_status_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'delete_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'merge_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // PAN Request
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN Request',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // PAN List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Invite People
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Invite People',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Profiles
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'permission_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_profile_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_account_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_asset_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_file_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_authnet_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_extra_user_btn',
                        'status' =>  1,
                    ]);
                // Assets Management
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                // Virtual Page
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Virtual Page',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // View As
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
            }
            if($value->role == 'PAN Admin' ) {

                // Marketplace
                    $create = \App\UserPermission::create([
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Marketplace',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Dashboard
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Dashboard',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Boarding
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'reserve_btn',
                        'status' =>  1,
                    ]);

                // Files
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  1,
                    ]);

                // Add New Form
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Add New Form',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Form List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);

                // Submitted List Forms
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);

                // Gift Cards
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_dashboard',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_terminal_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_report',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_data_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_account_setting',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_disabled_gift_card_btn',
                        'status' =>  1,
                    ]);
                // View Disabled Gift Card List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);

                // Gift Card Logs
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Card Logs',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Guides
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_video_guide_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_video_guide_btn',
                        'status' =>  1,
                    ]);
                // Clearent
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Paysafe
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // Tickets
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'archived_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'assigned_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'update_status_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'delete_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'merge_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // PAN Request
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN Request',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // PAN List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Invite People
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Invite People',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // Profiles
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'permission_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_profile_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_account_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_asset_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_ticket_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_file_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_authnet_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_extra_user_btn',
                        'status' =>  0,
                    ]);
                // Assets Management
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                // Virtual Page
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Virtual Page',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // View As
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
            }
            if($value->role == 'Merchant: Tickets Only' ) {
                // Marketplace
                    $create = \App\UserPermission::create([
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Marketplace',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Dashboard
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Dashboard',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Boarding
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'reserve_btn',
                        'status' =>  0,
                    ]);

                // Files
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  0,
                    ]);

                // Add New Form
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Add New Form',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Form List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Submitted List Forms
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Gift Cards
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_dashboard',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_terminal_management',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_report',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_data_management',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_account_setting',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_disabled_gift_card_btn',
                        'status' =>  0,
                    ]);
                // View Disabled Gift Card List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);

                // Gift Card Logs
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Card Logs',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Guides
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_video_guide_btn',
                        'status' =>  0,
                    ]);
                // Clearent
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                // Paysafe
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                // Tickets
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'archived_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'assigned_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'update_status_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'delete_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'merge_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // PAN Request
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN Request',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // PAN List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Invite People
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Invite People',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Profiles
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'permission_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_profile_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_account_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_asset_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_ticket_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_file_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_authnet_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_extra_user_btn',
                        'status' =>  0,
                    ]);
                // Assets Management
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                // Virtual Page
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Virtual Page',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // View As
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
            }
            if($value->role == 'Gift Only' ) {
                // Marketplace
                    $create = \App\UserPermission::create([
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Marketplace',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);

                // Dashboard
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Dashboard',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Boarding
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'reserve_btn',
                        'status' =>  0,
                    ]);

                // Files
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  0,
                    ]);

                // Add New Form
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Add New Form',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);

                // Form List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Form List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Submitted List Forms
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Submitted List Forms',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Gift Cards
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_dashboard',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_terminal_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_report',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_data_management',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_account_setting',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_disabled_gift_card_btn',
                        'status' =>  1,
                    ]);
                // View Disabled Gift Card List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Disabled Gift Cards',
                        'permission_type' =>  'edit_btn',
                        'status' =>  1,
                    ]);

                // Gift Card Logs
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Card Logs',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // Guides
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'view_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'add_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'visible_admin_video_guide_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Guides',
                        'permission_type' =>  'edit_video_guide_btn',
                        'status' =>  0,
                    ]);
                // Clearent
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Clearent',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                // Paysafe
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Paysafe',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                // Tickets
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'archived_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'assigned_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'update_status_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'delete_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'merge_ticket_btn',
                        'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Tickets',
                        'permission_type' =>  'view_btn',
                        'status' =>  1,
                    ]);
                // PAN Request
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN Request',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                    ]);
                // PAN List
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'PAN List',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);

                // Invite People
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Invite People',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // Profiles
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'permission_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'upload_statement_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_profile_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_account_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_asset_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_ticket_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_file_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_authnet_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Profiles',
                        'permission_type' =>  'view_extra_user_btn',
                        'status' =>  0,
                    ]);
                // Assets Management
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'add_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'edit_btn',
                        'status' =>  0,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Assets Management',
                        'permission_type' =>  'delete_btn',
                        'status' =>  0,
                    ]);
                // Virtual Page
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Virtual Page',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
                // View As
                    $create = \App\UserPermission::create(
                    [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  0,
                    ]);
            }
            if($value->role == 'Merchant') {

                $create = \App\UserPermission::create([
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Marketplace',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);

                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Boarding',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Files',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);

                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Gift Cards',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Guides',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Clearent',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Paysafe',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Tickets',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'PAN Request',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);

                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Profile',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);

                $create = \App\UserPermission::create(
                [
                    'user_id' => $value->id,
                    'role' =>  $value->role,
                    'permission' =>  'Terminals',
                    'permission_type' =>  'view_page',
                    'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'View As',
                        'permission_type' =>  'view_page',
                        'status' =>  1,
                ]);

               //buttons

               $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Boarding',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Boarding',
                            'permission_type' =>  'view_btn',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Files',
                            'permission_type' =>  'add_btn',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Files',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'add_btn',
                        'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'delete_btn',
                        'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                 [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                            'permission_type' =>  'view_btn',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                            'permission_type' =>  'view_dashboard',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                        'user_id' => $value->id,
                        'role' =>  $value->role,
                        'permission' =>  'Gift Cards',
                        'permission_type' =>  'view_card_management',
                        'status' =>  1,
                 ]);
                 $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                            'permission_type' =>  'view_terminal_management',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                            'permission_type' =>  'view_reports',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                            'permission_type' =>  'view_data_management',
                            'status' =>  1,
                ]);
                $create = \App\UserPermission::create(
                [
                            'user_id' => $value->id,
                            'role' =>  $value->role,
                            'permission' =>  'Gift Cards',
                             'permission_type' =>  'view_account_settings',
                            'status' =>  1,
                ]);


                    $create = \App\UserPermission::create(
                    [
                                'user_id' => $value->id,
                                'role' =>  $value->role,
                                'permission' =>  'Disabled Gift Cards',
                                'permission_type' =>  'view_page',
                                'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                                'user_id' => $value->id,
                                'role' =>  $value->role,
                                'permission' =>  'Disabled Gift Cards',
                                'permission_type' =>  'edit_btn',
                                'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                    [
                                'user_id' => $value->id,
                                'role' =>  $value->role,
                                'permission' =>  'Tickets',
                                 'permission_type' =>  'add_btn',
                                'status' =>  1,
                    ]);
                    $create = \App\UserPermission::create(
                     [
                                'user_id' => $value->id,
                                'role' =>  $value->role,
                                'permission' =>  'Profile',
                                'permission_type' =>  'request_change_info',
                                'status' =>  1,
                    ]);



            }
        }


        // \DB::statement("INSERT INTO `form_inputs`(`id`, `form_id`, `inputs`) VALUES (1, 1, '')");

    }
}
