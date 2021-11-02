---
sidebar_position: 1
title: Introduction
---

# What is webhooks.uno?

It's a webhook engine.

It's an open source software that you can deploy on your own infrastructure
using Docker. But what does it do?

Webhooks.uno delivers webhooks. Or webhook messages. Or webhook payloads.
Whatever you want to call it: it will perform HTTP requests to third party
URLs, carrying some payload with it. That's the short version of the story.

However, that is not so simple to do in real life. Read along to know why.

> `webhooks.uno` is both a software and a website. The website refers
to the software. Usually when writing webhooks.uno, unless it's linked,
it refers to [the software](https://github.com/apiske/webhooksuno),
not to the website 🙂

## Why would I use this thing?



## How do I get started?

First: it's open source, available [here](https://github.com/apiske/webhooksuno).

You can get started by learning how to use webhooks.uno, but there
are two different scenarios you would want to use it, or two kinds of user
who would use it:

1. People wanting to send webhooks without hassle.
2. People wanting to receive webhooks from someone that sends webhooks
   using webhooks.uno.

Choose the most appropriate section below:

### I want to send webhooks

In this case, you can get started by reading the [Installation](/docs/installation) instructions.

But that is just how you get it running. Start at the
[Sending Webhooks → Quick start](/docs/sending-webhooks/quick-start)
page.

### I want to receive webhooks

In this case you don't have to install anything. You will be integrating
with someone who deployed webhooks.uno on their infrastructure.

They will have to provide you with a base URL of where you can access it
along with an API token so that you can access the resources to start
receiving webhooks from them.

You can get started by jumping straight to the
[Receiving Webhooks → Quick start](/docs/receiving-webhooks/quick-start)
page.

