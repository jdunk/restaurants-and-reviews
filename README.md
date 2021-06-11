# Restaurants & Reviews

This is a Yelp clone that I wrote using Next.js, React, MongoDB, and Node (basically a MERN stack except I'm using Next.js instead of Express).

Unlike default Next.js, it's a SPA (Single Page Application) for maximum speed and responsiveness.

It includes a REST api, and makes use of Material UI, Axios, Mongoose, and Jest.

Its stability is supported by a suite of Postman functional tests.

## Features

### User signup

* Name and Password minimum lengths enforced
* Email must be unique
* Role required (Restaurant Owner or Regular user)
* bcrypt password hashing

### Authentication

* JWT-based
* token stored in http-only secure cookie

### Authorization / Permissions

* Admin accounts cannot be created via the signup form
* A CLI script is provided to grant admin privileges to an existing user account
* Only admin users can see a list of all users
* Only "Owner" users can create restaurants (wip)
* Only regular users are allowed to leave reviews (wip)
* Only admin users can delete/edit users (wip)
* Admin users can delete any review and/or restaurant (wip)
* User must be logged in to view restaurants/ratings
* Owners can delete/edit their own restaurants (wip)
* Regular users can delete (but not edit) their own reviews (wip)

### Restaurant Listings (wip)

* Can be sorted by average rating, or alphabetically

### Restaurant Detail (wip)

* Average rating
* List of reviews
