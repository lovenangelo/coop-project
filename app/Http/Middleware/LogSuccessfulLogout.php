<?php

namespace App\Http\Middleware;

use App\Models\AuthenticationLogs;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogSuccessfulLogout
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    if (auth()->check()) {
      $user = auth()->user();
      AuthenticationLogs::create([
        'name' => $user->name,
        'email' => $user->email,
        'activity' => 'log out',
      ]);
    }

    return $next($request);
  }
}
