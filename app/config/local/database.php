<?php 

return array(
	'connections' => array(

		'mysql' => array(
			'driver'    => 'mysql',
			'host'      => 'localhost',
			'database'  => $_ENV['database'],
			'username'  => $_ENV['username'],
			'password'  => $_ENV['password'],
			'charset'   => 'utf8',
			'collation' => 'utf8_unicode_ci',
			'prefix'    => '',
		),

	),
);