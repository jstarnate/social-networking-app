<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    
    /**
     * Show a specific user's profile.
     *
     * @param  string  $username
     * @return \Illuminate\View\View
     */
    public function show(string $username)
    {
        if (!User::where('username', $username)->exists()) {
            abort(404);
        }

        return view('home');
    }
    
}
