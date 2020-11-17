@extends('_layout')

@section('title', 'Index')

@section('css')
    <link href="{{ asset('css/index.css') }}" rel="stylesheet">
@endsection

@section('content')
    <header class="header">
        <div class="pos--rel d--flex mg-l--auto mg-r--auto header__wrap">
            <a class="pos--abs header__logo-link" href="{{ route('index') }}">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="black"/>
                    <path d="M6.85718 12H18V29.1429L9.14289 20.2857M33.4286 12H24.8572M24.8572 12H21.7143L9.42861 31.1429M24.8572 12V31.7143" stroke="white" stroke-width="2"/>
                </svg>
            </a>
    
            <a class="font--md text--gray pd-t--sm pd-b--sm pd-l--lg pd-r--lg mg-l--auto header__sidelink" href="/register">
                Sign up
            </a>
        </div>
    </header>

    <main id="index" class="index"></main>
@endsection

@section('js', asset('js/index.js'))