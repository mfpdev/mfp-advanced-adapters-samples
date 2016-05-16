IBM MobileFirst Platform Foundation
===

## PhoneRecordAPI
A server side API that associate between users and their phone number by implementing a
registration-validation cycle where users register with their phone number and than
validate the registration using a validation code that is sent to them via SMS.

## Implementation
The API is composed of:

1. A **JAX-RS** resource class that implement the REST access points into the server
2. A **Twilio** Access Object that handles all access to the Twilio backend using the Twilio Java SDK (that wraps the
   Twilio REST APIs)
3. A **DataBase** Access Object that put a Java layer on top of the registration database

The API uses the **Spring framework** to setup the DataBase as well as the Twilio access components and than inject them into the JAX-RS
resource. Once the intialization is over, Spring is not playing much of a role (we are not using AOP for example) other
than use of utility classes.

The API uses **maven** to build and deploy the API including running **junit** test cases.

### Spring
The API is implemented using the MFPF-Spring integration library and Spring framework.

The MFPF-Spring integration library contributes the following capabilities:
* Initializing Spring. In this Adapter we selected to initialize Spring from an XML configuration file
 (**applicationContext.xml**)
* Registration of the JAX-RS resource within the MobileFirst server
* Providing the Adapter configuration parameters as Spring properties

The MFPF-Spring integration library is added into the project using the following maven dependency:
```XML
<dependency>
    <groupId>com.github.mfpdev</groupId>
    <artifactId>mfp-adapters-spring-integration</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

Spring is used in this project for Dependency injection and initialization:
* Injecting initialization parameters into the relevant objects
* Injecting objects into each other

While most of the injection is performed through the spring xml file, we also show the use of @Autowired for some
of the injections (both styles are acceptable, but as a personal preference I find it valueable to see a listing of the
instantiated objects inside the spring xml file).

Another use of Spring is in the injection of the Adapter configuration parameters into the Spring instantiated objects.
The Adapter exposes several configuration parameters via the file adapter.xml as seen below:

```XML
    <property name="sid"
              displayName="The Twilio API SID to be used"
              defaultValue="Enter a SID"
              type="string"
              description="Enter the Twilio API SID to be used (obtained from the Twilio console)"/>
    <property name="token"
              displayName="The Twilio API Token to be used"
              defaultValue="Enter a valid token"
              type="string"
              description="Enter the Twilio API token to be used (obtained from the Twilio console)"/>
    <property name="fromNumber"
              displayName="Number used to send SMS notifications"
              defaultValue="Enter a valid From number"
              type="string"
              description="Enter the Twilio 'from' Phone number to be used (obtained from the Twilio console)"/>

    <property name="databaseLocation"
              displayName="JNDI location for the registration database"
              defaultValue="jdbc/pglocal"
              type="string"
              description="Enter the JNDI URL to the DataSource that was configured in the application server"/>
```

We are using Spring to inject the configuration into the running Adapter code and Spring created objects, specifically,
the below Spring XML fragment inject the **databaseLocation** variable into a JNDI lookup.

```XML
    <jee:jndi-lookup id="dataSource"
                     jndi-name="${databaseLocation}"
                     expected-type="javax.sql.DataSource" />
```

and the below xml fragment inject the Twilio configuration into the Twilio access object using constructor injection:

```XML
    <bean id="twilioAccessBean"
          class="com.github.mfpdev.twilio.sample.phoneuser.TwilioAccess"
          c:sid="${sid}"
          c:token="${token}"
          c:from="${fromNumber}"/>
```

### Twilio

The Adapter uses [Twilio](https://www.twilio.com) to send SMS messages. To ease the use of the Twilio service we are
using the Twilio Java SDK that wrapper the Twilio REST interfaces.

### SQL Database
We use a relational database with a single table to record registrations. In general, there are two possible ways to use
the database:
* Configure the database connection via Spring or some other home grown application level configuration
* Configure the database via the underlying application server and get the connection via a JNDI reverence

We picked the second option since it allows for improved administration and troubleshooting of the database connection.

### Unit Tests
The unit tests follows the maven tests directory structure and are written using junit. These are not exhaustive tests but
they show how the various classes in the adapter can be tested outside of the MobileFirst server. SOme things to note:

* Since we use a dependency injection framework, the tested object are not dependent on the specifics of the MobileFirst
  server and can be instantiated easily using a test harness. Even the resource class is nothing but a POJO that can be
  tested using junit
* We use an actual database connection and an actual Twilio account to run the tests, but a more sophisticated solution
  could use a mock objects framework such as jmock

### JAX-RS and Swagger Annotations
The resource class is annotated with both JAX-RS and Swagger annotations (and than also some Spring anotations and
potentially also MobileFirst security annotations).

**JAX-RS** annotations are used to mark the REST interfaces and marshal objects in and out of the REST interfaces. The
MobileFirst server uses those annotations to provide a custom Swagger test UI and meta data. The use of JAX-RS is
mandatory.

**Swagger** annotations are used to complete and improve the custom swagger test UI with more notes, description text
and type information. In general, the use of Swagger annotations to augment the swagger metadata is highly recommended,
but not mandatory.

## Build and Setup

### Prerequisites
* Access to a relational database - we are using PostgresSQL (available both on the cloud and for download).
* A configured acount (can be evaluation account) on Twilio with a configured SMS capable phone number.
* A local installation of maven (JDK 1.7 or 1.8)

### Database Setup
* Install PostgresSQL or login to an available installation
* Open the PostgresSQL Admin UI `pgadmin3` and create a database (say <testdb>) or use the below SQL script via the
  `psql` interactive shell to create it
```sql
CREATE DATABASE testdb
  WITH OWNER = test
       ENCODING = 'LATIN1'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.ISO8859-1'
       LC_CTYPE = 'en_US.ISO8859-1'
       CONNECTION LIMIT = -1;
```
* Create the schema and the table used in this sample by executing the below SQL after connecting to the <testdb>
  database (if you are using `psql` connect to the database by entering `\c testdb`)

```sql
CREATE TABLE mobile.user_phone_binding
(
  pkey serial NOT NULL,
  user_id text NOT NULL,
  phone_number text NOT NULL,
  validation_code text,
  in_validation boolean NOT NULL DEFAULT false,
  CONSTRAINT user_phone_binding_pkey PRIMARY KEY (pkey),
  CONSTRAINT user_phone_binding_user_id_phone_number_key UNIQUE (user_id, phone_number)
)
WITH (
  OIDS=FALSE
);
```
* You are done

### App Server Setup
* Add a datasource definition into the MobileFirst WebSphere Liberty Server
* Edit the file `<MobileFirst Home>/mfp-server/usr/servers/mfp/server.xml` and add the below XML fragment to define
  a datasource pointing to the database. Than update directory locations and connection parameters to your
  actual userid, password, etc). Add the fragment right before the ending `</server>l` markup

```sql
    <dataSource id="smsreg"
                jndiName="jdbc/pglocal"
                type="javax.sql.XADataSource">

        <jdbcDriver javax.sql.XADataSource="org.postgresql.xa.PGXADataSource"
                    libraryRef="PGJDBCLib"/>

        <!-- You may need to update the below connection details -->
        <properties databaseName="testdb"
                    serverName="localhost"
                    portNumber="5432"
                    password="test"
                    user="test"/>

    </dataSource>

    <!-- Update to your actual postgres JDBC driver location -->
    <library id="PGJDBCLib">
        <fileset dir="<directory where thpostgres JDBS driver was installed>"
                 includes="postgresql-9.4.1208.jar"/>

    </library>
```
* Restart the MobileFirst server
* You are done

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **mfp-api-twilio-sql-spring-sample** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * Twilio SID, Access Token and Phone number that can be used to send SMS messages (obtained from the Twilio console)
    * The database URL as specified when defining the DataSource
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