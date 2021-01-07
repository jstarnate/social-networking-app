<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'username' => [
                'required',
                'string',
                'min:6',
                'regex:/^[A-Za-z0-9.]+$/',
                Rule::unique('users')->where(fn($query) => $query->where('username', '!=', auth()->user()->username))
            ],
            'bio' => ['max:120'],
        ];
    }
}
