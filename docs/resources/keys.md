---
sidebar_position: 3
title: Keys
---

> This documentation is useful for both **webhook receivers** and
**webhook senders**!

Keys are used to sign webhook messages. In order to receive webhook messages
in a secure way, the messages have to be signed. See the
[Signature verification](/docs/receiving-webhooks/signature-verification)
page for more information.

A key is composed of a secret and an algorithm.

A key has three attributes: an unique **name**, the **kind** of the
key and its **content**.

The **kind** of the key mainly identifies which algorithm is suited
for it. The available values for this attribute are:

- `md5`
- `sha1`
- `sha256`
- `sha384`
- `sha512`
-
The **content** attribute contains the secret for the key.
