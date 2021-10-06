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
wait_time = (retry_wait_factor/100)*30 +
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

To experiment with different values,
check out [this Repl.it](https://replit.com/@andrepiske/WebhooksUnoWaitFactorCalculator).

| Attempt | f=100 wait | f=100 accum time\* | f=150 wait | f=150 accum time\* |
| ----- | -------- | -------------- | -------- | ------------- |
| 1 | 32s | 32s | 48s | 48s |
| 2 | 34s | 1m 6s | 53s | 1m 41s |
| 3 | 38s | 1m 44s | 1m 8s | 2m 49s |
| 4 | 46s | 2m 30s | 1m 49s | 4m 38s |
| 5 | 1m 2s | 3m 32s | 3m 47s | 8m 25s |
| 6 | 1m 34s | 5m 6s | 9m 17s | 17m 42s |
| 7 | 2m 38s | 7m 44s | 24m 54s | 42m 36s |
| 8 | 4m 46s | 12m 30s | 1h 9m | 1h 51m |
| 9 | 9m 2s | 21m 32s | 3h 13m | 5h 5m |
| 10 | 17m 34s | 39m 6s | 9h 6m | 14h 12m |
| 11 | 34m 38s | 1h 13m | 1d 1h | 1d 15h |
| 12 | 1h 8m | 2h 22m | 3d 0h | 4d 16h |
| 13 | 2h 17m | 4h 39m | 8d 13h | 13d 6h |
| 14 | 4h 33m | 9h 13m | 24d 6h | 37d 13h |
| 15 | 9h 6m | 18h 19m | 68d 15h | 106d 5h |

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

