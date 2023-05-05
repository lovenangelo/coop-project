<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Member extends Model
{
  use HasFactory;

  protected $fillable = [
    'cid',
    'name',
    'birthDate',
    'occupation',
    'dob',
    'age',
    'gender',
    'civilStatus',
    'address',
    'contact',
    'tin',
    'registration_date',
  ];

  public static function validate(Request $request): array
  {
    return $request->validate([
      'cid' => ['integer', 'required'],
      'name' => ['string', 'max:50', 'unique:members'],
      'dob' => ['date', 'before:today'],
      'occupation' => ['string', 'max:50'],
      'age' => ['integer', 'min:18', 'max:100'],
      'gender' => ['string', 'in:Male,Female,Other'],
      'civil_status' => ['string', 'in:Single,Married,Divorced,Widowed'],
      'barangay' => ['string', 'max:50'],
      'city' => ['string', 'max:50'],
      'province' => ['string', 'max:50'],
      'contact' => ['numeric', 'digits:10'],
      'tin' => ['numeric', 'digits_between:9,12'],
      'registration_date' => ['date'],
    ]);
  }
}
