## EmaJons ##
### Introduction: ###
This is a portfolio website for artist EmaJons built using the *MERN* stack.  
I have used this project as a gym to try out new technologies and learn different approaches.

### Requirements: ###
- Artist can create or edit post:
  - add/remove images and videos
  - add/edit title, subtitle, description
  - add/delete tags

- Simple, intuitive navigation for the user
  - see posts by category
  - filter posts by tag
  - visualize post content with image/video slider
  - see artist's info
  - see contacts

### Dev environment instructions: ###
To set up the development environment using Docker containers, follow these steps:

1. In the `server/seed.js` file, replace `process.env.SUPERPW` with your desired password at line:
  ```sh
  const hashedPassword = await bcrypt.hash(process.env.SUPERPW, 10)
  ```
2. In the same file, replace `process.env.SUPERUSER` with your desired username at line:
  ```sh
  username: process.env.SUPERUSER
  ```
3. Build and run Docker images, containers, volumes
  ```sh
  docker compose up
  ```
4. Seed the database
  ```sh
  docker compose run server node seed.js
  ```
