<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   
        $firstName = [
            "Rozanne",
            "Naoma",
            "Harold",
            "Elane",
            "Esta"
        ];

        $lastName = [
            "Jerrold",
            "Macatangay",
            "Ramos",
            "Penson",
            "Robles",
            "Agguire",
            "Antonio"
        ];

        //
       for($x=0; $x<10; $x++){
        DB::table('employees')->insert([
            'name' => $firstName[rand(0, count($firstName)-1)].' '.$lastName[rand(0, count($lastName)-1)],
            'date' => date('Y-m-d', rand(1577836800,1609286400)),
            'time' => rand(0,24) .':'. rand(0,59)
        ]);
       }
    }
}
