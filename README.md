A simple Twitter-inspired social networking web app that is built with Laravel and React. [Check it out here](https://jtsocial.herokuapp.com/index).

**Features**
- Follow/unfollow other users
- Post a tweet
- Like tweets
- Comment on tweets
- Bookmark tweets
- Basic notification system (follow, comment, like)
- Forgot password

**App preview**
![App preview](https://res.cloudinary.com/dt9ntq5vr/image/upload/v1613908407/social/preview_desktop_ium45h.png)

**Running the app on local machine**
1. Clone the repo.
2. Duplicate `.env.example` and fill out with your own environment variables.
3. Install the required NPM and Composer packages.
4. Set the application key with `php artisan key:generate`.
4. Populate the database tables and generate dummy data with `php artisan migrate --seed`.
5. Run `npm run dev` (or `yarn dev`) and `php artisan serve`.

**Sources:**
- [Font Awesome](https://fontawesome.com) - Icon fonts
- [loading.io](https://loading.io) - Loading SVGs