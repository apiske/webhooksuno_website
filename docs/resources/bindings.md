---
sidebar_position: 2
title: Bindings
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> This documentation is focused for **webhook receivers** but is also useful for the ones **sending** them!

A Binding connects to a Router object to receive webhooks messages.

Once a Binding is created, [Subscription](/docs/resources/subscriptions)
objects associated to the binding can be created to start receiving
webhook messages.

To understand more about why Subscriptions are not attached directly to Routers
and why Bindings are necessary, see the [Why Bindings](/docs/general/why-bindings) page.

## Usage

To create a Binding, you must have a router ID in hands. This will
likely be handed to you by the webhook sender end.

Then, create the Binding using the following request:

```http
POST <WEBHOOKS_UNO_URL>/v1/bindings
```

with the following body payload:

```json
{
  "data": {
    "router_id": "1d7a60ac-8268-457b-9873-21520dbfb36c"
  }
}
```

An example response is as follows:

```json
{
  "data": {
    "id": "833d991a-00c8-45fe-9b14-49a62974313a",
    "router_id": "1d7a60ac-8268-457b-9873-21520dbfb36c",
    "status": "active"
  }
}
```

If creation is successful, the response will have the HTTP status
code 201 Created.

There can be only one Binding between a Workspace and Router pair. Thus,
performing the request above with the same parameters more than once will
always result in a 409 Conflict HTTP status code.

### List available topics

After a Binding is created, it may be used to create new
[Subscription](/docs/resources/subscriptions) objects.
When creating a Subscription you will have to specify which topics it will
listen to. You may get a list of the existing topics for a given Binding
by calling the following endpoint:

```
GET <WEBHOOKS_UNO_URL>/v1/bindings/<BINDING_ID>/topics
```

The response body will contain an array with each topic and its description.
An example response body is as follows:

```json
{
  "data": [
    {
      "id": "eba7debb-7fc6-4d4b-8c59-f54811abe252",
      "name": "new_episode",
      "description": "Fired when a new episode is published"
    },
    {
      "id": "bbbef624-6902-42b6-ba0a-7c87453ca443",
      "name": "periodic_check",
      "description": "Fired whenever a periodic check is performed, regardless of its results"
    }
  ]
}
```

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/v1/bindings' },
{ m: 'GET', p: '/v1/bindings/:id' },
{ m: 'POST', p: '/v1/bindings' },
{ m: 'GET', p: '/v1/bindings/:id/topics' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "router_id",
  type: "string",
  required: true,
  desc: `The ID of the router to bind to`
}
]} />


