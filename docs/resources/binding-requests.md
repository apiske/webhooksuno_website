---
sidebar_position: 1
title: Binding Requests
---

> You only need this resource for **sending webhooks**, not for receiving them!

Creating a BindingRequest is the second and final step in opening webhooks
to the external world. The first step is to create a [Router](/docs/resources/routers).

The following image depicts the flow of a webhook message. It enters a Router
and then goes to a Binding. A binding cannot, however, be created directly.
Instead, you have to first create a Binding Request object. A webhook consumer
will then take a binding request ID and create a binding with it.
You may want to read the [Bindings](/docs/resources/bindings) docs for more details.

![](/img/webhook_binding_flow_1.svg)

Effectively, a binding object binds a Router object to a consumer
account or workspace.

A Binding Request is always bound to a Router. Also, a Router
may have multiple Binding Requests attached to them.

Binding requests come in different types, determined by their
`use_type` attribute. You should choose the use type that best suits
your needs. These are the available use types:

#### Unlimited or Public

**use\_type**: `unlimited`

An unlimited Binding Request accepts integrations from anyone. It
produces an URL that can be used by anyone.

This is more suitable for public webhooks, where anyone can subscribe and
start listening to webhooks you publish with, without needing your
authorization or approval.

The only security they offer is that they can be password protected.

#### Once

**use\_type**: `once`

This Binding Request can have a maximum of one Receiver.

This is suitable if you want to individually give access to each one whom
integrates with your webhooks.

You can protect the binding with a password and you can also request that
you have to approve whomever is integrating with it before they can start
consuming any webhooks.

Once a Receiver is generated for this Binding Request, no more Receivers
will be allowed into it.

#### Multiple

**use\_type**: `multiple`

This one is similar to the `once` use type in terms of security and similar
to `unlimited` in terms of how many Receivers can connect to the
Binding Request.

This is suitable if you want to give access to multiple partners without
having to create a Binding Request to each one of them, while
still having the ability to require an approval for integrating.

You can protect the binding with a password, but keep in mind that the
password will have to be handed to multiple partners. Nevertheless,
you can also require that you have to approve each integration before they
can start consuming any webhooks.

### How to pick the best use type

The best use type will, of course, depend on your use case. The decision
should be fairly simple. Here is a basic guideline:

* If you are offering a **public API** where you **don't need control** over
  whom can consume your webhooks, then the `unlimited` use type is the way
  to go.
* If your API is **private**, for partners only, you might want to go with
  either `multiple` or `once`. The latter gives you a stricter control
  and the former will require less effort from you, as you will not need
  to create a Binding Request for each partner of yours.
