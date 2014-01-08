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
			<p class="help-block">Choose file to upload</p>
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
			<tr>
				<td>Example file.mp3</td>
				<td>mp3</td>
				<td>1-7-14</td>
				<td>13.2 MB</td>
				<td>ben</td>
				<td><button class="btn btn-danger btn-sm">delete</button></td>
			</tr>
		</tbody>
	</table>

@stop