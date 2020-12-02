<?php

namespace Database\Factories;

use App\Models\{User, Post, Comment};
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => $this->faker->numberBetween(1, User::count()),
            'post_id' => $this->faker->numberBetween(1, Post::count()),
            'body' => $this->faker->text(100),
        ];
    }
}
