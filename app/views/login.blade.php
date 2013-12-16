@extends('main_template')

@section('title')
<title>Miles Chat --> Login</title>
@stop

@section('content')

{{Form::open(array('url' => 'login', 'class' => 'form-horizontal'))}}
		<div class="form-group">
			<div class="col-sm-7">
				<input class="form-control" name="username" type="text" placeholder="username">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-7">
				<input class="form-control" name="password" type="password" placeholder="password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-2">
				<div class="checkbox">
					<label>
						<input name="remember" type="checkbox"> Remember Me
					</label>
				</div>
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-2">
				<button type="submit" class="btn btn-primary">Submit</button>
			</div>
		</div>
{{Form::close()}}

{{HTML::link('register', 'Register')}}

@stop