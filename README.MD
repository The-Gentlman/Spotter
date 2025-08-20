# Ava Ertebat Sazan DJANGO SERVER

## Tech stack

We're using these in out application

### Important-Packages

- [Django-4.2.1](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Python-3.11](https://www.python.org/)

## Notable opinions and extensions

Django is an opinionated framework and I've added a few extra opinions based on
having Dockerized and deployed a number of Django projects. Here's a few (but
not all) note worthy additions and changes.

- **Packages and extensions**:

  - *[gunicorn](https://gunicorn.org/)* for server in both development and production
- **Linting and formatting**:
  -----------------------


  - *[black](https://github.com/psf/black)* is used to format the code base
- **Django apps**:

  - Add apps folder to contain all applications
  - Add common app for function and codes that works globaly
  - In some app you may see  *[services.py ]()* this contains Notification and History System code
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
git https://github.com/ava/server.git
cd server
```

#### Copy an example .env file because the real one is git ignored:

```sh
cp .env.example .env.dev
```

    change the name to .env.dev

#### Build everything:

*The first time you run this it's going to take 5-10 minutes depending on your
internet connection speed and computer's hardware specs. That's because it's
going to download a few Docker images and build the Python + apt dependencies.*

```sh
make dev/run
```

Now that everything is built and running we can treat it like any other Django
app.

Did you receive a `depends_on` "Additional property required is not allowed"
error? Please update to at least Docker Compose v2.24.6+ or Docker Desktop
25.0.3+.

Did you receive an error about a port being in use? Chances are it's because
something on your machine is already running on port 8000. Check out the docs
in the `.env` file for the `DOCKER_WEB_PORT_FORWARD` variable to fix this.

Did you receive a permission denied error? you may need to check the .env file and fill
ALLOWD HOST if you face same error again just down the server and run it again.

#### Setup the initial database:

```sh
# You can run this from a 2nd terminal.
make dev/migrate
```

#### Check it out in a browser:

Visit [http://localhost:8000](http://localhost:8000) in your favorite browser.

You should see Ava Server

#### Connection To Fronend of this application:

You should go to ./server/.env file

and add requested ip addreses to DJANGO_ALLOWED_HOSTS

#### Stopping everything:

```sh
# Stop the containers and remove a few Docker related resources associated to this project.
make dev/down
```

## Files of interest

I recommend checking out most files and searching the code base for `TODO:`,
but please review the `.env` and `run` files before diving into the rest of the
code and customizing it.

### `.env`

This file is ignored from version control so it will never be commit. There's a
number of environment variables defined here that control certain options and
behavior of the application.




