# Miles Chat

Miles chat is a simple, single room chat application built in PHP using the [Laravel 4 framework](http://laravel.com/).  Acccess to the chat room requires authentication, and features a rudimentary file uploading/sharing capability.  

There is a live demo of Miles Chat [here](http://www.shewbox.org/miles-chat).  All user accounts, chat messages, and file uploads are reset daily.

## Installation

If you are new to Laravel and/or have not installed a Laravel application before, please see [the Laravel documentation](http://laravel.com/docs/installation) for more general information.  

**Requirements:**

1. PHP >= 5.3.7

2. MCrypt PHP Extension

3. [Composer](https://getcomposer.org/)


**Installation Steps:**

1. `git clone https://github.com/brshewmaker/miles-chat.git`

2. Create mysql DB 

3. In app/config/app.php, change 'debug' => true to false if this isn't a dev environment.

4. In app/config/app.php, change 'key' => 'YourSecretKey!!!' to a random 32 bit string

5. In app.config/app.php, change the timezone to the timezone of your server

6. In app/config/database.php, change the mysql DB connection options to your database and username/password

7. Optionally, you can change the path for file uploads in app/config/uploads.php

8. In the miles-chat path, run `composer install --prefer-dist --no-dev`  You can leave off the --no-dev if you also want to install the dev packages from composer.json

9. Run `composer dump-autoload`

10. Run the database migrations:

	`php artisan migrate:install`

	`php artisan migrate`

11. Create a new virtual host for the application or you can also create a symbolic link to the /public folder of miles-chat.  For example, on a typical Ubuntu LAMP stack you could do 

`sudo ln -s /path/to/miles-chat/public /var/www/miles-chat`

which would allow you to go to http://localhost/miles-chat.

## What's new in 1.2

This latest release focuses on the file uploading side of things.  What's changed:

1.  Upload multiple files at once

2.  Deleting files doesn't require a page refresh

3.  Upload files by dragging them either into the upload box in the files page, or into the chat messages div in /chat

4.  Cannot upload files with the same filename

5.  Files can only be deleted by the uploader, not by anyone

6.  Other minor bugfixes.

## Why does this even exist?

Why write yet another simple chat application?  Because I wanted to scratch an itch and learn something.  I actually do use this very simple application on my home server with a user base of 2 (my server is named Miles, hence the names Miles Chat).  As long as my friend and I keep using this chat then this author is happy with the results.  If you find it useful in any way, then that's just an added side bonus.
