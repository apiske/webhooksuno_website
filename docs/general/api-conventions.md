---
sidebar_position: 3
title: API Conventions
---

Webhooks.uno is a REST API that behaves like most modern APIs.

A summary:

* All API endpoints use JSON to represent data
* Authorization always uses the HTTP `Authorization` header
* HTTP status codes work as one would expect: 2xx for success,
  4xx for errors in the client side and 5xx for errors in the
  server side
  
A few idiosyncrasies:
  
* Resource data always sits inside a `data` attribute
* Pagination information sits inside the `page` attribute
* `GET` requests are safe and have no side effects (they
  never change data
* `PUT` requests change resources and `PATCH` requests are not
  supported. There are no plans to support them as they carry
  additional complexity
* Most `POST` requests create resources
* All resources have an ID and most of them also have an unique
  name (see more below)
  

## Resource IDs and names

All resources have an unique ID. The format for most resources is
UUIDv4, but not for all of them. The `Message` resource, for instance,
does not use UUIDv4. Thus, you should treat the IDs like an opaque string.

Most resources also have names associated to them. Names
must be unique for a given resource type within a workspace.
For instance, you cannot have two Keys in the same workspace with
the same name, but it is possible that your Key name clashes with
a Key existing in a different workspace. Most SaaS software have the
concept of workspaces, but sometimes is called namespaces or just accounts.

> A workspace works just like a tenant by the definition of
[multi-tenancy](https://en.wikipedia.org/wiki/Multitenancy).

## Authentication / Authorization

All endpoints require authorization. Authorization is done by
passing your authentication token via the `Authorization` HTTP header.
For example:

`Authorization: Bearer YOUR_TOKEN`

This is the only method of authorization.

> There is no concept of Authentication in webhooks.uno as there is
  no concept of users. There is only Authorization.

## Pagination

All endpoints that enumerate resources support pagination.

Pagination uses opaque cursors, not page size and page number. Information
regarding pagination comes in the `page` attribute of the root object in
the responde body. It may contain three attributes, which are:

- `has_more`, a boolean that tells whether there are more pages. If this
  is false, there are no more pages left.
- `size`, an integer that tells the size of the page. Note that the
  page size is fixed and thus NOT configurable.
- `next`, a string which is the cursor to the next page. This is only
  present if `has_more` is true.

To get the next page for a request, just pass the cursor in the `next`
attribute in the query parameter `page`.

For example, a request to the `/topics` endpoint could return something like the following:

```json
"data": {
  ...
},
"page": {
   "has_more": true,
   "size": 50,
   "next": "MXh8jUfa1AyRcEEjhDdeTBrPKOVmswMpiIHLzrSl0xX2"
}
```

To get the results of the next page, you would just call the endpoint
passing the next cursor value as a query parameter, like the following
request:

```
GET /topics?page=MXh8jUfa1AyRcEEjhDdeTBrPKOVmswMpiIHLzrSl0xX2
```

In order to return the first page, you may either omit the `page` query
parameter, set it to `first` or `0` or just set it to an empty value.
