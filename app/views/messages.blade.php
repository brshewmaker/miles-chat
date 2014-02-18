@foreach($messages as $message)
	<?php $user = User::find($message->user_id); ?>
	<div class="chat-message panel panel-default">
		<div class="chat-message-info panel-heading">
			<span class='text-muted'>{{$user->username}}</span> | {{$message->created_at}}
		</div>
		<div class="chat-message-body panel-body" data-messageid="{{$message->id}}">
			<p>{{$message->message}}</p>
		</div>
	</div>
@endforeach