---
sidebar_position: 4
title: Routing
---

# Webhook routing process

> This documentation is focused for **webhook senders**!

This page shows the whole routing from a publish request to its delivery
to the final destination.

The following diagram summarizes the routing flow. The flow starts
when you call the `/publish`.
See the following sections for more details on each step.

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

_Find all BindingRequests associated to the matched Routers_.

The matched Routers Step 1 are the input to this step.
Then, all [BindingRequests](/docs/resources/binding-requests) associated to
the Routers are fetched and proceed to the next step. No further
filtering is performed in this step.

## Step 3

_Find matching Subscriptions associated to the ReceiverBindings_.

From the BindingRequests, it's now possible to find all Subscriptions
attached to them. The entity that attaches a Subscriptions to a
BindingRequest is called a [ReceiverBinding](/docs/resources/receiver-bindings).

Additionally, for a Subscription to be matches it needs to satisfy two 
conditions:

1. The `topic` being published must be present in its `topics` attribute
1. The `state` attribute must be set to either `active` or `error`

**Note**: It is possible for ReceiverBindings to be manually disabled by the _sender_ of webhook messages.
Only ReceiverBindings that are not disabled are matched in this step.
See the documentation for the resource for more information.

> If the `state` attribute of the Subscription is `error`, it will be matched
> in this step. The reason is that messages will pile up while the receiving
> end is erroring and will be delivered after the `state` attribute goes
> back to `active`. This makes delivery reliable in case of temporary
> failures at the receiving end.

## Step 4

_For each Subscription, create a Message_.

There are no conditions/filters on this step. Every Subscription entity coming
from the last step will yield a Message resource.

Each Message is then enqueued to be delivered to its destination.

