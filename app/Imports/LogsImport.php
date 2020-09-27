<?php

namespace App\Imports;

use App\Employee;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use App\Http\Resources\Employee as EmployeeResource;

class LogsImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    private $container = [];
    private $failed = 0;

    public function model(array $row)
    {
        if($row["employee_name"] !== null && $row['date'] !==null && $row['time']!==null){
            $employee = new Employee;
            $employee->name = $row["employee_name"];
            $employee->date = Date::excelToDateTimeObject($row['date'])->format('Y-m-d');
            $employee->time = Date::excelToDateTimeObject($row['time'])->format('H:m');

            if($employee->save()){
            array_push($this->container, $employee);
            return $employee;
            }
        }else{
            $this->failed++;
        }
    }

    public function log(){
        return  EmployeeResource::collection($this->container);
        // return $this->container;
    }

    public function successCount(){
        return count($this->container);
    }

    public function failedCount(){
        return $this->failed;
    }

}
