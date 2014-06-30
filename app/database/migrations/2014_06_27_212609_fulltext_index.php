<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FulltextIndex extends Migration {

	/**
	 * Add a FULLTEXT search index on the table.  
	 *
	 * This requires changing the engine from innodb to myisam because innodb fulltext search
	 * isn't available to versions of mysql < 5.6
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
