@foreach($messages as $message)
	<tr><td data-messageid="{{$message['id']}}"><p><i>{{$message['date']}}</i> | <strong>{{$message['username']}}</strong> {{$message['message']}}</p></td></tr>
@endforeach