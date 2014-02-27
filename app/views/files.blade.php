@extends('main_template')

@section('title')
<title>Miles Chat --> Files</title>
@stop

@section('stylesheets')
	{{HTML::style('css/bootstrap-sortable.css')}}
@stop

@section('scripts')
	{{HTML::script('js/bootstrap-sortable.js')}}
	{{HTML::script('js/plupload.full.min.js')}}
	{{HTML::script('js/files.js')}}
@stop

@section('content')
	<h3>Test plupload</h3>
	<ul id="filelist"></ul>
<br />
 
	<h3>Files</h3>
	<p>Select files or drag to upload</p>

	<button class="btn btn-default" id="browse" href="javascript:;">Select Files</button>
	<button class="btn btn-primary" id="start-upload" href="javascript:;">Start Upload</button>

	<br />

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
				<?php $user = User::find($upload->user_id); ?>
				<tr>
					<td>{{HTML::link('get-file/' . $upload->id, $upload->filename)}}</td>
					<td>{{$upload->filetype}}</td>
					<td>{{$upload->created_at}}</td>
					<td>{{$upload->filesize}}</td>
					<td>{{$user->username}}</td>
					<td>{{HTML::link('delete-file/' . $upload->id, 'Delete')}}</td>
				</tr>
			@endforeach
		</tbody>
	</table>

@stop