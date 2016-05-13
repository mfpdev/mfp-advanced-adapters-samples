/*
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.github.mfpdev.redis.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.MFPJAXRSApplication;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.exceptions.InvalidURIException;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.util.JedisURIHelper;

import javax.ws.rs.core.Context;
import java.net.URI;
import java.util.logging.Logger;

/**
 * Initializes the Adapter API by opening a connection to the Redis server and than makes the Redis connection pool
 * available to the resource implementation.
 */
public class RedisAdapterApplication extends MFPJAXRSApplication {

    /**
     * The logger used by the app
     */
    static Logger logger = Logger.getLogger(RedisAdapterApplication.class.getName());

    /**
     * Injected application configuration variable (injected by the MobileFirst server)
     */
    @Context
    ConfigurationAPI configApi;

    /**
     * A Pool of Redis connections to be used by API Calls
     */
    private JedisPool pool;

    /**
     * Return a Redis connection from the connection pool that was initialised
     *
     * @return a Jedis connection object
     */
    public Jedis getConnection() {

        return pool.getResource();
    }

    /**
     * Initializes the adapter application by allocating a Redis connection pool.
     * <p>
     * Init is called by the MobileFirst Server whenever an Adapter application is deployed or reconfigured. The method
     * than get the redis URL from the configuration parameters and try to open a connection to the Redis server.
     * </p>
     * <p>
     * If the Redis server URL has a valid the Adapter will accept it as a "correct" parameter and will than try to
     * validate that the server is up by connecting to the server and writing/reading some data. If the server cannot
     * be reached, a warning message will be logged.
     * </p>
     * @throws Exception if the Redis URL is invalid
     */
    protected void init() throws Exception {

        logger.info("Initializing a Redis Adapter application");

        final String redisURL = configApi.getPropertyValue("redisURL");
        logger.config(String.format("Redis URL is [%s]", redisURL));

        if (!JedisURIHelper.isValid(new URI(redisURL))) {
            logger.severe(String.format("Redis URL [%s] is invalid", redisURL));
            throw new InvalidURIException(String.format(
                    "Cannot open Redis connection due invalid URI. %s", redisURL));
        }

        try {
            /*
             * Test the connection to the server to validate that the server can be reached
             *
             * 1. Connect to the server
             * 2. Put a string into the server
             * 3. Read the string back, check that it is the same that was put
             * 4. Delete the key in preperation for next time
             */
            logger.fine("Testing connection to the Redis Server");
            // Do we have a server running there ???
            final Jedis j = new Jedis(redisURL);
            j.set("foo", "bar");
            final String foobar = j.get("foo");
            j.del("foo");

            if (foobar.equals("bar")) {
                logger.info(String.format("Sucess: connecting and pinging the Redis server as [%s]", redisURL));
            } else {
                // Something is wrong here... maybe not a redis server? Lets warn the admin
                logger.warning(String.format("Failed: reading data from the Redis server at [%s] failed. Read [%s].",
                        redisURL, foobar));
            }

            // Make sure the connection is closed
            j.close();
        } catch (JedisConnectionException ex) {
            // The Redis server is likely down, warn the administratoor
            ex.printStackTrace();
            logger.warning(String.format("Failed: connecting to the Redis server at [%s] failed. Check if the server is up.",
                    redisURL));
        }
        pool = new JedisPool(new URI(redisURL));

        logger.info("Adapter initialized!");
    }

    /**
     * Deinitilize the adapter application.
     *
     * Called by the MobileFirst server when the adapter is uninstalled and delete the Redis connection pool.
     *
     * @throws Exception in case of an error
     */
    protected void destroy() throws Exception {

        if (pool != null)
            pool.destroy();

        logger.info("Adapter destroyed!");
    }


    protected String getPackageToScan() {
        //The package of this class will be scanned (recursively) to find JAX-RS resources.
        //It is also possible to override "getPackagesToScan" method in order to return more than one package for scanning
        return getClass().getPackage().getName();
    }
}
