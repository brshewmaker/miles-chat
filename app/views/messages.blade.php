@foreach($messages as $message)
	<?php $user = User::find($message->user_id); ?>
	<div class="chat-message">
		<div class="chat-message-info">
			<span class='text-muted'>{{$user->username}}</span> | {{$message->created_at}}
		</div>
		<div class="chat-message-body" data-messageid="{{$message->id}}">
			<p>{{stripslashes($message->message)}}</p>
		</div>
	</div>
@endforeach