---
sidebar_position: 3
title: Keys
---

import { ApiEndpoints, ApiResource } from '@site/src/components/ApiDoc';

> This documentation is focused for **webhook receivers** but is also useful
  for the ones **sending** them!

Keys are used to sign webhook messages. In order to receive webhook messages
in a secure way, the messages have to be signed. See the
[Signature verification](/docs/receiving-webhooks/signature-verification)
page for more information on how keys are used.

> Note that all webhook messages are signed. It is not an optional feature.

A key is composed of a secret and an algorithm. It has three attributes:

- `name`, the unique name of this resource
- `kind`, the algorithm used in this key. See more below
- `content`, the key itself. That is, the secret payload that will be used
  to sign webhook messages

The **kind** attribute determines the algorithm used to sign the webhook
messages. There are currently three supported algorithms:

- `hmac_sha1`
- `hmac_sha256`
- `hmac_sha512`

A few notes on the **content** attribute:

1. When creating or updating a key, the length of the key must match what
the algorithm (determined by the `kind` attribute) requires. For the kinds
`hmac_sha1` and `hmac_sha256`, the content length must be 64 bytes long and
128 bytes for `hmac_sha512`.

2. The value in API requests must always be base64 encoded.

3. It is never possible to read back the contents of the key. It is only possible
   to change it. Thus, you must ensure you have a copy of the key as you will
   not be able to recover it from webhooks.uno.

## API

<ApiEndpoints endpoints={[
{ m: 'GET', p: '/v1/keys' },
{ m: 'GET', p: '/v1/keys/:id' },
{ m: 'POST', p: '/v1/keys' },
{ m: 'PUT', p: '/v1/keys/:id' }
]} />

<ApiResource data={[
{
  attr: "name",
  type: "string",
  required: true,
  desc: "The resource unique name"
},
{
  attr: "kind",
  type: "string",
  required: true,
  desc: `The algorithm used.
  See notes above for the allowed values`
},
{
  attr: "content",
  type: "base64",
  required: true,
  desc: `The secret key itself that will be
  used in cryptographic operations. This attribute
  is write-only, thus it is never returned in any
  endpoint`
}
]} />
