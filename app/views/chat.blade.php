@extends('main_template')

@section('title')
<title>Miles Chat: Chat</title>
@stop

@section('stylesheets')
{{HTML::style('css/chat.css')}}
@stop

@section('scripts')
{{HTML::script('js/lib/plupload.full.min.js')}}
{{HTML::script('js/chat.js')}}
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
		<P>Use these at the anywhere in a message.</P>
		<p><strong>*strong*</strong></p>
		<p><em>_italics_</em></p>
		<p><code>`single backtick for code`</code></p>
		<p><pre><code>```triple backticks for block of code</pre></code></p>
		<p><h4># Header Text</h4></p>
		<p>> Blockquotes (currently broken)</p>
	</div>
@stop