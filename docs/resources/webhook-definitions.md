---
sidebar_position: 8
title: Webhook definitions
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> You only need this resource for **sending webhooks**, not for receiving them!

A webhook definition contains options that control the behavior of sending
webhooks, such a how many retries to be performed before giving up.

Each [Topic](/docs/resources/topics) object is associated to a WebhookDefinition object.
This means the parameters defined in such webhook definition object will be
applied to webhook messages published to that topic.

It is likely that a set of topics will share the same options and this is
the reason the WebhookDefinition object exist.

See the [Retrying deliveries](/docs/sending-webhooks/retrying-deliveries)
page for the relevant attributes of a WebhookDefinition.

> Currently the `retry_*` attributes are the only relevant attributes. Other attributes
> are planned and may become part of this object.

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/v1/webhook_definitions' },
{ m: 'GET', p: '/v1/webhook_definitions/:id' },
{ m: 'POST', p: '/v1/webhook_definitions' },
{ m: 'PUT', p: '/v1/webhook_definitions/:id' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "description",
  type: "string",
  required: false,
  desc: `The description of this webhook definition`
},
{
  attr: "retry_wait_factor",
  type: "integer",
  required: false,
  desc: `The retry factor. Read above for more information`
},
{
  attr: "retry_max_retries",
  type: "integer",
  required: false,
  desc: `How many retries before the webhook is considered failed`
}
]} />
