@extends('main_template')

@section('title')
<title>Miles Chat: Archive</title>
@stop

@section('scripts')
{{HTML::script('js/archive.js')}}
@stop

@section('content')
<h2>Archives</h2>
<ul class="nav nav-tabs">
	<li class="archive-date active"><a href="#">By Date</a></li>
	<li class="archive-all"><a href="#all">All</a></li>
	<li class="archive-search"><a href="#search">Search</a></li>
</ul>

<br />

<div id="archive"></div>

@stop