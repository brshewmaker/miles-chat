@foreach($messages as $message)
	<?php $user = User::find($message->user_id); ?>
	<tr><td data-messageid="{{$message->id}}"><p><i>{{substr($message->created_at, 11)}}</i> | <strong>{{$user->username}}</strong> {{$message->message}}</p></td></tr>
@endforeach