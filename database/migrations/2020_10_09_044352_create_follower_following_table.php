<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFollowerFollowingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('follower_following', function (Blueprint $table) {
            $table->bigInteger('follower_id')->unsigned();
            $table->foreign('follower_id')->references('id')->on('users')->onCascade('delete');
            
            $table->bigInteger('following_id')->unsigned();
            $table->foreign('following_id')->references('id')->on('users')->onCascade('delete');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('follower_following');
    }
}
