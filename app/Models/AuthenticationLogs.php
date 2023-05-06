<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthenticationLogs extends Model
{
  use HasFactory;

  protected $fillable = [
    'name', 'email', 'activity'
  ];
}
