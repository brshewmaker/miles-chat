@foreach($messages as $message)
	<tr><td data-messageid="{{$message['id']}}"><i>{{$message['date']}}</i> | <strong>{{$message['username']}}</strong> {{$message['message']}}</td></tr>
@endforeach