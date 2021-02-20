<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    HomeController,
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


// ===============================================
//  Auth view routes
// ===============================================
Route::middleware('auth')->group(function() {
    Route::view('/home', 'home')->name('home');

    Route::get('/u/{username}', [HomeController::class, 'show'])->name('profile');
    Route::get('/u/{username}/likes', [HomeController::class, 'show']);
    Route::get('/u/{username}/comments', [HomeController::class, 'show']);
    Route::get('/u/{username}/bookmarks', [HomeController::class, 'show']);
    Route::get('/{username}/connected/{name}', [HomeController::class, 'show']);
    Route::get('/profile/{username}/edit', [HomeController::class, 'show']);
    
    Route::view('/notifications', 'home');
    Route::view('/users', 'home');
    Route::view('/posts/{post}/comments', 'home');
    Route::view('/users/search', 'home');
});


// ===============================================
//  API routes
// ===============================================

// ==== Users ====
Route::group([
    'middleware' => 'auth',
    'prefix' => 'api/users'
], function() {
    Route::post('/', [UserController::class, 'getAll']);
    Route::get('/auth', [UserController::class, 'getAuth']);
    Route::put('/auth/update', [UserController::class, 'update']);
    Route::get('/u/{username}', [UserController::class, 'get']);
    Route::post(
        '/u/{username}/connected/{name}',
        [UserController::class, 'getConnectedUsers']
    )->where('name', '(followers|following)');
    Route::get('/suggested', [UserController::class, 'getSuggestedUsers']);
    Route::post('/follow', [UserController::class, 'follow']);
    Route::post('/unfollow', [UserController::class, 'unfollow']);
    Route::get('/search', [UserController::class, 'search']);
    Route::post('/search/results', [UserController::class, 'getSearchResults']);
    Route::post('/filter', [UserController::class, 'filter']);
});

// ==== Posts ====
Route::group([
    'middleware' => 'auth',
    'prefix' => 'api/posts'
], function() {
    Route::post('/', [PostController::class, 'get']);
    Route::post(
        '/u/{username}/{section}',
        [PostController::class, 'getFromProfile']
    )->where('section', '(posts|likes|comments|bookmarks)');
    Route::post('/fetch', [PostController::class, 'fetch']);
    Route::post('/create', [PostController::class, 'store']);
    Route::delete('/delete/{post}', [PostController::class, 'destroy']);
    Route::post('/like', [PostController::class, 'like']);
    Route::post('/dislike', [PostController::class, 'dislike']);
    Route::post('/bookmark', [PostController::class, 'bookmark']);
    Route::post('/unbookmark', [PostController::class, 'unbookmark']);
});

// ==== Comments ====
Route::group([
    'middleware' => 'auth',
    'prefix' => 'api/comments'
], function() {
    Route::post('/get', [CommentController::class, 'get']);
    Route::post('/store', [CommentController::class, 'store']);
    Route::delete('/{comment}/destroy', [CommentController::class, 'destroy']);
});

// ==== Notifications ====
Route::group([
    'middleware' => 'auth',
    'prefix' => 'api/notifications'
], function() {
    Route::post('/get', [NotificationController::class, 'get']);
    Route::get('/count', [NotificationController::class, 'getCount']);
    Route::put('/read', [NotificationController::class, 'read']);
});

// ==== Others ====
Route::post('/api/sign-out', [AuthController::class, 'logout'])->middleware('auth');
