<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    UserController,
    PostController,
    CommentController,
    NotificationController,
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
    Route::view('/users/search', 'home');
});


// ===============================================
//  API routes
// ===============================================
Route::middleware('auth')->group(function() {
    Route::post('/users', [UserController::class, 'fetchUsers']);
    Route::get('/users/auth', [UserController::class, 'getAuthUser']);
    Route::get('/users/u/{username}', [UserController::class, 'getUser']);
    Route::get('/users/u/{username}/{name}', [UserController::class, 'getConnectedPosts']);
    Route::get('/users/suggested', [UserController::class, 'getSuggestedUsers']);
    Route::post('/users/follow', [UserController::class, 'follow']);
    Route::post('/users/unfollow', [UserController::class, 'unfollow']);
    Route::get('/api/users/search', [UserController::class, 'search']);
    Route::post('/api/users/search/results', [UserController::class, 'getSearchResults']);
    Route::post('/api/users/filter', [UserController::class, 'filter']);

    Route::post('/posts/fetch', [PostController::class, 'fetch']);
    Route::post('/posts/friends', [PostController::class, 'get']);
    Route::post('/posts/create', [PostController::class, 'store']);
    Route::delete('/posts/delete/{post}', [PostController::class, 'destroy']);
    Route::post('/posts/like', [PostController::class, 'like']);
    Route::post('/posts/dislike', [PostController::class, 'dislike']);
    Route::post('/posts/bookmark', [PostController::class, 'bookmark']);
    Route::post('/posts/unbookmark', [PostController::class, 'unbookmark']);

    Route::post('/comments/get', [CommentController::class, 'get']);
    Route::post('/comments/store', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}/destroy', [CommentController::class, 'destroy']);

    Route::get('/notifications/get', [NotificationController::class, 'get']);
    Route::get('/notifications/count', [NotificationController::class, 'getCount']);
    Route::put('/notifications/status/update', [NotificationController::class, 'updateStatus']);
    Route::put('/notifications/read', [NotificationController::class, 'read']);

    Route::post('/sign-out', [AuthController::class, 'logout']);
});
