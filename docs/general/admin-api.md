---
sidebar_position: 4
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

# Admin API

Webhooks.uno offers a lightweight API to manage
Workspaces. This is called the Admin API.

It has some different behaviours than the rest
of the APIs, namely:

- It must never be exposed to the public (read below)
- All endpoints have the prefix `/admin/`
- Authorization is performed through a fixed token

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/admin/workspaces' },
{ m: 'GET', p: '/admin/workspaces/:id' },
{ m: 'POST', p: '/admin/workspaces' },
{ m: 'POST', p: '/workspaces/:id/rotate_api_key' }
]} />

> Note that the Admin API is only available when webhooks.uno API server
> is run with `ADMIN_ENABLED=true`

All endpoints require authorization. The admin auth token must be
sent along like follows:

```http
Authorization: Bearer $ADMIN_AUTH_TOKEN
```

Apart from listing and showing workspaces, the API allows to create
a workspace and to rotate its API key. 

### Create a Workspace

Call the `/admin/workspaces` endpoint with the following data:

```json
{
  "data": {
    "type": "receiver",
    "name": "dummy-receiver"
  }
}
```

`name` is the new workspace name. It must be unique across all workspaces.

`type` must be either `sender` or `receiver`. A `receiver` workspace
can only access API endpoints related to receiving webhooks and `sender`
can only access API endpoints related to sending webhooks.

To make it clear: a Workspace create with the `receiver` type can
never send webhooks.

When creating a workspace, its API key will be returned in the response 
payload. The API key will not be displayed again in any other request.
If you need to change the API key, see the next endpoint.

> Note: while it is technically possible to change attributes of a Workspace
> this is not yet supported due to goal of the Admin API being lightweight.

### Rotating Workspace API key

While technically possible for a Workspace to have multiple API keys
associated with it, this Admin API only allows a new API key to be
generated, while keeping the other API keys of a workspace active
for a given period. This was designed so that the Admin API could be
kept lightweight while also being suitable for most users.

Calling the `/workspaces/:id/rotate_api_key` endpoint
(where `:id` is the Workspace ID)
will create a new API key and mark all other existing API keys of that
Workspace to be expired.

The endpoint can receive the query parameter `expire_in_days`,
which defaults to `10` if omitted.

The endpoint will do the following:

1. If `expire_in_days` is omitted, set it to `10`
1. Fetch all API Keys for the given Workspace
1. Set their `expires_at` attribute to current time + `expire_in_days` days
1. Create a new random API key **without** expiration date
1. Return the newly created API key

This design allows a consumer of your API (likely a receiver Workspace)
to get a new API key and have enough time to update their servers 
configurations to use the new key without having downtime due to older
keys being expired too soon.

In case you need all other keys to be expired immediately, just
set `expire_in_days` to `0` (zero).

## Protecting the API

The Admin API is intended to be accessed by you who
are hosting webhooks.uno yourself and no one else.

To achieve this, two mechanisms are in place: an authorization token
and IP filtering. Also, it can be completely disabled.

It is configured by the following three environment variables in
the API server.

### `ADMIN_ENABLED`

If `true`, the Admin API is enabled. Otherwise, it's completely disabled.

Defaults to `false`.

### `ADMIN_AUTH_TOKEN`

The authorization token that must be passed through the `Authorization`
HTTP header when performing calls to the Admin API.

You should generate a long enough string to act as the token. It cannot
be left empty.

Defaults to an empty value, which is permitted as long as `ADMIN_ENABLED`
is also `false`.

### `ADMIN_ALLOW_FROM`

A comma separated allowlist of CIDRs that can consume the Admin API endpoints. 
Requests to the Admin API coming from IP addresses not included in any of the 
specified blocks will be rejected.

The default value is `127.0.0.0/8,[::1]/128`, which allows only
requests coming from localhost using IPv4 and IPv6.

Note that the filtering mechanism takes the `X-Forwarded-For` header
into account when performing filtering. This is to allow the whole
webhooks.uno API server to be publicly exposed to the internet
while securing the Admin API from bad actors.


