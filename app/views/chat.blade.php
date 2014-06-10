@extends('main_template')

@section('title')
<title>Miles Chat --> Chat</title>
@stop

@section('stylesheets')
{{HTML::style('css/chat.css')}}
@stop

@section('scripts')
{{HTML::script('js/jquery.form.min.js')}}
{{HTML::script('js/plupload.full.min.js')}}
<script type="text/jsx" src="js/chat-react.js"></script>

@stop

@section('content')

	<!-- Logged in Users Div -->
	<div class="sidebar">
		<legend>Online</legend>
		<div id="logged_in_users"></div>
		<br />
		<div class="file-upload hidden">
			<legend>Uploading</legend>
			<button id="hidden_button"></button>
		</div>
	</div> <!-- end sidebar -->

	<!-- Chat Div -->
	<div id="chat-div"></div>

	<!-- Server Error Alert div -->
	<div class="server-error">
		<div class="alert alert-danger chat-message">
			<p><strong>Error!</strong> cannot connect to chat server.</p>
		</div>
	</div>

	<!-- Chat commands popover html -->
	<div id="chat_commands">
		<P>Use these at the beginning of a message.</P>
		<p><strong>/code:</strong> wrap in code and pre</p>
		<p><strong>/quote:</strong> wrap in blockquote</p>
		<p><strong>/h1 thru /h4:</strong> title tags</p>
		<p><strong>/b:</strong> wrap in strong</p>
		<p><strong>/i:</strong> wrap in em</p>
		<p><strong>/image:</strong> embed an inline image</p>
	</div>

	<!-- Sending msg div -->
	<div id="sending_msg_div">
		<div class="panel panel-default sending-message">
			<div class="panel-body">
				<p><img src="images/loading.gif">  sending</p>
			</div>
		</div>
	</div>

@stop