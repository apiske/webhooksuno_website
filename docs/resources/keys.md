---
sidebar_position: 3
title: Keys
---

> This documentation is useful for both **webhook receivers** and
**webhook senders**!

Keys are used in cryptographic operations. A key has both a
secret and an algorithm.

A key has three attributes: an unique **name**, the **kind** of the
key and its **content**.

The **kind** of the key mainly identifies which algorithm is suited
for it. The available values for this attribute are:

- `md5`
- `sha1`
- `sha256`
- `sha384`
- `sha512`
- `private_rsa`
- `private_dsa`

The **content** attribute contains the secret for the key.
