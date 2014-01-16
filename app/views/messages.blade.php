@foreach($messages as $message)
	<?php $user = User::find($message->user_id); ?>
	<div class="chat-message">
		<div class="chat-message-info">
			<strong>{{$user->username}}</strong> | {{substr($message->created_at, 11)}}
		</div>
		<div class="chat-message" data-messageid="{{$message->id}}">
			<p>{{stripslashes($message->message)}}</p>
		</div>
	</div>
@endforeach