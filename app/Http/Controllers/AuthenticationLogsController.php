<?php

namespace App\Http\Controllers;

use App\Models\AuthenticationLogs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthenticationLogsController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $logs = AuthenticationLogs::orderByDesc('created_at')->paginate(20);

    return Inertia::render('Logs/Index', [
      'logs' => $logs,
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
  public function show(AuthenticationLogs $authenticationLogs)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(AuthenticationLogs $authenticationLogs)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, AuthenticationLogs $authenticationLogs)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(AuthenticationLogs $authenticationLogs)
  {
    //
  }

  public function filter(Request $request)
  {
    $query = AuthenticationLogs::query();

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

    $logs = $query->orderByDesc('created_at')->paginate(20);

    if ($logs) {
      return Inertia::render('Logs/Index', [
        'logs' => $logs,
      ]);
    } else {
      return to_route('logs.index');
    }
  }
}
