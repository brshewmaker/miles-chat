@extends('main_template')

@section('title')
<title>Miles Chat: Archive</title>
@stop

@section('scripts')
{{HTML::script('js/archive.js')}}
@stop

@section('content')
<h2>Archives</h2>

<br />

<div id="archive_messages"></div>

@stop