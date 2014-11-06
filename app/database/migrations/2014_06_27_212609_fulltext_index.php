<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FulltextIndex extends Migration {

	/**
	 * Add a FULLTEXT search index on the table.  
	 *
	 * @return void
	 */
	public function up()
	{
		DB::statement('ALTER TABLE messages ADD FULLTEXT search(message)');
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('messages', function(Blueprint $table)
		{
			$table->dropIndex('search');
		});
	}

}
