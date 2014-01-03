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

		<div class="chat-messages-div">
			<table class="table table-striped chat-messages">
				<tbody>
				</tbody>
			</table>
		</div>

		<div class="chat-input">
			{{Form::open(array('url' => 'send_chat', 'class' => 'form-horizontal', 'id' => 'chat_box'))}}
				<div class="form-group">
					<div class="controls">
						<textarea class="form-control" name="chatmsg" id="chatmsg" rows="2"></textarea>
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