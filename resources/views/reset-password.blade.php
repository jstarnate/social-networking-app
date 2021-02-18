@extends('_layout')

@section('title', 'Reset password')

@section('css')
    <link href="{{ asset('css/reset.css') }}" rel="stylesheet">
@endsection

@section('content')
    <header class="d--flex ai--center jc--center pd-t--sm pd-b--sm">
        <a href="{{ route('index') }}">
            <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="black"/>
                <path d="M6.85718 12H18V29.1429L9.14289 20.2857M33.4286 12H24.8572M24.8572 12H21.7143L9.42861 31.1429M24.8572 12V31.7143" stroke="white" stroke-width="2"/>
            </svg>
        </a>
    </header>

    <main id="reset" class="reset"></main>

    <main id="portal"></main>
@endsection

@section('js', asset('js/reset.js'))