# test-precondition
test-precondition is a service for satisfying preconditions for different test scenarios

# environment variables
please create a .env file in the root directory of the project with the content from 1password QA vault -> test-precondition .env

## Installation
For installation, you can run the script below:

```bash
./setup_local.sh
```

it is supposed to install all the necessary dependencies for the project as well as run the docker container with the database, 
run migrations and seed the database with the data.
