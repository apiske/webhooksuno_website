---
sidebar_position: 3
title: Signature verification
---

> This documentation is useful for both **webhook receivers** and
**webhook senders**!

In order to increase security of webhooks, all webhooks sent through
webhooks.uno are signed.

The key used to sign the webhooks must be provided by you (the one receiving
webhook messages). See the [Keys](/docs/resources/keys) resource
on how to create a signing key.

## Signature header

The `Wh-Uno-Signature` HTTP header contains the webhook message signature
and also the timestamp of when the webhook was sent.

Note: If you prefer to learn by example, try skipping to the
[next section below](#reference-implementations).

The `Wh-Uno-Signature` header contains a number followed by a comma,
followed by a string. For example:

`Wh-Uno-Signature: 1635593264,0cb72fd0f767fb0e3bcf6314f94dd21c6ac5327d36b4146e582aa8d7543913f3`

To verify the signature, you should perform the following algorithm:

1. Let `header` be the contents of the `Wh-Uno-Signature` HTTP header
1. Find the `,` (comma) symbol within `header`
1. Let `timestamp` be the content **before** the comma
1. Let `signature` be the content **after** the comma
1. Let `current_time` be the current [UNIX time](https://en.wikipedia.org/wiki/Unix_time)
1. Let `skew = abs(current_time - timestamp)`
1. If `skew` is above a certain threshold (see below), stop processing
   and consider the webhook message as invalid
1. Let `request_body` be the body (unparsed) of the HTTP request
1. Let `signed_payload` be the concatenation of `timestamp`, plus
   `.` (a dot), plus `request_body`
1. Let `calculated_signature` be the lowercase hexadecimal
   representation of the
   [HMAC](https://en.wikipedia.org/wiki/HMAC) of `signed_payload`. The
   hashing algorithm should be the one specified in the `kind` attribute
   of the Key object associated with the Subscription that is calling
   this HTTP endpoint
1. If `calculated_signature` and `signature` are different, stop
   processing and consider the webhook message as invalid. Otherwise,
   you're good to go!

A few notes:

* If the comma (`,`) symbol is not present or present more than once
  in `header`, the webhook message is invalid and should be discarded.
* The threshold for `skew` would ideally be zero, but both
  [clock drift](https://en.wikipedia.org/wiki/Clock_drift) and the
  time to perform the HTTP request have to be taken into account.
  A skew of a few second or a few minutes should generally be good enough.
* For the `timestamp` (and thus `skew`): this is the time when the webhook
  is actually sent, not when it was enqueued to be sent. This also means
  that if multiple delivery retries are performed, each tentative will have
  a different timestamp (the time of the tentative).

### Security considerations

It is up to you to implement the signature verification, but it is a good
practice as it allows you to check whether the HTTP request actually came
from the original source without relying on things like origin IP address
or other shenanigans.

Ensure the value of `timestamp` (see step 3 of the algorithm above)
is within a reasonable time protects
you against replay attacks. This occurs when an attacker is able to
intercept a webhook request along with its signature (but not the
signing key)
and then tries to perform that request against your server again in a
later point in time. Since the `timestamp` value is used to calculate the
signature, the attacker cannot change it, otherwise the signatures would
not match.

Using a lower threshold for `skew`
(see step 7 of the algorithm above) gives a tighter window where an
attacker could conduct a successful attack. However, a value too low
for `skew` would possibly allow for false negatives when checking the
signature.

## Reference implementations

Below are reference implementations in Python and in Ruby
on how to verify the webhook signature.

The code for both are structured in a way to work with AWS Lambda functions
invoked through AWS API Gateway in lambda proxy mode. Do not worry if you're
not familiar with that as it should be fairly simple to understand:

Whenever an HTTP request comes in, the `lambda_handler` function is called.
The `event` parameter is a Hash (ruby) or a dict (Python) with two
relevant keys:

- `headers`, which contains all HTTP headers
- `body`, which contains the raw (or unparsed) body of the request

The `context` attribute is not used in these examples, thus it's not 
relevant.

It's relevant to notice that they use the key `AGYJihkaUOqdg3vkzqQ4/GX0yi6XABzzEKHi/iXobDM=`. To create that key, you would perform a `POST`
request to `<WEBHOOKS_UNO_URL>/keys` with the following payload:

```json
{
  "data": {
    "name": "some_key_name",
    "kind": "hmac_sha256",
    "content": "AGYJihkaUOqdg3vkzqQ4/GX0yi6XABzzEKHi/iXobDM="
  }
}
```

### Python


```python
import hmac
import base64

def lambda_handler(event, context):
    # The signing key as when used to create the Key object
    # This must be kept secret!
    sign_key = 'AGYJihkaUOqdg3vkzqQ4/GX0yi6XABzzEKHi/iXobDM='

    # The signing key, but in its binary form
    decoded_sign_key = base64.b64decode(sign_key)

    # The webhook signature header, in the Wh-Uno-Signature HTTP header
    signature_header = event['headers']['Wh-Uno-Signature']

    # The webhook signature header contains two informations:
    # 1. wh_timestamp: The UNIX timestamp of when the webhook was dispatched
    # 2. wh_signature: The actual webhook signed payload signature
    wh_timestamp, wh_signature = signature_header.split(",")

    # The whole body of the request
    webhook_body = bytes(event['body'], 'utf8')

    # The data on which the signature will be calculated upon.
    # To calculate the signature, the timestamp of when the webhook was sent
    # is included to mitigate aginst replay attacks
    signed_payload = bytes(wh_timestamp + '.', 'ascii') + webhook_body

    # This is the actual signed payload signature. Here, sha256 is used
    # because the "kind" attribute of the Key was "hmac_sha256"
    payload_signature_digest = hmac.digest(decoded_sign_key, signed_payload, 'sha256')

    # Compares the calculated signature with the received signature. If they do match,
    # we know the webhook came from the original source. Otherwise, this is a forged
    # request and must be discarded.
    valid_signature = hmac.compare_digest(payload_signature_digest.hex(), wh_signature)

    if valid_signature:
        print('Digest = ' + payload_signature_digest.hex())
        print('The signature is good!')
    else:
        print('SECURITY ALERT:')
        print('The webhook signature is invalid! This webhook will be discarded.')
    
    return {
        'statusCode': 200,
        'body': ''
    }
```

### Ruby

```ruby
require 'base64'
require 'openssl'

def lambda_handler(event:, context:)
    # The signing key as when used to create the Key object
    # This must be kept secret!
    sign_key = 'AGYJihkaUOqdg3vkzqQ4/GX0yi6XABzzEKHi/iXobDM='

    # The signing key, but in its binary form
    decoded_sign_key = Base64.strict_decode64(sign_key)

    # The webhook signature header, in the Wh-Uno-Signature HTTP header
    signature_header = event['headers']['Wh-Uno-Signature']

    # The webhook signature header contains two informations:
    # 1. wh_timestamp: The UNIX timestamp of when the webhook was dispatched
    # 2. wh_signature: The actual webhook signed payload signature
    wh_timestamp, wh_signature = signature_header.split(",")

    # The whole body of the request
    webhook_body = event['body']

    # Calculates the payload signature. The signature is based on the request
    # body and the timestamp when the webhook was sent (to mitigate against replay attacks).
    # The "sha256" algorithm is used because the "kind" attribute of the Key was
    # set to "hmac_sha256".
    hmac = OpenSSL::HMAC.new(decoded_sign_key, OpenSSL::Digest.new("sha256"))
    hmac << wh_timestamp
    hmac << '.'
    hmac << webhook_body
    payload_signature = hmac.hexdigest
    
    # Compares the calculated signature with the received signature. If they do match,
    # we know the webhook came from the original source. Otherwise, this is a forged
    # request and must be discarded.
    valid_signature = (wh_signature == payload_signature)

    if valid_signature
        puts("Digest = #{payload_signature}")
        puts('The signature is good!')
    else
        puts('SECURITY ALERT:')
        puts('The webhook signature is invalid! This webhook will be discarded.')
    end
    
    return {
        'statusCode': 200,
        'body': ''
    }

    { statusCode: 200, body: "" }
end
```