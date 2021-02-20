@extends('_layout')

@section('title', 'Sign up')

@section('css')
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="{{ asset('css/register.css') }}" rel="stylesheet">
@endsection

@section('content')
    <header class="header">
        <div class="pos--rel d--flex mg-l--auto mg-r--auto header__wrap">
            <a class="pos--abs header__logo-link" href="{{ route('index') }}">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="black"/>
                    <path d="M10.4 22.9917H15.6632V28.2L12.9 25.3875L10.4 22.9917Z" fill="white"/>
                    <path d="M21.979 16.1167H25.1369V22.9917L21.979 28.2V16.1167Z" fill="white"/>
                    <path d="M17.2421 13.2H19.9789H25.1894H30.4L25.1368 16.325H17.2421V14.7625V13.2Z" fill="white"/>
                    <rect x="17.2421" y="16.2208" width="3.15789" height="11.9792" fill="white"/>
                    <path d="M10.4 16.4L15.6 13.2V16.4H10.4Z" fill="white"/>
                </svg>
            </a>
    
            <a class="font--md text--gray pd-t--sm pd-b--sm pd-l--lg pd-r--lg mg-l--auto header__sidelink" href="/index">
                Sign in
            </a>
        </div>
    </header>

    <main id="register" class="register"></main>

    <main id="portal"></main>
@endsection

@section('js', asset('js/register.js'))