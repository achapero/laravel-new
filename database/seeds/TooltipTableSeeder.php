<?php

use Illuminate\Database\Seeder;

class TooltipTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD1 > I:nth-child(1)', 'Information', 'Based on 6 month average of portfolio volume.', 'Right')");
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD2 > I:nth-child(1)', 'Information', 'Based on previous month\'s portfolio volume.', 'Bottom')");
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD3 > I:nth-child(1)', 'Information', 'Approved MIDs from privious month.', 'Bottom')");
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD4 > I:nth-child(1)', 'Information', 'Based on \'Monthly Volume\' metric gathered from MPA.', 'Bottom')");
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD5 > I:nth-child(1)', 'Information', 'Based on Closed MIDs from previous month.', 'Bottom')");
        \DB::statement("INSERT INTO `tooltips`(`selector`, `tooltip_type`, `tooltip`, `position`) VALUES ('#ttTD6 > I:nth-child(1)', 'Information', 'Based on \'Monthly Volume\' metric gathered from MPA of the closed MIDs from previous month.', 'Left')");
    }
}
