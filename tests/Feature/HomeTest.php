<?php

namespace Tests\Feature;

use App\Models\{User, Post};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class HomeTest extends TestCase
{
    /**
     * Set a successful login response.
     */
    protected function setResponse()
    {
        $user = User::first();

        return $this->postJson('/sign-in', [
            'username' => $user->username,
            'password' => 'password',
        ]);
    }

    /** @test */
    public function create_a_post()
    {
        $user = User::first();
        $userBody = $user->only('full_name', 'username', 'gender', 'image_url');
        $userBody['url'] = route('profile', ['username' => $user->username]);

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->postJson('/posts/create', ['body' => 'Hello World']);

        $response->assertOk()->assertJson([
            'post' => [
                'id' => Post::count(),
                'body' => 'Hello World',
                'from_self' => true,
                'is_liked' => false,
                'likes' => 0,
                'comments' => 0,
                'bookmarked' => false,
                'created_at' => '1 second ago',
                'user' => $userBody,
            ]
        ]);

        $this->assertDatabaseHas('posts', [
            'id' => Post::count()
        ]);
    }

    /** @test */
    public function delete_a_post() {
        $user = User::first();
        $id = $user->posts()->first()->id;

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->deleteJson("/posts/delete/{$id}");

        $response->assertOk()->assertJson(['message' => 'Post deleted!']);
        $this->assertDatabaseMissing('posts', compact('id'));
    }

    /** @test */
    public function get_3_random_suggested_users_in_rightbar()
    {
        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->getJson('/users/suggested');

        $response->assertOk()
            ->assertJsonStructure([
                'users' => [
                    ['id', 'full_name', 'username', 'gender', 'image_url', 'url']
                ]
            ]);
    }

    /** @test */
    public function get_posts_from_followed_users()
    {
        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->postJson('/posts/friends');

        $response->assertOk()
            ->assertJsonStructure([
                'items' => [
                    [
                        'id',
                        'body',
                        'from_self',
                        'is_liked',
                        'likes',
                        'comments',
                        'bookmarked',
                        'user' => ['full_name', 'username', 'gender', 'image_url', 'url'],
                    ]
                ],
                'timestamp',
            ]);
    }

    /** @test */
    public function like_a_post()
    {
        $user = User::first();

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->postJson('/posts/like', ['id' => 7]);

        $response->assertOk()->assertJson(['message' => 'Post liked!']);
        $this->assertDatabaseHas('liker_post', [
            'liker_id' => $user->id,
            'post_id' => 7,
        ]);
    }

    /** @test */
    public function dislike_a_post()
    {
        $user = User::first();

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->postJson('/posts/dislike', ['id' => 7]);

        $response->assertOk()->assertJson(['message' => 'Post disliked!']);
        $this->assertDatabaseMissing('liker_post', [
            'liker_id' => $user->id,
            'post_id' => 7,
        ]);
    }

    /** @test */
    public function bookmark_a_post()
    {
        $user = User::first();

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->postJson('/posts/bookmark', ['id' => 5]);

        $response->assertOk()->assertJson(['message' => 'Bookmarked!']);
        $this->assertDatabaseHas('bookmark_user', [
            'user_id' => $user->id,
            'bookmark_id' => 5,
        ]);
    }

    /** @test */
    public function unbookmark_a_post()
    {
        $user = User::first();

        $this->setResponse()->assertOk();
        $this->assertAuthenticated('web');

        $response = $this->actingAs($user, 'web')
                    ->postJson('/posts/unbookmark', ['id' => 5]);

        $response->assertOk()->assertJson(['message' => 'Unbookmarked!']);
        $this->assertDatabaseMissing('bookmark_user', [
            'user_id' => $user->id,
            'bookmark_id' => 5,
        ]);
    }
}
