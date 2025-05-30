package com.epam.ui.stepdefinitions;

import com.epam.ui.pages.LandingPage;
import com.epam.ui.pages.LoginPage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import lombok.extern.log4j.Log4j2;

import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.getThreadLocalDriver;
import static org.testng.Assert.assertEquals;

@Log4j2
@SuppressWarnings({"FieldCanBeLocal","all"})
public class LoginStep {
    private LoginPage loginPage;
    private LandingPage landingPage;

    @Then("I should see the username field")
    public void isUserNameDisplayed() {
        try {
            loginPage = new LoginPage(getThreadLocalDriver());
            if (loginPage.isEmailInputDisplayed()) {
                log.info("Username field is displayed");
            } else {
                log.error("Username field is not displayed");
            }
        } catch (Exception e) {
            log.error("Error!!!   Failed to check username field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the password field")
    public void isPasswordDisplayed() {
        try {
            loginPage.isPasswordInputDisplayed();
            log.info("Password field is displayed");
        } catch (Exception e) {
            log.error("Error!!!    to check password field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the login button")
    public void isButtonDisplayed() {
        try {
            loginPage.isLoginButtonDisplayed();
            log.info("Login button is displayed");
        } catch (Exception e) {
            log.error("Error!!!   Failed to check login button: {}", e.getMessage());
            throw e;
        }
    }


    @Then("I should see the login page title")
    public void isTitleDisplayed() {
        try {
            loginPage.isLoginPageTitleDisplayed();
            log.info("Login page title is displayed");
        } catch (Exception e) {
            log.error("Error!!!   Failed to check login page title: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the register link")
    public void i_should_see_the_remember_me_checkbox() {
        try {
            loginPage.isRegisterLinkDisplayed();
            log.info("Register link is displayed");
        } catch (Exception e) {
            log.error("Error!!!  Failed to check register link: {}", e.getMessage());
            throw e;
        }

    }
    @When("I enter {string} in the username field for incorrect login test")
    public void iEnterInTheUsernameFieldForIncorrectLoginTest(String username) {
        try {
            loginPage = new LoginPage(getThreadLocalDriver());
            loginPage.enterEmail(username);
            log.info("Entered username: {}", username);

        } catch (Exception e) {
            log.error("Error!!!   Failed to enter username: {}", e.getMessage());
            throw e;
        }

    }

    @When("I enter {string} in the password field for incorrect login test")
    public void iEnterInThePasswordFieldForIncorrectLoginTest(String password) {
        try {
            loginPage.enterPassword(password);
            log.info("Entered password: {}", password);
        } catch (Exception e) {
            log.error("Error!!!   Failed to enter password:{} , {}",password, e.getMessage());
            throw e;
        }
    }

    @When("I click the login button for incorrect login test")
    public void iClickTheLoginButtonForIncorrectLoginTest() {
        try {
            loginPage.clickLoginButton();
            log.info("Clicked the login button");
        } catch (Exception e) {
            log.error("Error!!!   Failed to click the login button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error message {string} for incorrect login test")
    public void iShouldSeeAnErrorMessageForIncorrectLoginTest(String expectedErrorMessage) {
        try {
            String actualErrorMessage = loginPage.getErrorMessageInvalidCredentials();
            assertEquals(actualErrorMessage, expectedErrorMessage,
                    "Error message does not match the expected message");
            log.info("Error message is displayed: {}", expectedErrorMessage);
        } catch (Exception e) {
            log.error("Error!!!   Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }
    @When("I click the login button without entering any credentials")
    public void iClickTheLoginButtonWithoutEnteringAnyCredentials() {
        try {
            loginPage = new LoginPage(getThreadLocalDriver());
            loginPage.clickLoginButton();
            log.info("Clicked the login button without entering any credentials");
        } catch (Exception e) {
            log.error("Error!!!   Failed to click the login button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error message indicating that the fields are required")
    public void iShouldSeeAnErrorMessageIndicatingThatTheFieldsAreRequired() {
        try {
            System.out.println("Error message: " + loginPage.getErrorMessageNoCredentials());
            assertEquals(loginPage.getErrorMessageNoCredentials(), "The password isn't correct. Check it and try again.");
            log.info("Error message is displayed: The password isn't correct. Check it and try again.");
        } catch (Exception e) {
            log.error("Error!!!   Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }
    @When("I enter {string} in the username field")
    public void iEnterUsernameInTheUsernameField(String username) {
        try {
            loginPage = new LoginPage(getThreadLocalDriver());
            loginPage.enterEmail(username);
            log.info("Entered username: {}", username);
        } catch (Exception e) {
            log.error("Error!!!  Failed to enter username: {}", e.getMessage());
        }
    }

    @When("I enter {string} in the password field")
    public void iEnterPasswordInThePasswordField(String password) {
        try {
            loginPage.enterPassword(password);
            log.info("Entered password: {}", password);
        } catch (Exception e) {
            log.error("Error!!!   Failed to enter password: {}", e.getMessage());
        }
    }

    @When("I click the login button")
    public void iClickTheLoginButton() {
        try {
            loginPage.clickLoginButton();
            log.info("Clicked the login button");
        } catch (Exception e) {
            log.error("Error!!!   Failed to click the login button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error message {string}")
    public void iShouldSeeAnErrorMessage(String expectedErrorMessage) {
        try {
            String actualErrorMessage = loginPage.getErrorMessageNoCredentials();
            assertEquals(actualErrorMessage, expectedErrorMessage);
            log.info("Error message is displayed: {}", expectedErrorMessage);
        } catch (Exception e) {
            log.error("Error!!!   Failed to check error message: {}", e.getMessage());
        }
    }
    @Then("I should be redirected to the home page")
    public void iShouldBeRedirectedToTheHomePage() {
        try{
            landingPage = new LandingPage(getThreadLocalDriver());
            String expectedTitle = "Choose a car for rental";
            String actualTitle = landingPage.getLandingPageTitle();
            assertEquals(actualTitle, expectedTitle, "User is not redirected to the home page");
            log.info("User is redirected to the home page");
        } catch (Exception e) {
            log.error("Error!!! Failed to redirect to home page: {}", e.getMessage());
            throw e;
        }
    }

}
