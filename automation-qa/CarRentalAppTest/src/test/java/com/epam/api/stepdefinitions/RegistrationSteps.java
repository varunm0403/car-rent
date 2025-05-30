package com.epam.api.stepdefinitions;

import com.epam.api.contexts.APITestContext;
import com.epam.api.entity.Registration;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.en.Given;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

public class RegistrationSteps {

    private final APITestContext testContext;
    private static Map<String, Map<String, Object>> validRegistrationData;
    private static Map<String, Map<String, Object>> invalidRegistrationData;

    public RegistrationSteps() {
        this.testContext = APITestContext.getInstance();
    }

    private void loadTestData() throws Exception {
        if (validRegistrationData == null || invalidRegistrationData == null) {
            ObjectMapper objectMapper = new ObjectMapper();
            validRegistrationData = objectMapper.readValue(
                    Files.readAllBytes(Paths.get("src/test/resources/data/valid_registration_data.json")),
                    new TypeReference<Map<String, Map<String, Object>>>() {});
            invalidRegistrationData = objectMapper.readValue(
                    Files.readAllBytes(Paths.get("src/test/resources/data/invalid_registration_data.json")),
                    new TypeReference<Map<String, Map<String, Object>>>() {});
        }
    }

    @Given("I load valid {string} registration details")
    public void loadValidRegistrationDetails(String testCase) throws Exception {
        loadTestData();
        Map<String, Object> data = validRegistrationData.get(testCase);
        Registration registration = mapToRegistration(data);
        testContext.setRequestPayload(registration);
    }

    @Given("I load invalid {string} registration details")
    public void loadInvalidRegistrationDetails(String testCase) throws Exception {
        loadTestData();
        Map<String, Object> data = invalidRegistrationData.get(testCase);
        Registration registration = mapToRegistration(data);
        testContext.setRequestPayload(registration);
    }

    private Registration mapToRegistration(Map<String, Object> data) {
        return Registration.builder()
                .firstName((String) data.getOrDefault("firstName", null))
                .lastName((String) data.getOrDefault("lastName", null))
                .email((String) data.getOrDefault("email", null))
                .password((String) data.getOrDefault("password", null))
                .build();
    }
}
