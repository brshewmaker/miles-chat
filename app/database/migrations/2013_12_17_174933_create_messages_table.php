<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('messages', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->text('message');
		});

		// Insert a default welcome message that will be assigned to the first user created
		DB::table('messages')->insert(array(
			array(
				'user_id' => 1,
				'message' => 'Welcome to Miles-Chat!  Hit enter to submit a new message, and click the ? to see formatting help',
			),
		));
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('messages');
	}

}