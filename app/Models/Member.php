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
    'civil_status',
    'address',
    'contact',
    'tin',
    'registration_date',
  ];

  public static function validate_store(Request $request): array
  {
    return $request->validate([
      'cid' => ['required', 'integer', 'required'],
      'name' => ['required', 'string', 'max:50', 'unique:members'],
      'dob' => ['required', 'date', 'before:today'],
      'occupation' => ['required', 'string', 'max:50'],
      'age' => ['required', 'integer', 'min:18', 'max:100'],
      'gender' => ['required', 'string', 'in:Male,Female,Other'],
      'civil_status' => ['required', 'string', 'in:Single,Married,Divorced,Widowed'],
      'barangay' => ['required', 'string', 'max:50'],
      'city' => ['required', 'string', 'max:50'],
      'province' => ['required', 'string', 'max:50'],
      'contact' => ['required', 'numeric', 'digits:10'],
      'tin' => ['required', 'numeric', 'digits_between:9,12'],
      'registration_date' => ['required', 'date'],
    ]);
  }

  public static function validate_update(Request $request): array
  {
    return $request->validate([
      'cid' => ['integer',],
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
