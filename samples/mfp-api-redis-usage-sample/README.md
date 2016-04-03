IBM MobileFirst Platform Foundation
===

## An MFP Adapter that cache data inside Redis
Many common adapter use cases require caching of some data in memory. While in theory, it is possible to cache
information inside the server's memory we strongly recommend against this patter since it may lead to unexpected
behaviour when servers restart, join or leave.

To cache data it is recommended to use a caching server solution and this sample demonstrate the use of the
[Redis](http://redis.io/) server and the Java based [Jedis](https://github.com/xetorthio/jedis) client library.
While we are not recommend the specific use of Redis and/or Jedis, these are commonly used packages.

### What will you be learning?
Initializing and destroying a pool of resources in the Adapter in general, and specifically, the use of Redis from
within an Adapter.

## Implementation
The Adapter API is composed of:

1. A **JAX-RS** resource class that implement the REST access points into the server by manipulating data inside Redis
2. An **Application** Object that handles initialization and parameter validation. The **Application** Object is
   invisible to the calling client apps

The Adapter API uses Jedis to call into the Redis server. To this end, a `JedisPool` object is instantiated once
during initialization in the **Application** object from the Adapter's configuration parameters.

The API uses **maven** to build and deploy the API.

### Configuration
The Adapter defined several configuration parameters as seen in the below XML fragment. There configuration parameetrs
are than exposed by the MFPF Console and allow administrators to configure the adapter

```XML
<property name="redisURL"
          displayName="A URL pointing to the Redis Server"
          defaultValue="redis://localhost:6379"
          type="string"
          description="Enter a URL That points to the Redis server used. Traditionally redis://<host name>:6379"/>

```

### JAX-RS and Swagger Annotations
The resource class is annotated with both JAX-RS and Swagger annotations (and than potentially can also be annotated
with some MobileFirst security annotations).

**JAX-RS** annotations are used to mark the REST interfaces and marshal objects in and out of the REST interfaces. The
MobileFirst server uses those annotations to provide a custom Swagger test UI and meta data. The use of JAX-RS is
mandatory.

**Swagger** annotations are used to complete and improve the custom swagger test UI with more notes, description text
and type information. In general, the use of Swagger annotations to augment the swagger metadata is highly recommended,
but not mandatory.

## Build and Setup

### Prerequisites
* A Redis server installation

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **mfp-api-redis-usage-sample** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * Set the value for the Redis server URL to point to the actual Redis server
* You are done

### Supported Levels
IBM MobileFirst Platform Foundation 8.0

## License
Copyright 2016 IBM Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.