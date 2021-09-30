---
sidebar_position: 3
title: Retrying deliveries
---

> This documentation is focused for **webhook senders** but is also useful
> for the ones **receiving** them!

Sometimes the delivery of a webhook fails. This can happen due to several
reasons. To list a few:

- The consumer returned an invalid status code (like 4xx or 5xx status codes)
- The consumer's servers are down
- The DNS failed to resolve the consumer's host
- The consumer's servers are experienced an unusual traffic spike and can't
handle more requests

Any computer system can fail but that is expected. The highest priority on such
scenarios is to not drop any webhooks in order to avoid data lost.

This is achieved by having a retry mechanism in place. Webhooks.uno
automatically retries failed deliveries.

Nevertheless, you can control a few options of the retry mechanism
in the WebhookDefinition object via its `retry_policy` attribute.

See the documentation for [WebhookDefinition](/docs/resources/webhook-definitions)
to learn more about webhook definitions and how they are used.

## The retry mechanism

As stated above, the retry mechanism is controlled by the `retry_policy`
attribute of the WebhookDefinition object.

When a tentative to deliver a webhook to a consumer fails,
the webhook will be preserved and will be retried in the future
according to the retry policy of the WebhookDefinition object associated with
the topic to which the webhook has been published.

The maximum number of retries is given by the `max_retries` attribute of
the retry policy and the time to wait between tries is controlled by the
`wait_factor` attribute. The `failure_behavior` attribute controls what
happens when all retry attempts fail.

The time to wait between retries is given by the following formula:

```
wait_time = wait_factor*30 + 2**(retry * (wait_factor/100)) + rand(60)
```

Where:

- `retry` is the retry number
- `wait_factor` is an attribute of the `retry_policy`
- `rand(60)` is a random factor of 0 to 60 seconds
- `**` is the exponentiation operator

The value of `retry` starts from 1 up to `max_retries`. The first delivery
attempt is not considered a retry, which means the first retry attempt only
occurs after the webhook delivery failed at least once.

The `wait_factor` must be a value `>= 10` and `<= 200`.

The following table shows the wait times for wait factors (denoted `f`) of 100 and 150, including the theoretical total wait time (see below for total wait time limitations). The random factor is not considered here as it is small
enough.

| Retry | f=100 wait | f=100 total wait\* | f=150 wait | f=150 total wait\* |
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

\* The total wait in the table is the _theoretical total wait_. In reality
they are further limited depending on your account plan. See below.

From the table above, we can see that with a `wait_factor=100`, the wait
time from the first failed delivery to the first retry is 32 seconds
plus a random value of 0 to 60 seconds.
The wait time between the first retry to the second retry is of 1 minute
and 4 seconds plus a random value of 0 to 60 seconds.
Also, the total wait time between the first delivery attempt to the second
retry is of 1 minute and 36 seconds plus a random value of 0 to 120 seconds.

**Important**: The maximum total wait time of a webhook message is
capped in 10 days.

### Disabling the retry mechanism

The retry mechanism can be disabled by setting the `max_retries` to zero in the
WebhookDefinition's `retry_policy` attribute. In that case, the webhook
will be dropped in case of a failed delivery attempt.

### When all retries fail: the failure\_behavior

To control what happens when a webhook delivery is attempted several times
but fails every one of them, the `failure_behavior` attribute of the
`retry_policy` can be used.

There are two possible values for the `failure_behavior` attribute:

- `"drop"` The webhook will be dropped
- `"enter_failure"` The consumer will enter failure mode (see below)

#### The "drop" mode

In this mode, the webhook will just be dropped (i.e. deleted) and
there is no more chance for its delivery to be retried again.

**Important**: This mode implies that there will be data lost if the
consumer is unable to receive the webhook after the maximum number of
retries.

#### The "enter\_failure" mode

In this mode, the webhook will NOT be dropped (i.e. will not be deleted).
Instead, the consumer that is failing to receive the webhooks
will be put in the `failure` mode.
<!--
See the [Consumer modes](/consumer_modes) for more information.
-->

This mode guarantees that no data will be lost in case of failures.

## Choosing the right retry policy

Since there is no "one size fits all" solution, you can tune the attributes
of the `retry_policy` for each WebhookDefinition object, therefore being
able to tune them for each topic.

For scenarios where your published webhooks are time sentitive, meaning
that a consumer receiving them hours or days after it was initially published,
you are likely to be fine with low values for `wait_factor` and an
`enter_failure` mode set to `drop`.

If, on the other hand, it is vital that the webhooks are not lost along
the way, then having higher values for `wait_factor` will better suit
your needs. Having the `enter_failure` mode set to `enter_failure` will
ensure that your deliveries are not lost.

Having a higher `wait_factor` value gives the consumers of your webhooks
more time to recover from issues on their infrastructure or code.
