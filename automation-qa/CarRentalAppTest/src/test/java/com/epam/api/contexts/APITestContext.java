package com.epam.api.contexts;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings({"unused"})
public class APITestContext {

    private static final ThreadLocal<APITestContext> threadLocalInstance = ThreadLocal.withInitial(APITestContext::new);

    public static APITestContext getInstance() {
        return threadLocalInstance.get();
    }

    private String baseUrl;
    private Object requestPayload;
    private Response response;
    private String token;
    private RequestSpecification requestSpec;

}