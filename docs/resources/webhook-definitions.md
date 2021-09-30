---
sidebar_position: 8
title: Webhook definitions
---

> You only need this resource for **sending webhooks**, not for receiving them!

A webhook definition contains options that control the behavior of sending
webhooks, such a how many retries to be performed before giving up and that
are the http status codes the receiver can return for the delivery to be
considered successful.

Each [Topic](/docs/resources/topics) object is associated to a WebhookDefinition object.
This means the options defined in such webhook definition object will be
applied to webhooks published to that topic.

It is likely that a set of topics will share the same options and this is
the reason the WebhookDefinition object exist.

## Options

The following list shows all options that can be configured for a
WebhookDefinition object. Each one are explained in detail in the following
sections.

- Retry policy
- Data format (e.g. XML, JSON)
- Response codes

### Retry policy

A retry policy determines how many times the delivery of a webhook will be
retried before it be considered a failed delivery. It also determines how long to wait between delivery tentatives.

The retry policy is a JSON object and it has the following attributes:

**max\_retries** integer

Maximum number of retries (not including the initial delivery tentative)
allowed. If zero, no retries are performed.

**wait\_factor** integer

Base wait time, in seconds, between retry tentatives. The wait time between
uses an
[exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff)
strategy.




```json
{
  "max_retries": "integer, number of retries",
}
```

### Data format


### Response codes



## Topic object attributes

**id** (string)

The unique identifier for this object.

**name** (string)

The unique name for this object.

**public\_description** (string)

The description to your subscribers of what is published to this topic.

**webhook\_definition** (WebhookDefinition object reference)

A reference to a [WebhookDefinition](/docs/resources/webhook-definitions) object.

A WebhookDefinition object provides information
such as the payload data format (e.g. JSON, XML),
retry policies, response codes and others.
