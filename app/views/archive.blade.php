@extends('main_template')

@section('title')
<title>Miles Chat --> Archive</title>
@stop

@section('content')
<h2>Archive page {{$messages->getCurrentPage()}} of {{$messages->getLastPage()}}</h2>

<br />

<?php echo View::make('messages')->with('messages', $messages); ?>

<?php echo $messages->links(); ?>

@stop