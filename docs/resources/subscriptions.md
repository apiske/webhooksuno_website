---
sidebar_position: 5
title: Subscriptions
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> You only need this resource for **receiving webhooks**, not for sending them!

A Subscription listens to webhook messages and delivers them to the
Subscription's destination.

When a Subscription is created, a [Binding](/docs/resources/bindings) ID must be
specified. The Subscription will be bound to it and will listen to webhook
messages published to that Binding.

### Listening to topics

A Subscription only listens to the topics specified in the Subscription's `topics` attribute.
If that attribute is set to all available topics that an Binding offers,
then it will effectively listen to all published webhook messages of an
Binding.
If the `topics` attribute is an empty array, the Subscription will not
listen to any webhook messages, meaning that it will also not deliver
any webhooks.


### Webhook delivery

Webhook messages are delivered via HTTPS POST requests to the `destination_url`
attribute of the Subscription.

Each published webhook message generates one POST request. An exception
to this rule is when the server at `destination_url` fails to properly
receive the request, in which case the webhook message could then be
re-delivered multiple times until a delivery succeeds.
See the [Retrying](/docs/sending-webhooks/retrying-deliveries) page for more information.

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/subscriptions' },
{ m: 'GET', p: '/subscriptions/:id' },
{ m: 'POST', p: '/subscriptions' },
{ m: 'PUT', p: '/subscriptions/:id' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "binding",
  type: "name|id",
  required: true,
  desc: `The Binding to be used as the source of webhooks`
},
{
  attr: "key",
  type: "name|id",
  required: true,
  desc: `The Key used to sign webhooks`
},
{
  attr: "topics",
  type: "array[name|id]",
  required: true,
  desc: `A list of Topics this subscription will respond to`
},
{
  attr: "destination_url",
  type: "URL",
  required: true,
  desc: `The URL where webhooks will be delivered to`
}
]} />


