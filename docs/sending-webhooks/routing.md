---
sidebar_position: 4
title: Routing
---

# Webhook routing process

> This documentation is focused for **webhook senders**!

This page shows the whole routing from a publish request to its delivery
to the final destination.

The following diagram summarizes the routing flow. The "publish webhook" is
the trigger and it represents the `/publish` API endpoint.
Note that these steps do not take place synchronously in that endpoint.

The steps are detailed in the next sections.

![](/img/webhook_routing_1.svg)

## Step 1

_Find all Routers matching the filtering criteria_.

The first step fetches all [Routers](/docs/resources/routers) that match certain
filtering criteria.

In a nutshell, the filtering criteria looks at the Router's `allowed_topics`
and its associated [Tags](/docs/resources/tags), matching them against the parameters used to
publish the webhook.
See the _Filtering criteria_ section in the [Routers page](/docs/resources/routers) for
more detail.

The matched Routers then proceed to the next step.

## Step 2

_Find all BindingRequests associated to the matched Routers_.

The matched Routers from the previous step come to this step.
Then all [BindingRequests](/docs/resources/binding-requests) associated to
the Routers are fetched and proceed to the next step. No further
filtering is performed in this step.

## Step 3

_Find matching Subscriptions associated to the ReceiverIntegrations_.

Matching Subscriptions are those listening to the published topic.
They also have to be associated to the ReceiverIntegrations that came
from the previous step.

## Step 4

_For each Subscription, create a Message_.

Matching Subscriptions are those listening to the published topic.
They also have to be associated to the ReceiverIntegrations that came
from the previous step
