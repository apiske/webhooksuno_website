---
sidebar_position: 7
title: Topics
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> This documentation is focused for **webhook senders** but is also useful
> for the ones **receiving** them!

A topic is a logical channel to where webhook messages are sent to.
When someone wants to receive webhooks from your system, they will subscribe
to a set of topics.

## Understanding topics

Let's take, for example, a social network like Twitter. It could publish
webhooks to different events, like when a profile tweets, when someone
starts following a profile or also when a tweet is deleted.

Usually someone would be interested only in a certain set of events. For
instance, someone could be interested in receiving webhooks when someone
follows a profile, but not when a profile creates or deletes a tweet.

In that scenario, there could be three topics: The topic `tweet:created`,
`tweet:deleted` and `profile:new_follower`. Whomever is interested in
receiving webhooks when a new person follows a profile would subscribe
to the topic `profile:new_follower`. Also if they would be interested
in receiving a webhook each time a tweet is made, they would also subscribe
to the topic `tweet:created`.

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/v1/topics' },
{ m: 'GET', p: '/v1/topics/:id' },
{ m: 'POST', p: '/v1/topics' },
{ m: 'PUT', p: '/v1/topics/:id' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "public_description",
  type: "string",
  required: false,
  desc: `The description to your subscribers of what is published to this topic.`
},
{
  attr: "webhook_definition",
  type: "name|id",
  required: true,
  desc: `The WebhookDefinition object that determines behaviors for webhooks sent to this topic`
}
]} />
