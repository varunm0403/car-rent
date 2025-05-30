    package com.epam.api.stepdefinitions;

    import com.epam.api.ConfigReader;
    import com.epam.api.contexts.APITestContext;
    import io.cucumber.java.en.*;
    import io.restassured.builder.RequestSpecBuilder;
    import io.restassured.builder.ResponseSpecBuilder;
    import io.restassured.http.ContentType;
    import io.restassured.response.Response;
    import io.restassured.specification.RequestSpecification;
    import io.restassured.specification.ResponseSpecification;
    import org.testng.Assert;

    import java.util.Map;

    import static io.restassured.RestAssured.given;
    import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
    import static org.hamcrest.Matchers.containsString;
    import static org.hamcrest.Matchers.equalTo;

    public class CommonSteps {

        private final APITestContext testContext;

        public CommonSteps() {
            this.testContext = APITestContext.getInstance();
        }

        @Given("I use the base URL")
        public void setBaseUrl() {
            String baseUrl = ConfigReader.getBackendURL();

            if (baseUrl == null || baseUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Base URI cannot be null or empty. Please check your configuration.");
            }

            testContext.setBaseUrl(baseUrl);

            RequestSpecification requestSpec = new RequestSpecBuilder()
                    .setBaseUri(baseUrl)
                    .setContentType(ContentType.JSON)
                    .build();

            testContext.setRequestSpec(requestSpec);
        }

        @Given("I set the header {string} to {string}")
        public void setHeader(String headerName, String headerValue) {
            RequestSpecification requestSpec = testContext.getRequestSpec();
            requestSpec = requestSpec.header(headerName, headerValue);
            testContext.setRequestSpec(requestSpec);
        }

        @Given("I set the request body to {string}")
        public void setRequestBody(String requestBody) {
            testContext.setRequestPayload(requestBody);
            RequestSpecification requestSpec = testContext.getRequestSpec();
            requestSpec = requestSpec.body(requestBody);
            testContext.setRequestSpec(requestSpec);
        }

        @When("I send a GET request to {string}")
        public void sendGetRequest(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec()).get(endpoint);
            testContext.setResponse(response);
        }

        @When("I send a GET request to {string} with my token")
        public void sendGetRequestWithToken(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec())
                    .header("Authorization", "Bearer " + testContext.getToken())
                    .get(endpoint);
            testContext.setResponse(response);
        }

        @When("I send a POST request to {string} with my request payload")
        public void sendPostRequest(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec())
                    .body(testContext.getRequestPayload())
                    .post(endpoint);
            testContext.setResponse(response);
            System.out.println(response.prettyPrint());
        }

        @When("I send a POST request to {string} with my request payload and token")
        public void sendPostRequestWithToken(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec())
                    .header("Authorization", "Bearer " + testContext.getToken())
                    .body(testContext.getRequestPayload())
                    .post(endpoint);
            testContext.setResponse(response);
        }

        @When("I send a PUT request to {string} with my request payload and token")
        public void sendPutRequestWithToken(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec())
                    .header("Authorization", "Bearer " + testContext.getToken())
                    .body(testContext.getRequestPayload())
                    .put(endpoint);
            testContext.setResponse(response);
            response.then().log().all();
        }

        @When("I send a PUT request to {string} with my request payload")
        public void sendPutRequest(String endpoint) {
            Response response = given().spec(testContext.getRequestSpec())
                    .body(testContext.getRequestPayload())
                    .put(endpoint);
            testContext.setResponse(response);
            response.then().log().all();
        }

        @Then("I should see the response status code as {int}")
        public void verifyStatusCode(int statusCode) {
            ResponseSpecification responseSpec = new ResponseSpecBuilder()
                    .expectStatusCode(statusCode)
                    .build();
            testContext.getResponse().then().spec(responseSpec);
        }

        @Then("I should see the success message as {string}")
        public void verifySuccessMessage(String message) {
            testContext.getResponse().then().body("message", equalTo(message));
        }

        @And("I should see the error message containing {string}")
        public void verifyErrorMessage(String message) {
            testContext.getResponse().then().body("message", containsString(message));
        }

        @Then("I should see the response containing the {string} role")
        public void verifyRole(String role) {
            testContext.getResponse().then().body("role", equalTo(role));
        }

        @Then("I should see a valid token in the response")
        public void verifyToken() {
            String token = testContext.getResponse().jsonPath().getString("data.token");
            Assert.assertNotNull(token, "Token should not be null");
            testContext.setToken(token);
        }

        @And("I should see the response matching the {string} schema")
        public void responseShouldMatchTheSchema(String schemaName) {
            testContext.getResponse().then().assertThat()
                    .body(matchesJsonSchemaInClasspath("schemas/"+schemaName + ".json"));
        }

        @Given("I set the following query parameters")
        public void setQueryParameters(io.cucumber.datatable.DataTable dataTable) {
            RequestSpecification requestSpec = testContext.getRequestSpec();
            Map<String, String> queryParams = dataTable.asMap(String.class, String.class);
            for (Map.Entry<String, String> entry : queryParams.entrySet()) {
                requestSpec = requestSpec.queryParam(entry.getKey(), entry.getValue());
            }
            testContext.setRequestSpec(requestSpec);
        }
    }