<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    UserController,
    PostController,
    CommentController
};

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

Route::middleware('guest')->group(function() {
    Route::view('/index', 'index')->name('index');
    Route::view('/register', 'register')->name('register');
    
    Route::post('/sign-in', [AuthController::class, 'login'])->name('signin');
    Route::post('/sign-up', [AuthController::class, 'register'])->name('signup');
    
    Route::get('/verify/{token}', [AuthController::class, 'verify'])->name('verify');
    
    Route::view('/forgot-password', 'forgot')->name('forgot-password');
    Route::post('/forgot-password/send', [AuthController::class, 'sendPasswordResetNotification']);
    
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])->name('reset-password.show');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
});


Route::middleware('auth')->group(function() {
    Route::view('/home', 'home')->name('home');

    Route::get('/u/{username}', [UserController::class, 'show'])->name('profile');
    Route::get('/u/{username}/likes', [UserController::class, 'show']);
    Route::get('/u/{username}/comments', [UserController::class, 'show']);
    Route::get('/u/{username}/bookmarks', [UserController::class, 'show']);
    
    Route::view('/notifications', 'home');
    Route::view('/users', 'home');
    Route::view('/posts/{post}/comments', 'home');
});


// ===============================================
//  API routes
// ===============================================
Route::middleware('auth')->group(function() {
    Route::post('/users', [UserController::class, 'fetchUsers']);
    Route::get('/users/u/{username}', [UserController::class, 'getUser']);
    Route::get('/users/u/{username}/{name}', [UserController::class, 'getConnectedPosts']);
    Route::get('/users/suggested', [UserController::class, 'getSuggestedUsers']);
    Route::post('/users/follow', [UserController::class, 'follow']);
    Route::post('/users/unfollow', [UserController::class, 'unfollow']);

    Route::post('/posts/fetch', [PostController::class, 'fetch']);
    Route::post('/posts/friends', [PostController::class, 'get']);
    Route::post('/posts/create', [PostController::class, 'store']);
    Route::delete('/posts/delete/{post}', [PostController::class, 'destroy']);
    Route::post('/posts/like', [PostController::class, 'like']);
    Route::post('/posts/dislike', [PostController::class, 'dislike']);
    Route::post('/posts/bookmark', [PostController::class, 'bookmark']);
    Route::post('/posts/unbookmark', [PostController::class, 'unbookmark']);

    Route::post('/comments/get', [CommentController::class, 'get']);

    // Route::post('/foo', function() {
    //     auth()->logout();
    //     return response()->json(['message' => 'success']);
    // });
});
