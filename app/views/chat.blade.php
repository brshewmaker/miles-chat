@extends('main_template')

@section('title')
<title>Miles Chat --> Chat</title>
@stop

@section('stylesheets')
{{HTML::style('css/chat.css')}}
@stop

@section('scripts')
{{HTML::script('js/jquery.form.min.js')}}
{{HTML::script('js/chat.js')}}
@stop

@section('content')

	<!-- Logged in Users Div -->
	<div class="users_div">
		<legend>Users</legend>
		<div id="logged_in_users"></div>
	</div> <!-- end users div -->

	<!-- Chat Div -->
	<div class="chat-div">

		<legend>Messages</legend>

		<div class="chat-messages-div"></div>

		<div class="chat-input">
			{{Form::open(array('url' => 'send_chat', 'class' => 'form-inline', 'id' => 'chat_box'))}}
				<div class="form-group col-md-11 col-sm-10">
					<div class="controls">
						<textarea name="chatmsg" id="chatmsg"></textarea>
					</div>
				</div>

				<div class="form-group">
				    <div class="controls">
						<input id="send_button" type="submit" class="btn btn-primary" value="Send">
				    </div>
				</div>
			{{Form::close()}}
		</div>
	<div> <!-- end chat div -->

@stop