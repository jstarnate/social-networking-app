<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'regex:/^[A-Za-z ]+$/'],
            'email' => ['required', 'string', 'email', 'unique:users'],
            'username' => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9.]+$/', 'unique:users'],
            'birth_month' => ['required', 'string'],
            'birth_day' => ['required', 'numeric', 'between:1,31'],
            'birth_year' => ['required', 'numeric'],
            'gender' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'regex:/^[a-zA-Z0-9]+$/']
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'required' => 'Please enter your :attribute.',
            'regex' => 'Please enter a valid :attribute.',
            'unique' => 'The :attribute you entered already exists.',

            'email.email' => 'Please enter a valid email address.',

            'full_name.min' => 'Name must be at least 2 characters long.',
            'username.min' => 'Username must be at least 6 characters long.',

            'birth_day.between' => 'Birth day must range from 1 to 31.',

            'gender.required' => 'Please select a gender.',

            'password.min' => 'Password must be at least 8 characters long.',
        ];
    }
}
