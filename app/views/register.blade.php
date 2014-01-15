@extends('main_template')

@section('title')
<title>Miles Chat --> Register</title>
@stop

@section('content')
<h3>Create an account</h3>
<br />

@if (isset($failed))
	<div class="alert alert-danger alert-dismissable">
		<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
		<?php $errors = $errors->all(); ?>
		@if (!empty($errors))
			@foreach ($errors as $error)
				<strong>Error!</strong> {{$error}} <br />
			@endforeach
		@else
			<strong>Error!</strong> Something went wrong.  Try again
		@endif
	</div>
@endif

	{{Form::open(array('url' => 'add-user', 'class' => 'form-horizontal', 'id' => 'create_user'))}}
	    <div class="form-group">
	        <label class="control-label col-sm-2" for="username">Username </label>
	        <div class="col-sm-6">
			    <input class="form-control" type="text" name="username" id="username" placeholder="username">
		    </div>
	    </div>

	    <div class="form-group">
	        <label class="control-label col-sm-2" for="password">Password </label>
	        <div class="col-sm-6">
			    <input class="form-control" type="password" name="password" id="password" placeholder="At least 8 characters">
		    </div>
	    </div>

	    <div class="form-group">
	        <label class="control-label col-sm-2" for="confirmpassword">Confirm Password </label>
	        <div class="col-sm-6">
			    <input class="form-control" type="password" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password">
		    </div>
	    </div>

		<div class="form-group">
		    <div class="col-sm-offset-2 col-sm-2">
			    <input id="register_button" type="submit" class="btn btn-primary" value="Register">
		    </div>
	    </div>
	{{Form::close()}}


@stop