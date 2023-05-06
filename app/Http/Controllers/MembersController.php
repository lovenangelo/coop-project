<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembersController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $members = Member::paginate(20);

    $all = Member::all();

    return Inertia::render('Members/Index', [
      'members' => $members,
      'all' => $all
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = Member::validate_store($request);

    clock($validated);

    Member::create(
      [
        'cid' => $validated['cid'],
        'name' => $validated['name'],
        'dob' => date('Y-m-d', strtotime($validated['dob'])),
        'occupation' => $validated['occupation'],
        'age' => $validated['age'],
        'gender' => $validated['gender'],
        'civil_status' => $validated['civil_status'],
        'barangay' => $validated['barangay'],
        'city' => $validated['city'],
        'province' => $validated['province'],
        'contact' => $validated['contact'],
        'tin' => $validated['tin'],
        'registration_date' => date('Y-m-d', strtotime($validated['registration_date'])),
        'address' => $validated['barangay'] . ', ' . $validated['city'] . ', ' . $validated['province']
      ]
    );

    return to_route('members.index')->with('message', 'Member added successfully ✔️');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $id)
  {
    date_default_timezone_set('Asia/Manila');

    Member::validate_update($request);

    $values = $request->all();

    $member = Member::find($id);

    if (array_key_exists('dob', $values)) {
      clock($values['dob']);
      $values['dob'] = date('Y-m-d', strtotime($values['dob']));
    }

    if (array_key_exists('registration_date', $values)) {
      clock($values['registration_date']);
      $values['registration_date'] = date('Y-m-d', strtotime($values['registration_date']));
    }

    $member->update($values);

    if ($member->isDirty()) {
      $member->save();
    }

    // always redirect back to the index page
    return to_route('members.index')->with('message', 'Member updated successfully ✔️');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    $member = Member::find($id);

    if (!$member) {
      return response()->json(['message' => 'Member not found'], 404);
    }

    $member->delete();

    return to_route('members.index')->with('message', 'Member deleted successfully ✔️');
  }

  public function filter(Request $request)
  {
    $query = Member::query();

    $values = $request->all();

    if (array_key_exists('dob', $values)) {
      $values['dob'] = date('Y-m-d', strtotime($values['dob'] . ' +1 day'));
    }

    if (array_key_exists('registration_date', $values)) {
      $values['registration_date'] = date('Y-m-d', strtotime($values['registration_date'] . ' +1 day'));
    }

    // Apply filters
    foreach ($values as $field => $value) {
      if ($field == 'province' || $field == 'city' || $field == 'barangay') {
        $query->where('address', 'like', "%$value%");
      } else if ($field == 'dob' || $field == 'registration_date') {
        clock($field);
        clock($value);
        $query->whereDate($field, '=', $value);
      } else {
        $query->where($field, 'like', "%$value%");
      }
    }

    $members = $query->paginate(20);
    $all = $query->get();

    if ($members) {
      return Inertia::render('Members/Index', [
        'members' => $members,
        'all' => $all,
      ]);
    } else {
      return to_route('members.index');
    }
  }
}
