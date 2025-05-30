package com.epam.ui.stepdefinitions;

import com.epam.ui.hooks.Hooks;
import io.cucumber.java.en.Given;
import lombok.extern.log4j.Log4j2;

import java.util.Properties;

import static com.epam.ui.utils.NavigationUtils.openPage;
import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.getThreadLocalDriver;

@Log4j2
public class CommonSteps {
    private final Properties properties= Hooks.getProperties();

    @Given("I am on the login page")
    public void openLoginPage() {
        try {
            openPage(getThreadLocalDriver(), properties.getProperty("url.login"));
            log.info("Navigated to the login page");
        } catch (Exception e) {
            log.error("Error!!! Failed to navigate  to login url: {}", properties.getProperty("url.login"));
            throw e;
        }
    }
    @Given("User is on Registration Page")
    public void userIsOnRegistrationPage() {
        try{
            openPage(getThreadLocalDriver(), properties.getProperty("url.register"));
            log.info("Navigated to the registration page");
        } catch (Exception e) {
            log.error("Error!!! Failed to navigate to Registeration url: {}", properties.getProperty("url.register"));
            throw e;
        }
    }

    @Given("I am on the landing page and not logged in")
    public void iAmOnTheLandingPageAndNotLoggedIn() {
        try {
            openPage(getThreadLocalDriver(), properties.getProperty("url.landing"));
            log.info("Navigated to the landing page");
        } catch (Exception e) {
            log.error("Error!!! Failed to navigate to landing url: {}", properties.getProperty("url.landing"));
            throw e;
        }
    }
}
