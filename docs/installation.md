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
export APP_RJOB_MAX_THREADS=8 ; \
export ADMIN_ENABLED=true ; \
export ADMIN_ALLOW_FROM='0.0.0.0/0,[::]/0' ; \
export ADMIN_AUTH_TOKEN=secretadmintoken
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
  -e ADMIN_ENABLED=$ADMIN_ENABLED \
  -e ADMIN_ALLOW_FROM=$ADMIN_ALLOW_FROM \
  -e ADMIN_AUTH_TOKEN=$ADMIN_AUTH_TOKEN \
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

After having it all running, you won't have any data. You don't
even have any API keys to perform calls!

To begin playing with webhooks.uno, you will need at least one sender
workspace and one receiver workspace.
To provision workspaces, we will use the [Admin API](/docs/general/admin-api).

The Admin API is served under the `/admin/` prefix and is protected
by a token. If you've been following the steps above, the token
should be `secretadmintoken`. It goes along in the `Authorization`
header like this: `Authorization: Bearer secretadmintoken`.

To start playing with webhooks.uno, you will need at least two workspaces:
a sender and a receiver. You can create the sender via the following API call:

(Note: the `http` command refers to the [httpie CLI](https://httpie.io/cli))

```shell
http --json POST http://localhost:3005/admin/workspaces \
  Authorization:'Bearer secretadmintoken' \
  data:='{
    "type": "sender",
    "name": "dummy-sender"
  }'
```

This will create a sender Workspace named `dummy-sender`.
The response body will look something like:

```
{
  "data": {
    "api_key": "SRalRn/hldc8NVlMWrUvPaLonH1k2851D0nn/kbS/kuazjK4mtJt2/jAOYtrH/kLvY5UZqnP9HoiDSpW1feDdFd7brH8PtNMX+z+4SCnEqVUY64aBW454IJA2YFa3tjXGsndjxizrr40/ravHlB9HX0AaY67YTOR8vaakj/MlKU=",
    "id": "69699e68-f0b1-4e3b-bd4c-e8b9cf05d444",
    "name": "dummy-sender"
  }
}
```

Write down that API Key since it won't be displayed again.
Use it to authorize with the API endpoints to
[send webhooks](/docs/sending-webhooks/quick-start).

Now to create a receiver, run the following:

```shell
http --json POST http://localhost:3005/admin/workspaces \
  Authorization:'Bearer secretadmintoken' \
  data:='{
    "type": "receiver",
    "name": "dummy-receiver"
  }'
```

The response body will be just like the previous one, just with different
values, of course. You may then use the returned API key to authorize
with the API endpoints to
[receive webhooks](/docs/receiving-webhooks/quick-start).

