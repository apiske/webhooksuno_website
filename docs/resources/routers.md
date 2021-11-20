---
sidebar_position: 4
title: Routers
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> You only need this resource for **sending webhooks**, not for receiving them!

A Router exposes webhook messages and topics to the external world.

When a webhook message is sent to a certain topic, all routers that route
that topic will deliver the message to its subscribers.

The routing process is illustrated by the following diagram. It starts with a
webhook being published:

![](/img/basic_webhook_flow_1.svg)

In the diagam, the first step when a webhook is published is to
**find all routers**. Those routers will then be matched against
a **filtering criteria** and the ones that pass the filtering will proceed
to the next step.

The last step is then to send the webhook to all the subscribers of each
router that passed the filtering. This step is depicted here as only one
step for the sake of simplification, but it includes its own sub-steps.
You can see how the full routing of a webhook works in the
[Routing](/docs/sending-webhooks/routing) page.

### Filtering criteria

A router acts as a filter, determining to whom a webhook will
be delivered. The filtering is run for each router.
It follows these steps:

**First**: the routers's `allowed_topics` must include the webhook `topic`
parameter.

**Second**: if the webhook was published with the `include_tags` optional parameter,
then at least one of the routers's `tags` must also be present in the
`include_tags` parameter.

**Third**: if the webhook was published with the `exclude_tags` optional parameter,
the router's `tags` must not contain any tag included in the
`exclude_tags` parameter.

If all three criteria above pass, the subscribers associated to
the router will then receive the published webhook.

The second a third steps include preconditions (_"if the webhook..."_). If
the preconditions evaluate to false, the step is considered as passed.
Please [Using tags](/docs/sending-webhooks/overview#using-tags) section if you are in doubt
about this.

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/routers' },
{ m: 'GET', p: '/routers/:id' },
{ m: 'POST', p: '/routers' },
{ m: 'PUT', p: '/routers/:id' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "allowed_topics",
  type: "array[string]",
  required: true,
  desc: `A list of topics that this router will route`
},
{
  attr: "tags",
  type: "array[string]",
  required: true,
  desc: `A list of tags associated with this router.
  Used for filtering when sending webhooks. See more details above`
}
]} />


