<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('members', function (Blueprint $table) {
      $table->id();
      $table->integer('cid')->unique();
      $table->string('name')->unique();
      $table->date('dob');
      $table->string('occupation');
      $table->integer('age');
      $table->enum('gender', ['Male', 'Female']);
      $table->enum('civil_status', ['Married', 'Single']);
      $table->string('address');
      $table->string('contact');
      $table->string('tin');
      $table->date('registration_date');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('members');
  }
};
