<?php

use Illuminate\Database\Seeder;
use App\User;
use App\HistoricalPasswordCount;
use App\PortfolioSnapshot;
class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create(
            [
                'name' => 'Admin',
                'email' => 'admin@test.com',
                'role' => 'Super Admin',
                'status' => 'Active',
                'password' => bcrypt('admin123')
            ] 
        );

        HistoricalPasswordCount:: create(
            [
                'user_id' => 1,   
                'password' => bcrypt('admin123') ,
                'mandatory' => 'Yes' 
            ] 
        );


        PortfolioSnapshot::create(
            [
                'avgMonthly' => '',
            ]
        );


    }
}
