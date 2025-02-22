# Social Media Mini Project

A simple social media application built with Node.js, Express, and MongoDB that allows users to create profiles, make posts, and interact with other users' content.

## Features

- User Authentication (Login/Register)
- Profile Management
- Profile Picture Upload
- Post Creation
- Post Likes
- Responsive UI with Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **View Engine**: EJS
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js
- MongoDB Atlas Account
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd MiniProject
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Available Routes

### Authentication Routes
- `GET /register` - Registration page
- `POST /register` - Create new account
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Profile Routes
- `GET /profile` - View your profile and posts
- `GET /profile/upload` - Profile picture upload page
- `POST /upload` - Upload profile picture

### Post Routes
- `POST /post` - Create a new post
- `GET /like/:id` - Like a post
- `GET /unlike/:id` - Unlike a post

## Directory Structure

```
MiniProject/
├── config/
│   └── multerconfig.js
├── models/
│   ├── post.js
│   └── user.js
├── public/
│   └── images/
│       └── uploads/
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── profileupload.ejs
│   └── register.ejs
├── app.js
├── package.json
└── .env
```

## Features in Detail

### User Authentication
- Secure password hashing using bcryptjs
- JWT-based session management
- Protected routes using middleware

### Profile Management
- Custom profile picture upload
- Default profile picture for new users
- Profile information display

### Posts
- Create text-based posts
- View posts on profile
- Like/Unlike functionality
- Chronological post sorting

## Security Features

- Password hashing
- JWT token-based authentication
- Protected routes
- Secure file upload handling
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
