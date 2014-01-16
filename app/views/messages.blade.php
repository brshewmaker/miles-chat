@foreach($messages as $message)
	<?php $user = User::find($message->user_id); ?>
	<div class="chat-message">
		<div class="chat-message-info">
			<strong>{{$user->username}}</strong> | {{$message->created_at}}
		</div>
		<div class="chat-message-body" data-messageid="{{$message->id}}">
			<p>{{stripslashes($message->message)}}</p>
		</div>
	</div>
@endforeach