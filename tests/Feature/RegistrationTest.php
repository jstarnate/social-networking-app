<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    /** @test */
    public function all_blanks_should_display_errors()
    {
        $response = $this->postJson('/sign-up', [
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'username' => null,
            'gender' => null,
            'birth_month' => null,
            'birth_day' => null,
            'birth_year' => null,
            'password' => null,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name' => 'Please enter your first name.',
                'last_name' => 'Please enter your last name.',
                'email' => 'Please enter your email.',
                'username' => 'Please enter your username.',
                'password' => 'Please enter your password.',
                'gender' => 'Please select a gender.',
                'birth_month' => 'Please enter your birth month.',
                'birth_day' => 'Please enter your birth day.',
                'birth_year' => 'Please enter your birth year.',
            ]);
    }

    /** @test */
    public function no_error_on_filled_up_field()
    {
        $response = $this->postJson('/sign-up', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => null,
            'username' => null,
            'gender' => 'Male',
            'birth_month' => null,
            'birth_day' => 12,
            'birth_year' => null,
            'password' => null,
        ]);

        $response->assertStatus(422)
            ->assertJsonMissingValidationErrors(
                'first_name',
                'last_name',
                'gender',
                'birth_day'
            );
    }

    /** @test */
    public function minimum_length_errors()
    {
        $response = $this->postJson('/sign-up', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@email.com',
            'username' => 'john',
            'gender' => 'Male',
            'birth_month' => 'March',
            'birth_day' => 12,
            'birth_year' => 1985,
            'password' => '1234',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'username' => 'Username must be at least 6 characters long.',
                'password' => 'Password must be at least 8 characters long.',
            ]);
    }

    /** @test */
    public function regex_errors()
    {
        $response = $this->postJson('/sign-up', [
            'first_name' => 'John-*&',
            'last_name' => '$doe',
            'email' => 'johndoe@email.com',
            'username' => 'john12user%',
            'gender' => 'Male',
            'birth_month' => 'March',
            'birth_day' => 12,
            'birth_year' => 1985,
            'password' => '#@*^(!@#&$$',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name' => 'Please enter a valid first name.',
                'last_name' => 'Please enter a valid last name.',
                'username' => 'Please enter a valid username.',
                'password' => 'Please enter a valid password.',
            ]);
    }

    /** @test */
    public function email_address_already_exists_in_database_error()
    {
        $user = User::first();

        $response = $this->postJson('/sign-up', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $user->email,
            'username' => 'john.doe',
            'gender' => 'Male',
            'birth_month' => 'March',
            'birth_day' => 12,
            'birth_year' => 1985,
            'password' => 'password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'email' => 'The email you entered already exists.',
            ]);
    }

    /** @test */
    public function username_already_exists_in_database_error()
    {
        $user = User::first();

        $response = $this->postJson('/sign-up', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@email.com',
            'username' => $user->username,
            'gender' => 'Male',
            'birth_month' => 'March',
            'birth_day' => 12,
            'birth_year' => 1985,
            'password' => 'password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'username' => 'The username you entered already exists.',
            ]);
    }

    /** @test */
    // public function successful_registration()
    // {
    //     $body = [
    //         'first_name' => 'John',
    //         'last_name' => 'Doe',
    //         'email' => 'johndoe@email.com',
    //         'username' => 'john.doe',
    //         'gender' => 'Male',
    //         'birth_month' => 'March',
    //         'birth_day' => 12,
    //         'birth_year' => 1985,
    //         'password' => 'password',
    //     ];

    //     $response = $this->postJson('/sign-up', $body);

    //     $response->assertOk()->assertExactJson(['url' => route('index')]);
    //     $this->assertDatabaseHas('users', $body);
    // }
}
