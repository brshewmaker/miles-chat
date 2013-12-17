@extends('main_template')

@section('title')
<title>Miles Chat --> Chat</title>
@stop

@section('stylesheets')
{{HTML::style('css/chat.css')}}
@stop

@section('content')
<h3>Chat page</h3>

<div class="row">
	<!-- Logged in Users Div -->
	<div class="col col-sm-3">
	<legend>Users</legend>
		<p>Ben</p>
		<p>Tacit</p>
		<p>ben-mobile</p>
	</div> <!-- end users div -->

	<!-- Chat Div -->
	<div class="col col-sm-9 chat-div">
	<legend>Messages</legend>

		<table class="table table-striped chat-messages">
			<tr><td><strong>ben: </strong>This is a chat message</td></tr>
			<tr><td>and this is another</td></tr>
			<tr><td>followed by this one</td></tr>
			<tr><td>and then this one</td></tr>
			<tr><td>1</td></tr>
			<tr><td>2</td></tr>
			<tr><td>3</td></tr>
		</table>


		<div class="chat-input">
			{{Form::open(array('url' => 'send_chat', 'class' => 'form-horizontal', 'id' => 'chat_box'))}}
				<div class="form-group">
					<div class="controls">
						<textarea class="form-control" name="chatmsg" id="chatmsg" rows="2"></textarea>
					</div>
				</div>

				<div class="form-group">
				    <div class="controls">
						<input type="submit" class="btn btn-primary" value="Send">
				    </div>
				</div>

			{{Form::close()}}
			<p>Chat input div</p>
		</div>

	</div> <!-- end chat div -->

</div>

@stop