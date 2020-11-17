@extends('_layout')

@section('title', 'Home')

@section('css')
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="{{ asset('css/home.css') }}" rel="stylesheet">
@endsection

@section('content')
    <main id="home"></main>
@endsection

@section('js', asset('js/home.js'))