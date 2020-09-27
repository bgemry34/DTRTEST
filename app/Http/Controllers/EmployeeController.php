<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Employee;
use App\Http\Resources\Employee as EmployeeResource;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\LogsImport;

class EmployeeController extends Controller
{
    //
    public function index() {
       $employee = EmployeeResource::collection(Employee::orderBy('id', 'DESC')->get());
       return $employee;
    }

    public function store(Request $request){
        $employee = $request->isMethod('put') ? Employee::find($request->id) :  new Employee;

        $this->validate($request, [
            'name'=>'required',
            'date'=>'required|date_format:Y-m-d',
            'time'=>'required|date_format:H:i'
        ]);

        $employee->id = $request->input('id');
        $employee->name =  $request->input('name');
        $employee->date = $request->input('date');
        $employee->time = $request->input('time');

        if($employee->save())
        return new EmployeeResource($employee);
    }

    public function destroy(Request $request){
        $this->validate($request, [
            'id' => 'required',
        ]);

        $employee = Employee::find($request->input('id'));
        if($employee->delete())
        return  new EmployeeResource($employee);
    }

    public function importRecords(Request $request)
    {
        if($request->file('imported_file')) {
            $log = new LogsImport();
            $ex = Excel::import($log, request()->file('imported_file'));
            return $log->log();
        }
    }
}
