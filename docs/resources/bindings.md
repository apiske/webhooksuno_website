---
sidebar_position: 2
title: Bindings
---

> This documentation is focused for **webhook receivers** but is also useful for the ones **sending** them!

A Binding connects a Router to the external world. This means it connects a webhook sender to those is interested
in receiving them.

In order to be able to receive webhooks, you will need to create a
[Subscription](/docs/resources/subscriptions) object. To do that, you will need to get
a Binding instance, since a Subscription is connected to a Binding.

To get a Binding instance, someone has to provide you an "Binding
ID" or an "Binding Request ID. Once you activate it, by calling the
binding activation API endpoint, you will have a Binding instance
associated with your Workspace.

> The terms "Binding" and "Binding Request" may be used
interchangeably. "Binding Request" is the name from the Sender's
perspective, while "Binding" is mostly used from the Receiver's
perspective.

## Usage

To activate a Binding, you may call the activation endpoint:

```http
POST <WEBHOOKS_UNO_URL>/v1/binding/activate/:binding_id
```

An example response is as follows:

```json
{
  "data": {
    "status": "valid",
    "binding_id": "833d991a-00c8-45fe-9b14-49a62974313a"
  }
}
```

If the activation is successful, the response will have the HTTP status
code 201 and its payload data will have the `status` attribute set to
`valid`. The `binding_id` returned in the body is always the same
as the `binding_id` parameters in the URL.

A Binding can only be activated once for a Workspace. Trying to
activate it again will result in a response with the HTTP status code 409
and the `status` attribute set to `used`.
An example response body for this scenario is:

```json
{
  "data": {
    "status": "used",
    "message": "The binding has already been activated",
    "binding_id": "833d991a-00c8-45fe-9b14-49a62974313a"
  }
}
```

### List all Binding topics

After a Binding is activated, you may use it to create new
[Subscription](/docs/resources/subscriptions) objects.
When creating a Subscription you will have to specify which topics it will
listen to. You may get a list of the existing topics for a given Binding
by calling the list\_topics endpoint:

```
GET <WEBHOOKS_UNO_URL>/v1/binding/:binding_id/list_topic
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
