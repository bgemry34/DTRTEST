<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix'=>'employees'
], function($router){
    Route::GET('/', 'EmployeeController@index');
    Route::POST('/create', 'EmployeeController@store');
    Route::PUT('/update', 'EmployeeController@store');
    Route::DELETE('/destroy', 'EmployeeController@destroy');
    Route::POST('/import', 'EmployeeController@importRecords');
    
});

Route::GET('employees/template', function(){
    $file = public_path()."/files/template.xlsx";
    $headers = array('Content-Type: application/xlsx',);
    return Response::download($file, 'template.xlsx',$headers);
});
