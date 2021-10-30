---
sidebar_position: 4
title: Routing
---

# Webhook routing process

> This documentation is focused for **webhook senders**!

This page shows the whole routing from a publish request to its delivery
to the final destination.

The following diagram summarizes the routing flow. The flow starts
when the `/publish` endpoint is called.
See the sections below for more details on each step.

![](/img/webhook_routing_1.svg)

## Step 1

_Find all Routers matching the filtering criteria_.

The first step fetches all [Routers](/docs/resources/routers) that
match a certain filtering criteria.

In a nutshell, the filtering criteria looks at the Router's `allowed_topics`
and its associated [Tags](/docs/resources/tags), matching them against the parameters used to
publish the webhook.
See the _Filtering criteria_ section in the [Routers page](/docs/resources/routers) for more information.

The Routers that were matches then proceed to the next step.

## Step 2

_Find matching Subscriptions associated to the ReceiverBindings_.

From the Routers, it's now possible to find all Subscriptions
attached to them. The entity that attaches a Subscriptions to a
Router is called a [ReceiverBinding](/docs/resources/receiver-bindings).

> **Note**: From the receiver end perspective, the ReceiverBinding object
> is just called Binding. It is the same object, but different attributes
> are visible for each side.

For a Subscription to be matched it has to simultaneously
satisfy two  conditions:

1. The `topic` being published must be present in its `topics` attribute
1. The `state` attribute must be set to either `active` or `error`

**Note**: It is possible for ReceiverBindings to be manually disabled by the _sender_ of webhook messages.
Only non disabled ReceiverBindings are matched in this step.
See [its documentation](/docs/resources/receiver-bindings) for
more information.

> **A note on the Subscription's state attribute**
> 
> If the `state` attribute of the Subscription is `error`, it will be matched
> in this step. The reason is so that messages can pile up while the receiving
> end is erroring in order to be delivered after the `state` attribute goes
> back to `active`. This allows for reliable deliveries in case of temporary
> failures on the receiving end.

## Step 3

_For each Subscription, create a Message_.

There are no conditions/filters on this step. Every Subscription entity coming
from the last step will yield a Message resource.

Each Message is then enqueued to be delivered to its destination.

## Step 4

_Deliver all created Messages_.

All Messages created in the previous step are enqueued for delivery.

When a delivery fails and is further retried
(as in [Retrying deliveries](/docs/sending-webhooks/retrying-deliveries)),
its delivery starts from this very step. Thus, a webhook message never goes
through routing steps 1 to 3 more than once, but can go many times through
step 4 until its delivery is considered either successful or failed.

