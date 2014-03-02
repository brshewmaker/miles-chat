@extends('main_template')

@section('title')
<title>Miles Chat --> Files</title>
@stop

@section('stylesheets')
	{{HTML::style('css/bootstrap-sortable.css')}}
	{{HTML::style('css/files.css')}}
@stop

@section('scripts')
	{{HTML::script('js/bootstrap-sortable.js')}}
	{{HTML::script('js/plupload.full.min.js')}}
	{{HTML::script('js/files.js')}}
@stop

@section('content')

	<h3>Upload</h3>

	<button class="btn btn-default" id="browse" href="javascript:;">Select Files</button>
	<button class="btn btn-primary" id="start-upload" href="javascript:;">Start Upload</button>

	<br /><br />

	<div class="well" id="file_upload_div">
		<p id="upload_message">Click 'select files' above, or you can drag files here to upload</p>
		<ul id="filelist"></ul>
	</div>

	<pre id="error_console"></pre>

	<h3>Files</h3>

	<table class="table table-striped sortable" id="files_table">
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
				<?php $file_user = User::find($upload->user_id); ?>
				<tr>
					<td>{{HTML::link('get-file/' . $upload->id, $upload->filename)}}</td>
					<td>{{$upload->filetype}}</td>
					<td>{{$upload->created_at}}</td>
					<td>{{$upload->filesize}}</td>
					<td>{{$file_user->username}}</td>
					@if ($file_user->id == $user->id)
						<td><a href="#" data-id="{{$upload->id}}" class="delete-file-confirm">Delete</a></td>
					@else
						<td></td>
					@endif
				</tr>
			@endforeach
		</tbody>
	</table>

@stop