---
sidebar_position: 1
title: Quick start
---

To start receiving webhooks, you will need:

1. An API key
2. A binding request ID (`binding_id`)
3. An URL to where webhooks.uno is hosted

If you are integrating with some application, they
should have provided all those details to you.

The binding request ID is the invitation for you to
start receiving webhooks from them! You just need to
activate it. You can activate it with a HTTP call:

```shell
curl -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  <WEBHOOKS_UNO_URL>/bindings/<BINDING_ID>/activate
```

The response code will be `200 OK` and it means you can now start
receiving webhooks! Note: if you perform the same request again,
you will get a `409 Conflict` response, informing you that this
binding is already activated.

### Subscribe to topics

To receive webhooks, you have to create a Subscription object.
It will subscribe to an array of topics and will deliver webhooks
to an URL that you inform.

To get a list of the topics a binding request offers, you can call:

```shell
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
 <WEBHOOKS_UNO_URL>/bindings/<BINDING_ID>/topics
```

As an example, let's consider the response payload to be the following:

```json
{
  "data": [{
      "id": "f9e6c5fb-53e7-488c-8798-d81f660d6198",
      "name": "periodic_check",
      "description": "Fired when a peridoc check is performed, regardless of whether there are new episodes or not"
    },
    {
      "id": "c0c5b6de-c6f1-4a25-aa71-e59e7ae7c158",
      "name": "new_episode",
      "description": "Fired when a new episode is available"
    }
  ]
}
```

In this example, there are two topics you can subscribe to:
`periodic_check` and `new_episode`.

To subscribe to both of them, you would perform the following HTTP
request:

```shell
curl -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  <WEBHOOKS_UNO_URL>/bindings/<BINDING_ID>/activate
```
