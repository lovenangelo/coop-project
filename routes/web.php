<?php

use App\Http\Controllers\AuthenticationLogsController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use App\Http\Middleware\UserIsAdmin;
use App\Models\Member;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
  ]);
});

Route::get('assets/{path}', function ($path) {
  return response()->file(public_path("assets/$path"));
});

Route::get('/dashboard', function () {
  // send data for analytics
  // analytics for added members per month
  // analytics for number of users per city

  return Inertia::render('Dashboard', [
    'data' => Member::all()
  ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('/members', MembersController::class)
  ->only(['index', 'store', 'update', 'destroy'])
  ->middleware(['auth',]);

Route::resource('/members', MembersController::class)
  ->only(['destroy'])
  ->middleware(['auth', UserIsAdmin::class]);

Route::get('/members/filter', [MembersController::class, 'filter'])->middleware(['auth']);

Route::resource('/logs', AuthenticationLogsController::class)
  ->only(['index'])
  ->middleware(['auth', UserIsAdmin::class]);

Route::get('/logs/filter', [AuthenticationLogsController::class, 'filter'])->middleware(['auth', UserIsAdmin::class]);


Route::resource('/users', UsersController::class)->only(['index', 'update', 'destroy'])
  ->middleware(['auth', UserIsAdmin::class]);

Route::get('/users/filter', [UsersController::class, 'filter'])->middleware(['auth', UserIsAdmin::class]);


Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
