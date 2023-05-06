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
    date_default_timezone_set('Asia/Manila');

    User::validate_update($request);

    $values = $request->all();

    $user = User::find($id);

    $user->update($values);

    if ($user->isDirty()) {
      $user->save();
    }

    // always redirect back to the index page
    return to_route('users.index')->with('message', 'user information updated successfully ✔️');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    $user = User::find($id);

    if (!$user) {
      return response()->json(['message' => 'User not found'], 404);
    }

    $user->delete();

    return to_route('users.index')->with('message', 'User deleted successfully ✔️');
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
        $query->whereDate($field, $value);
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
