---
sidebar_position: -1
---

# Installation

To run webhooks.uno, you will need to have Docker running on your machine.

> The only officially supported way to install webhooks.uno is through
> docker containers.

### Requirements

Webhooks.uno requires a PostgreSQL database and a Redis instance running.

This guide shows how to get those running in docker containers. Note that
while deploying databases in containers is fine for a development or testing
environment, **we do not recommend** it for production deployment.

### Docker network

Let's create a network in Docker for the deployment of webhooks.uno.
Create it with the following command:

```
docker network create uno-net
```

### Redis instance

Run a Redis instance with the following command:

```
docker run -ti --name uno-redis --network uno-net redis:6
```

### PostgreSQL database

Run a PostgreSQL database instance with the following command:

```
docker run -ti \
  --network uno-net \
  --name uno-db \
  -e POSTGRES_PASSWORD=muchsecret \
  -e POSTGRES_USER=unouser \
  -e POSTGRES_DB=uno \
  postgres:13
```

You may change the database credentials as you wish. The ones used here
are not safe and are used only to make this deployment easier.

### Prepare environment variables 

You will need the following environment variables when running the
webhooks.uno docker container.
Webhooks.uno runs two containers: one for its API server and another
for its workers (which process the webhook sending in an asynchronous way).
Thus, we recommend running the following in two separate terminal windows
(or shell sessions):

```
export DATABASE_USER=unouser ; \
export DATABASE_PASSWORD=muchsecret ; \
export DATABASE_HOST=uno-db ; \
export DATABASE_PORT=5432 ; \
export DATABASE_NAME=uno ; \
export APP_RJOB_URL="redis://uno-redis:6379/1" ; \
export APP_RJOB_MAX_THREADS=8
```

### Initialize the database

In order to run the webhooks.uno workers and API server, the database must
first be initialized. The following command will initialize the database:

```
docker run --rm -ti \
  --network uno-net \
  -e DATABASE_USER=$DATABASE_USER \
  -e DATABASE_PASSWORD=$DATABASE_PASSWORD \
  -e DATABASE_HOST=$DATABASE_HOST \
  -e DATABASE_PORT=$DATABASE_PORT \
  -e DATABASE_NAME=$DATABASE_NAME \
  -e APP_RJOB_URL=$APP_RJOB_URL \
  -e APP_RJOB_MAX_THREADS=$APP_RJOB_MAX_THREADS \
  webhooksuno/webhooksuno:latest migrate
```

This is a one-off job. It is also reentrat, thus it is safe to run it
many times.

### Run webhooks.uno worker

In order for webhooks to be dispatched, the asynchronous workers are needed.
You can run an instance of a worker with the following command:

```
docker run --rm -ti \
  --name uno-worker \
  --network uno-net \
  -e DATABASE_USER=$DATABASE_USER \
  -e DATABASE_PASSWORD=$DATABASE_PASSWORD \
  -e DATABASE_HOST=$DATABASE_HOST \
  -e DATABASE_PORT=$DATABASE_PORT \
  -e DATABASE_NAME=$DATABASE_NAME \
  -e APP_RJOB_URL=$APP_RJOB_URL \
  -e APP_RJOB_MAX_THREADS=$APP_RJOB_MAX_THREADS \
  webhooksuno/webhooksuno:latest worker
```

### Run webhooks.uno API server

The following command runs the API server and exposes it on port 3005:

```
docker run --rm -ti \
  --name uno-api \
  --network uno-net \
  -e DATABASE_USER=$DATABASE_USER \
  -e DATABASE_PASSWORD=$DATABASE_PASSWORD \
  -e DATABASE_HOST=$DATABASE_HOST \
  -e DATABASE_PORT=$DATABASE_PORT \
  -e DATABASE_NAME=$DATABASE_NAME \
  -e APP_RJOB_URL=$APP_RJOB_URL \
  -e APP_RJOB_MAX_THREADS=$APP_RJOB_MAX_THREADS \
  -p 3005:8080 \
  webhooksuno/webhooksuno:latest api
```

You should now be able to perform API calls on your machine at
`http://localhost:3005`. Have fun!

### Use TLS in webhooks.uno API server (optional)

If you wish to run the API server with TLS enabled, you have to:

1. Set the `TLS_ENABLED` environment variable to `true`
2. Mount the certificate and its private key somewhere
3. Set the `TLS_CERT_PATH` and `TLS_KEY_PATH` environment variables
   to the certificate path and its key, respectively.

For instance, you would add the following lines to the `docker run`
command of the API server:

```
  -e TLS_ENABLED=true \
  -e TLS_KEY_PATH=/uno/certs/api_tls_cert.key \
  -e TLS_CERT_PATH=/uno/certs/api_tls_cert.pem \
  -v /var/webhookuno_certs:/uno/certs \
```

### Create workspaces

After having it all running, you won't have any data. That is, you don't
have API keys to perform calls!

To begin playing with webhooks.uno, you will need at least one sender
account and one receiver workspace.
As of now, the only way to create a workspace is by running a command
using docker containers.

The docker command below creates a workspace. It requires you to pass
a workspace name through the `UNO_WORKSPACE_NAME` environment variable.
Workspace names must be unique across a webhooks.uno installation.

A workspace can be either used for sending webhooks or for receiving webhooks.

To create a sender workspace, set the `WORKSPACE_TYPE` environment variable
to `sender`. To create a receiver workspace, set it to `receiver`.

For instance, to create a sender workspace named `dummy-sender`, export the variable with:

```
export UNO_WORKSPACE_NAME=dummy-sender
export WORKSPACE_TYPE=sender
```

then run:

```
docker run --rm -ti \
  --network uno-net \
  -e DATABASE_USER=$DATABASE_USER \
  -e DATABASE_PASSWORD=$DATABASE_PASSWORD \
  -e DATABASE_HOST=$DATABASE_HOST \
  -e DATABASE_PORT=$DATABASE_PORT \
  -e DATABASE_NAME=$DATABASE_NAME \
  -e APP_RJOB_URL=$APP_RJOB_URL \
  -e APP_RJOB_MAX_THREADS=$APP_RJOB_MAX_THREADS \
  -e UNO_WORKSPACE_NAME=$UNO_WORKSPACE_NAME \
  webhooksuno/webhooksuno:latest create-$WORKSPACE_TYPE
```

An API key to access it will be displayed in the output. Copy that key
as it won't be displayed in the future anymore.
