<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $users = User::paginate(20);

    return Inertia::render('Users/Index', [
      'users' => $users,
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(string $id)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $id)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    //
  }

  public function filter(Request $request)
  {
    $query = User::query();

    $values = $request->all();

    if (array_key_exists('created_at', $values)) {
      $values['created_at'] = date('Y-m-d', strtotime($values['created_at'] . ' +1 day'));
    }

    // Apply filters
    foreach ($values as $field => $value) {
      if ($field == 'created_at') {
        $query->whereDate($field, '=', $value);
      } else {
        $query->where($field, 'like', "%$value%");
      }
    }

    $users = $query->paginate(20);

    if ($users) {
      return Inertia::render('Users/Index', [
        'users' => $users,
      ]);
    } else {
      return to_route('users.index');
    }
  }
}
