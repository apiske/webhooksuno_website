---
sidebar_position: 2
title: Overview
---

# Send a webhook

```http
POST <WEBHOOKS_UNO_URL>/publish
```

Example:

```json
{
  "data": {
    "message": "{\"foo\":\"bar\"}",
    "topic": "periodic_check"
  }
}
```

### Parameters:

#### **message** (required)

Type: **string**

The payload that will be sent to the subscribers.

#### **topic** (required)

Type: **string**

The topic of the webhook. Only subscribers to this given topic will receive
the webhook.

### Advanced parameters:

The following parameters are for advanced use and may not be necessary for
basic webhooks sending.

#### **include\_tags**

Type: **array of strings**

This limits which subscribers will receive this webhook. When this parameter is present, only recipients that have at least one tag
contained in `include_tags` will receive this webhook.

If this parameter is an empty array, the webhook will not be delivered to any recipient.

When this parameter is omitted, the behavior is equivalent to as if this parameter
was an array with all registered tags.

This parameter must not be null. It must either be an array or be omitted.

The behavior of this parameter is better detailed in
the [using tags](#using-tags) section.

#### **exclude\_tags**

Type: **array of strings**

This limits which subscribers will receive this webhook.
Any recipient that has at least one tag contained in `exclude_tags` will
not receive this webhook.

If this parameter is an empty array, the behavior is the same as when it is
omitted. That is, no recipients will be filtered out.

This parameter must not be null. It must either be an array or be omitted.

The behavior of this parameter is better detailed in
the [using tags](#using-tags) section.

#### **extra_fields**

Type: **JSON object**

...

This parameter must not be null. It must either be an array or be omitted.

## Using tags

TODO:

## Using extra fields

TODO:
