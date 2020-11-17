<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    /** @test */
    public function successful_redirect_to_page()
    {
        $response = $this->get('/index');

        $response->assertOk();
        $response->assertViewIs('index');
        $this->assertGuest('web');
    }

    /** @test */
    public function display_username_error_if_null()
    {
        $response = $this->postJson('/sign-in', [
            'username' => null,
            'password' => 'password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'message' => 'Please enter your username.'
            ]);

        $this->assertGuest('web');
    }

    /** @test */
    public function display_password_error_if_null()
    {
        $response = $this->postJson('/sign-in', [
            'username' => 'username123',
            'password' => null,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'message' => 'Please enter your password.'
            ]);

        $this->assertGuest('web');
    }

    /** @test */
    public function wrong_combination()
    {
        $response = $this->postJson('/sign-in', [
            'username' => 'username123',
            'password' => 'passcode',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'message' => 'The combination you entered does not exist.'
            ]);

        $this->assertGuest('web');
    }

    /** @test */
    public function correct_combination()
    {   
        $user = User::first();

        $response = $this->postJson('/sign-in', [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertExactJson([
                'url' => route('home')
            ]);

        $this->assertAuthenticated('web');
    }
}
