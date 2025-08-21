# Spotter Project

# Important-Packages

- [Django-4.2.1](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Python-3.11](https://www.python.org/)
- [React](https://github.com/vitejs/vite-plugin-react "React Repository")

## Notable opinions and extensions

Django is an opinionated framework and I've added a few extra opinions based on
having Dockerized and deployed a number of Django projects. Here's a few (but
not all) note worthy additions and changes.

- **Linting and formatting**:
- - *[black](https://github.com/psf/black)* is used to format the code base
- **Django apps**:

  - Add apps folder to contain all applications
  - Add common app for function and codes that works globaly
- **Config**:

  - Log to STDOUT so that Docker can consume and deal with log output
  - Extract a bunch of configuration settings into environment variables
  - `src/config/settings.py` and the `.env` file handles configuration in all environments

Besides the Django app itself:

- Docker support has been added which would be any files having `*docker*` in
  its name
- GitHub Actions have been set up
- A `requirements.txt` file has been introduced using `pip3`. The
  management of this file is fully automated by the commands found in the `run`
  file. We'll cover this in more detail when we talk about [updating
  dependencies](#updating-dependencies).

## Running this app

You'll need to have [Docker installed](https://docs.docker.com/get-docker/).
It's available on Windows, macOS and most distros of Linux. If you're new to
Docker and want to learn it in detail check out the [additional resources
links](#learn-more-about-docker-and-django) near the bottom of this README.

You'll also need to enable Docker Compose if you're using Docker
Desktop. On native Linux without Docker Desktop you can [install it as a plugin
to Docker](https://docs.docker.com/compose/install/linux/). It's been generally
available for a while now and is stable. This project uses specific [Docker
Compose v2
features](https://nickjanetakis.com/blog/optional-depends-on-with-docker-compose-v2-20-2)
that only work with Docker Compose v2 2.20.2+.

If you're using Windows, it will be expected that you're following along inside
of [WSL or WSL
2](https://nickjanetakis.com/blog/a-linux-dev-environment-on-windows-with-wsl-2-docker-desktop-and-more).
That's because we're going to be running shell commands. You can always modify
these commands for PowerShell if you want.

#### Clone this repo anywhere you want and move into the directory:

```sh
git clone https://github.com/The-Gentlman/Spotter.git
cd Spotter
```

```sh
make up # this will run whole project 
```

    change the name to .env.dev

#### Build everything:

```sh
# I also added a template database for this project
# in make file after you run project simply run 
make restore

# and run project again
```

Now that everything is built and running we can treat it like any other Django
app.

Setup the initial database:

```sh
# You can run this from a 2nd terminal.
make migrate
```

#### Check it out in a browser:

Visit [http://localhost:8000](http://localhost:8000) in your favorite browser.

You should see Spotter Server

#### Connection To Fronend of this application:

Visit [http://localhost:3000](http://localhost:3000) in your favorite browser.Stopping everything:

## Files of interest

I added another application for file uploading, but due to the short amount of time I had, I didn’t get a chance to implement it in the frontend as well.

I also added an authentication system based on users and their roles, but it hasn’t been implemented in the frontend, and the authentication system in the backend is currently commented out.

After uncommenting the authentication system, this app will not work unless a session exists in the request and Django can identify the user.
