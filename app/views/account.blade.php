@extends('main_template')

@section('title')
<title>Miles Chat --> Account</title>
@stop

@section('content')
<h3>Change Password</h3>
<br />

@if (isset($failed))
	<div class="alert alert-danger alert-dismissable">
		<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
		<?php $errors = $errors->all(); ?>
		@if (!empty($errors))
			@foreach ($errors as $error)
				<strong>Error!</strong> {{$error}} <br / >
			@endforeach
		@else
			<strong>Error!</strong> Something went wrong.  Try again
		@endif
	</div>
@endif

@if (isset($passed))
	<div class="alert alert-success alert-dismissable">
		<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
		<strong>Sweet!</strong> Your password has been updated
	</div>
@endif

  	{{Form::open(array('url' => 'edit-user', 'class' => 'form-horizontal'))}}
	    <div class="form-group">
	        <label class="col-sm-2 control-label" for="currentpassword">Current Password </label>
	        	<div class="col-sm-6">
				    <input class="form-control" type="password" name="currentpassword" id="currentpassword">
				</div>
	    </div>

	    <div class="form-group">
	        <label class="col-sm-2 control-label" for="password">Password </label>
	        	<div class="col-sm-6">
				    <input class="form-control" type="password" name="password" id="password" placeholder="At least 8 characters">
				</div>
	    </div>

	    <div class="form-group">
	        <label class="col-sm-2 control-label" for="confirmpassword">Confirm Password </label>
	        	<div class="col-sm-6">
				    <input class="form-control" type="password" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password">
				</div>
	    </div>

		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
			    <input id="register_button" type="submit" class="btn btn-primary" value="Update">
			</div>
	    </div>
    {{Form::close()}}


@stop