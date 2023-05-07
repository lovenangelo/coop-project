<?php

use App\Http\Controllers\AuthenticationLogsController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use App\Http\Middleware\UserIsAdmin;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
  if (auth()->check()) {
    return to_route('dashboard');
  }
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
  ]);
});

Route::get('assets/{path}', function ($path) {
  return response()->file(public_path("assets/$path"));
});

Route::get('/dashboard', function () {
  $occurrences = Member::selectRaw('YEAR(registration_date) as year, count(*) as count')
    ->groupBy('year')
    ->get();

  $currentDate = new DateTime();

  clock($currentDate);
  return Inertia::render('Dashboard', [
    'occurrences' => $occurrences,
    'selected' => 'yearly',
    'full' => $currentDate
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

Route::middleware('auth')->get('/members-added-reports', function (Request $request) {

  $occurrences = [];

  $selected = '';

  $allMonths = [];
  for ($i = 1; $i <= 12; $i++) {
    $month = str_pad($i, 2, '0', STR_PAD_LEFT); // Add leading zero if needed
    $allMonths[] = date('M', strtotime($request->input('year') . '-' . $month . '-01'));
  }

  if ($request->input('type') == 'monthly') {
    $occurrences = DB::table('members')
      ->select(DB::raw('COUNT(*) as count'), DB::raw('MONTH(registration_date) as month'))
      ->whereYear('registration_date', $request->input('year'))
      ->groupBy(DB::raw('MONTH(registration_date)'))
      ->orderBy(DB::raw('MONTH(registration_date)'))
      ->get();

    $partial = [];
    foreach ($allMonths as $month) {
      $found = false;
      $index = array_search($month, $allMonths);
      foreach ($occurrences as $occurrence) {
        if ($occurrence->month == $index) {
          $partial[$index] = (object) ['month' => $month, 'count' => $occurrence->count];
          $found = true;
          break;
        }
      }
      if (!$found) {
        $partial[$index] = (object) ['month' => $month, 'count' => 0];
      }
    }
    $occurrences = $partial;
    $selected = 'monthly';
  }

  // if ($request->input('type') == 'daily') {

  //   $selected = 'daily';
  // }

  if ($request->input('type') == 'specific-date') {
    clock('here sd');
    $query = Member::whereDate('registration_date', '=', date('Y-m-d', strtotime($request->input('full') . ' +1 day')));
    $occurrences = [
      [
        'count' => $query->count(),
        'date' => date('Y-m-d', strtotime($request->input('full') . ' +1 day'))
      ]
    ];
    clock($occurrences, date('Y-m-d', strtotime($request->input('full') . ' +1 day')));
    $selected = 'specific-date';
  }

  clock($request->input('full'));
  return Inertia::render('Dashboard', [
    'occurrences' => $occurrences,
    'selected' => $selected,
    'full' => ['date' => $request->input('full')]
  ]);
});

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
