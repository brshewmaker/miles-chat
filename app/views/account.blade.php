@extends('main_template')

@section('title')
<title>Miles Chat --> Account</title>
@stop

@section('content')
<h3>Change Password</h3>
<br />

  	{{Form::open(array('url' => 'account-edit-user', 'class' => 'form-horizontal'))}}
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