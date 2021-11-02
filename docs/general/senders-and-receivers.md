---
sidebar_position: 2
title: Senders & Receivers
---

There are two users to a webhooks.uno deployment. One is the one sending
webhooks and the other is the one receiving webhooks.

## End-to-end API

Webhooks.uno is designed so that part of its API is intended to be used
by the party that wants to send webhooks (that's likely the same side
that is deploying webhooks.uno on their own infrastructure)
and the other part is intended for whomever will receive those
webhooks. That first party is called a Sender, while the latter is called
a Receiver.

The usual business case for sending webhooks is integrating two pieces
of software. A good integration allows the receiving end to have some
control over how they are receiving webhooks.
Nobody really likes to have to exchange emails because the endpoint that
will receive endpoints has to change or to know whether webhooks are
still being delivered by the sender after one stops receiving webhooks:
"_is it on my end or on theirs?_" — developer asks after alerts go off.

Thus, it is a goal for webhooks.uno to help the sending end and also the
receiving end.

## The Receiver API

At the left side menu of this documentation, there's a _Receiving Webhooks_
section. That whole API is intended to be accessed by the Receiver and will
most likely be exposed to the internet.

Every receiving end (e.g. every company integrating with your software,
given that you are the one sending webhooks) will have its own Workspace.
That is, they will have their own set of resources and API tokens.

The idea is that the receiving end should be able to configure which
[kinds of webhooks](/docs/resources/topics) they want to receive and
where they want to receive it.


