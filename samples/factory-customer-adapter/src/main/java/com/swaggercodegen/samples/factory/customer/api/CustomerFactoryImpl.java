package com.swaggercodegen.samples.factory.customer.api;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import com.swaggercodegen.samples.factory.customer.model.Customer;
import com.swaggercodegen.samples.factory.customer.model.InlineResponse200;
import com.swaggercodegen.samples.factory.customer.model.InlineResponse409;

public class CustomerFactoryImpl implements CustomersApiServiceFactoryIfc {

	private static CustomerApiServiceImpl customerServiceImpl = null;
	
	@Override
	public CustomersApiService getCustomersApiService() {
		// TODO Auto-generated method stub
		if ( customerServiceImpl == null ) {
			customerServiceImpl = new CustomerApiServiceImpl();
		}
		return customerServiceImpl;
	}
	
	class CustomerApiServiceImpl implements CustomersApiService {
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
				return Response.status(Status.NOT_FOUND).entity(new InlineResponse409().errorMsg409("Customer by this ID is not found")).build();
			}
		}

		@Override
		public Response getCustomer(String contentType, String acceptLanguage,
				String customerId, SecurityContext securityContext)
				throws NotFoundException {
			if ( customerStore.get(customerId) != null  ) {
				return Response.ok(customerStore.get(customerId)).build();
			} else {
				return Response.status(Status.NOT_FOUND).entity(new InlineResponse409().errorMsg409("Customer by this ID is not found")).build();
			}
		}
		
	}
}
