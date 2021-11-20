---
sidebar_position: 3
title: Why Bindings
---

When a webhook receiver wants to subscribe to certain topics, they first have
to create a [Binding](/docs/resources/bindings) resource. Why is that?

To begin with, one can think of a Binding as being a connection between a
[Router](/docs/resources/routers) which sits at the sender end, and a receiver's
workspace, which, of course, sits at the receiving end.

Having a Binding created between a sending and a receiving workspaces gives
visibility to the sending end of how many connected workspaces exist.
It also gives them power to terminate or deactivate bindings or enforce
rules in certain bindings.

Another use case is that of only allowing a binding to be created if some
sort of password is provided, or to only allow the binding to exist after
the sender has manually validated that the receiving end is who they say
they are.

Even though these features are not yet implemented in webhooks.uno, they're
in the ideas bucket. Having the concept of Bindings now makes it easier to
provide those features in the future!
