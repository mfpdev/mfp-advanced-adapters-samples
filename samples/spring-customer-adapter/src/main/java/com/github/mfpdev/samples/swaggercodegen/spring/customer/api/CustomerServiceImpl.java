/**
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
package com.github.mfpdev.samples.swaggercodegen.spring.customer.api;

import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import com.github.mfpdev.samples.swaggercodegen.spring.customer.model.Customer;
import com.github.mfpdev.samples.swaggercodegen.spring.customer.model.InlineResponse404;
import com.github.mfpdev.samples.swaggercodegen.spring.customer.model.InlineResponse409;

public class CustomerServiceImpl implements CustomersApiService {

	private ConcurrentHashMap<String, Customer> customerStore = new ConcurrentHashMap<String, Customer>();

	@Override
	public Response createCustomer(String contentType,
			String acceptLanguage, Customer customer,
			SecurityContext securityContext) throws NotFoundException {
		if ( customerStore.get(customer.getCustomerId()) != null ) {
			return Response.status(Status.CONFLICT).entity(new InlineResponse409().errorMsg409("Customer already exists by this ID")).build();
		} else {
			customerStore.put(customer.getCustomerId(), customer);
			return Response.status(Status.CREATED).entity(customer).build();
		}
	}

	@Override
	public Response getAllCustomers(String contentType,
			String acceptLanguage, SecurityContext securityContext)
			throws NotFoundException {
		return Response.ok(customerStore.values().toArray()).build();
	}

	@Override
	public Response removeCustomer(String contentType,
			String acceptLanguage, String customerId,
			SecurityContext securityContext) throws NotFoundException {
		if ( customerStore.contains(customerId) ) {
			customerStore.remove(customerId);
			return Response.ok().build();
		} else {
			return Response.status(Status.NOT_FOUND).entity(new InlineResponse404().errorMsg404("Customer by this ID is not found")).build();
		}
	}

	@Override
	public Response getCustomer(String contentType, String acceptLanguage,
			String customerId, SecurityContext securityContext)
			throws NotFoundException {
		if ( customerStore.get(customerId) != null  ) {
			return Response.ok(customerStore.get(customerId)).build();
		} else {
			return Response.status(Status.NOT_FOUND).entity(new InlineResponse404().errorMsg404("Customer by this ID is not found")).build();
		}
	}

}
