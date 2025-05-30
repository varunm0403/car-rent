package com.epam.api.stepdefinitions;

import com.epam.api.contexts.APITestContext;
import com.epam.api.entity.Login;
import io.cucumber.java.en.Given;

public class LoginSteps {

    private final APITestContext testContext;

    public LoginSteps() {
        this.testContext = APITestContext.getInstance();
    }

    @Given("I use credentials {string} and {string} for login")
    public void iUseCredentialsAndForLogin(String email, String password) {
        Login login = Login
                .builder()
                .email(email)
                .password(password)
                .build();
        testContext.setRequestPayload(login);
    }
}
