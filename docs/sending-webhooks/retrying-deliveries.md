---
sidebar_position: 3
title: Retrying deliveries
---

> This documentation is focused for **webhook senders** but is also useful
> for the ones **receiving** them!

Sometimes the delivery of a webhook fails. This can happen due to several
reasons. To list a few:

- The receiver returned an invalid status code (like 4xx or 5xx status codes)
- The receiver's servers are down
- The DNS failed to resolve the consumer's host
- The receiver's servers are experienced an unusual traffic spike and
  cannot handle more requests

The highest priority on such scenarios is to not drop any webhooks in order 
to avoid losing data. This is achieved by having a retry mechanism in place. 
Webhooks.uno automatically retries failed deliveries by default.

Nevertheless, you can control a few options of the retry mechanism
in the
[WebhookDefinition](/docs/resources/webhook-definitions).

## The retry mechanism

When an attempt to deliver a webhook message to a receiver fails,
the webhook message will be preserved and delivery will be performed
again in the future. Parameters such as for how long delivery is attempted
before being considered failed are configured by the WebhookDefinition.

A WebhookDefinition is associated to a Topic object. Thus, it is possible
to have distinct retry behaviors for individual topics.

This retry mechanism is configured by two attributes of the WebhookDefinition.
They are:

- `retry_wait_factor` A multiplier value that controls for how long
  and how often delivery will be retried
- `retry_max_retries` The maximum amount of retries before considering
  the delivery failed

### Wait time

The time to wait between each attempt is calculated based on the
`retry_wait_factor` attribute. The `wait_time` is calculated by the
equation below. This time is calculated after a delivery attempt fails
and it is the time, in seconds, to wait before attempting
delivery again.

```
wait_time = retry_wait_factor*30 +
            2**(attempt_counter*(retry_wait_factor/100)) +
            rand(60)
```

where:

- `attempt_counter` is the number of the attempt
- `retry_wait_factor` a multiplier value
- `rand(60)` is a random factor. An integer within 0 to 59 seconds
- `**` is the exponentiation operator

The value of `attempt_counter` starts from 1 and goes up to
`retry_max_retries`. The first delivery attempt is not considered a
retry, which means the first retry attempt only
occurs after the webhook delivery failed at least once.

The `retry_wait_factor` must be an integer `>= 10` and `<= 200`.

The following table shows the wait times for wait factors
(denoted `f`) of 100 and 150. You can use this table as a reference
when adjusting your values. The random factor is considered zero.

| Attempt | f=100 wait | f=100 accum time\* | f=150 wait | f=150 accum time\* |
| ----- | -------- | -------------- | -------- | ------------- |
| 1 | 32s | 32s | 32s | 32s |
| 2 | 1m 4s | 1m 36s | 1m 8s | 1m 40s |
| 3 | 1m 38s | 3m 14s | 1m 52s | 3m 32s |
| 4 | 2m 16s | 5m 30s | 3m 4s | 6m 36s |
| 5 | 3m 2s | 8m 32s | 5m 31s | 12m 7s |
| 6 | 4m 4s | 12m 36s | 11m 32s | 23m 39s |
| 7 | 5m 38s | 18m 14s | 27m 38s | 51m 17s |
| 8 | 8m 16s | 26m 30s | 1h 12m | 2h 3m |
| 9 | 13m 2s | 39m 32s | 3h 17m | 5h 21m |
| 10 | 22m 4s | 1h 1m | 9h 11m | 14h 32m |
| 11 | 39m 38s | 1h 41m | 1d 1h | 1d 16h |
| 12 | 1h 14m | 2h 55m | 3d 0h | 4d 17h |
| 13 | 2h 23m | 5h 18m | 8d 14h | 13d 7h |
| 14 | 4h 40m | 9h 58m | 24d 6h | 37d 14h |
| 15 | 9h 13m | 19h 12m | 68d 15h | 106d 5h |

The `wait` columns show the time to wait for the next retry after
each attempt. The `accum time` shows the accumulated waited time since the
first delivery was attempted.

### Maximum retry attempts

Retrying delivery forever is probably not a good idea. Thus, the
maximum amount of attempts that will be performed is controlled by the
`retry_max_retries` attribute.

As an example, let's say that `retry_max_retries = 2`. In this case,
the webhook message will be attempted once (the first time) and two
more times (two retries).

If `retry_max_retries` is zero, then there will be no retries. That is,
the initial delivery attempt will be performed. In case it fails,
no more attempts will ever be performed.

## Reliability considerations

When adjusting the `retry_*` attributes of a WebhookDefinition, keep
in mind that webhook messages that are waiting to be delivered
are kept in the Redis database of webhooks.uno.

Since Redis uses RAM as its storage mechanism, having long waiting times
could mean your Redis deployment can run out of memory.

