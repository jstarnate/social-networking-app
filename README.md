A web app built with Laravel and React.

![App preview](https://res.cloudinary.com/dt9ntq5vr/image/upload/v1613908407/social/preview_desktop_ium45h.png)

**Features:**
- Follow/unfollow other users
- Post a tweet
- Like tweets
- Comment on tweets
- Bookmark tweets
- Basic notification system (follow, comment, like)
- Forgot password

**Running the app on local machine:**
1. Clone the repo.
2. Duplicate `.env.example` and fill out with your own environment variables.
3. Install the required NPM and Composer packages.
4. Set the application key with `php artisan key:generate`.
5. Migrate the database tables and generate fake data with `php artisan migrate --seed`.
6. Run `npm run dev` (or `yarn dev`) and `php artisan serve`.

**Sources:**
- [Font Awesome](https://fontawesome.com) - Icon fonts
- [loading.io](https://loading.io) - Loading SVGs