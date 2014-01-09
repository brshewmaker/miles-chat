@extends('main_template')

@section('title')
<title>Miles Chat --> Files</title>
@stop

@section('stylesheets')
	{{HTML::style('css/bootstrap-sortable.css')}}
@stop

@section('scripts')
	{{HTML::script('js/bootstrap-sortable.js')}}
@stop

@section('content')
	<h3>Files</h3>

	{{Form::open(array('url' => 'upload-file', 'class' => 'form-horizontal'))}}
		<div class="form-group">
			<input type="file" id="fileupload">
		</div>
	{{Form::close()}}

	<table class="table table-striped sortable">
		<thead>
			<th>Filename</th>
			<th>Type</th>
			<th>Date</th>
			<th>Size</th>
			<th>User</th>
			<th>Delete</th>
		</thead>
		<tbody>
			@foreach($uploads as $upload)
				<tr>
					<td>{{HTML::link('get-file/' . $upload->id, $upload->filename)}}</td>
					<td>{{$upload->filetype}}</td>
					<td>{{$upload->created_at}}</td>
					<td>{{$upload->filesize}}</td>
					<td>{{$upload->username}}</td>
					<td>{{HTML::link('delete-file/' . $upload->id, 'Delete')}}</td>
				</tr>
			@endforeach
		</tbody>
	</table>

@stop