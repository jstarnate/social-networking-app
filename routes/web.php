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
    
    Route::post('/api/sign-in', [AuthController::class, 'login'])->name('signin');
    Route::post('/api/sign-up', [AuthController::class, 'register'])->name('signup');
    
    Route::get('/verify/{token}', [AuthController::class, 'verify'])->name('verify');
    
    Route::view('/forgot-password', 'forgot')->name('forgot-password');
    Route::post('/api/forgot-password/send', [AuthController::class, 'sendPasswordResetNotification']);
    
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])->name('reset-password.show');
    Route::post('/api/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
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
    Route::post('/api/users', [UserController::class, 'fetchUsers']);
    Route::get('/api/users/auth', [UserController::class, 'getAuthUser']);
    Route::get('/api/users/u/{username}', [UserController::class, 'getUser']);
    Route::post('/api/users/u/{username}/{name}', [UserController::class, 'getConnectedPosts']);
    Route::get('/api/users/suggested', [UserController::class, 'getSuggestedUsers']);
    Route::post('/api/users/follow', [UserController::class, 'follow']);
    Route::post('/api/users/unfollow', [UserController::class, 'unfollow']);
    Route::get('/api/users/search', [UserController::class, 'search']);
    Route::post('/api/users/search/results', [UserController::class, 'getSearchResults']);
    Route::post('/api/users/filter', [UserController::class, 'filter']);

    Route::post('/api/posts/fetch', [PostController::class, 'fetch']);
    Route::post('/api/posts/friends', [PostController::class, 'get']);
    Route::post('/api/posts/create', [PostController::class, 'store']);
    Route::delete('/api/posts/delete/{post}', [PostController::class, 'destroy']);
    Route::post('/api/posts/like', [PostController::class, 'like']);
    Route::post('/api/posts/dislike', [PostController::class, 'dislike']);
    Route::post('/api/posts/bookmark', [PostController::class, 'bookmark']);
    Route::post('/api/posts/unbookmark', [PostController::class, 'unbookmark']);

    Route::post('/api/comments/get', [CommentController::class, 'get']);
    Route::post('/api/comments/store', [CommentController::class, 'store']);
    Route::delete('/api/comments/{comment}/destroy', [CommentController::class, 'destroy']);

    Route::get('/api/notifications/get', [NotificationController::class, 'get']);
    Route::get('/api/notifications/count', [NotificationController::class, 'getCount']);
    Route::put('/api/notifications/status/update', [NotificationController::class, 'updateStatus']);
    Route::put('/api/notifications/read', [NotificationController::class, 'read']);

    Route::post('/api/sign-out', [AuthController::class, 'logout']);
});
