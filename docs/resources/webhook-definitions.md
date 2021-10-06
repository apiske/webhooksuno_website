---
sidebar_position: 8
title: Webhook definitions
---

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