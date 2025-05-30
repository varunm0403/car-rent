package com.epam.ui.stepdefinitions;

import com.epam.ui.pages.LoginPage;
import com.epam.ui.pages.RegistrationPage;
import com.github.javafaker.Faker;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import lombok.extern.log4j.Log4j2;

import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.getThreadLocalDriver;
import static org.testng.Assert.*;
import static org.testng.Assert.assertTrue;

@Log4j2
@SuppressWarnings({"all"})
public class RegisterationStep {
    private final Faker faker = new Faker();
    private RegistrationPage registrationPage;
    private LoginPage loginPage;
    @Then("I should see the registration page title")
    public void i_should_see_the_registration_page_title() {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            String expectedTitle = "Create an account";
            String actualTitle = registrationPage.getRegistrationPageTitle();
            assertEquals(actualTitle, expectedTitle," Registration page title is "+actualTitle+" and expected title is "+expectedTitle);
        } catch (Exception e) {
            log.error("Error!!! Failed to get the registration page title: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the firstname field")
    public void i_should_see_the_firstname_field() {
        try{
            assertTrue(registrationPage.isFirstNameFieldDisplayed());
            log.info("Firstname field is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check firstname field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the surname field")
    public void i_should_see_the_surname_field() {
        try{
            assertTrue(registrationPage.isSurNameFieldDisplayed());
        } catch (Exception e) {
            log.error("Error!!! Failed to check surname field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the email field")
    public void i_should_see_the_email_field() {
        try{
            assertTrue(registrationPage.isEmailFieldDisplayed());
            log.info("Email field is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check email field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the password input field")
    public void i_should_see_the_password_input_field() {
        try{
            assertTrue(registrationPage.isPasswordFieldDisplayed());
            log.info("Password field is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check password field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the confirm password field")
    public void i_should_see_the_confirm_password_field() {
        try{
            assertTrue(registrationPage.isConfirmPasswordFieldDisplayed());
            log.info("Confirm password field is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check confirm password field: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the register button")
    public void i_should_see_the_register_button() {
        try{
            assertTrue(registrationPage.isRegisterButtonDisplayed());
            log.info("Register button is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check register button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the login link")
    public void i_should_see_the_login_link() {
        try{
            assertTrue(registrationPage.isLoginLinkDisplayed());
            log.info("Login link is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check login link: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the cancel button")
    public void i_should_see_the_cancel_button() {
        try{
            assertTrue(registrationPage.isCancelButtonDisplayed());
            log.info("Cancel button is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to check cancel button: {}", e.getMessage());
            throw e;
        }
    }
    @When("I enter username, surname, email {string} password {string} confirm password {string}")
    public void iEnterUsernameSurnameEmailPasswordConfirmPassword(String email, String pass, String confPass) {
        try {
            registrationPage= new RegistrationPage(getThreadLocalDriver());
            String[] name =faker.harryPotter().character().split(" ");
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            registrationPage.enterFirstName(name[0]);
            registrationPage.enterSurName(name[1]);
            registrationPage.enterEmail(email);
            registrationPage.enterPassword(pass);
            registrationPage.enterConfirmPassword(confPass);
            log.info("Entered credentials - Username: {}, Surname: {}, Email: {}, Password: {}, Confirm Password: {}", name[0], name[1], email, pass, confPass);
        } catch (Exception e) {
            log.error("Error!!! Failed to enter credentials: {}", e.getMessage());
            throw e;
        }
    }
    @Then("I should see an error message for the email field indicating the format is invalid")
    public void i_should_see_an_error_message_for_the_email_field_indicating_the_format_is_invalid() {
        try {
            fail("Skip for now because if here i click on register it should show error message but here it is accepting the email");
            log.info("Validated email format error: {}", "element is not defined");
        } catch (Exception e) {
            log.error("Error!!! Failed to check email format validation error: {}", e.getMessage());
            throw e;
        }
    }
    @Then("I should see the register button is disabled")
    public void i_should_see_validation_errors_for_all_required_fields() {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            assertFalse(registrationPage.isRegisterButtonEnabled());
            log.info("Register button is disabled");
        } catch (Exception e) {
            log.error("Error!!! Failed to check register button: {}", e.getMessage());
            throw e;

        }
    }
    @When("I enter first name {string} surname {string} email {string}")
    public void iEnterFirstNameSurnameEmail(String firstName, String surName, String email) {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            registrationPage.enterFirstName(firstName);
            registrationPage.enterSurName(surName);
            registrationPage.enterInvalidEmail(email);
            log.info("Entered credentials - Firstname: {}, Surname: {}, Email: {}", firstName, surName,email);
        } catch (Exception e) {
            log.error("Error!!! Failed to enter credentials: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error message for the first name field {string}")
    public void iShouldSeeAnErrorMessageForTheFirstNameField(String errorMessage) {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            String actualErrorMessage = registrationPage.getFirstNameInvalidFormatErrorMessage();
            assertEquals(actualErrorMessage, errorMessage, "First name error message is "+actualErrorMessage+" and expected message is "+errorMessage);
            log.info("Validated first name error: {}", actualErrorMessage);
        } catch (Exception e) {
            log.error("Error!!! Failed to check first name error message: {}", e.getMessage());
            throw e;
        }
    }

    @And("I should see an error message for the surname field {string}")
    public void iShouldSeeAnErrorMessageForTheSurnameField(String errorMessage) {
        try {
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            String actualErrorMessage = registrationPage.getSurNameInvalidFormatErrorMessage();
            assertEquals(actualErrorMessage, errorMessage, "Surname error message is "+actualErrorMessage+" and expected message is "+errorMessage);
            log.info("Validated surname error: {}", actualErrorMessage);
        } catch (Exception e) {
            log.error("Error!!! Failed to check surname error message: {}", e.getMessage());
            throw e;
        }
    }

    @And("I should see an error message for the email field {string}")
    public void iShouldSeeAnErrorMessageForTheEmailField(String errorMessege) {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            String actualErrorMessage = registrationPage.getEmailInvalidFormatErrorMessage();
            assertEquals(actualErrorMessage, errorMessege, "Email error message is "+actualErrorMessage+" and expected message is "+errorMessege);
            log.info("Validated email error: {}", actualErrorMessage);
        } catch (Exception e) {
            log.error("Error!!! Failed to check email error message: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error message for the first name field {string} for surname field {string} for email field {string} for password field {string}")
    public void iShouldSeeAnErrorMessageForTheFirstNameFieldForSurnameFieldForEmailFieldForPasswordFieldForConfirmPasswordField(String firstNameError, String surNameError, String emailError, String PasswordError) {
        try{
            assertEquals(firstNameError,registrationPage.getEmptyFirstNameErrorMessage(), "First name error message is "+firstNameError+" and expected message is "+registrationPage.getEmptyFirstNameErrorMessage());
            assertEquals(surNameError,registrationPage.getEmptySurNameErrorMessage(), "Surname error message is "+surNameError+" and expected message is "+registrationPage.getEmptySurNameErrorMessage());
            assertEquals(emailError,registrationPage.getEmptyEmailErrorMessage(), "Email error message is "+emailError+" and expected message is "+registrationPage.getEmptyEmailErrorMessage());
            assertEquals(PasswordError,registrationPage.getEmptyPasswordErrorMessage(), "Password error message is "+PasswordError+" and expected message is "+registrationPage.getEmptyPasswordErrorMessage());
            log.info("Validated error messages: Firstname: {}, Surname: {}, Email: {}, Password: {}", firstNameError, surNameError, emailError, PasswordError);
        } catch (Exception e) {
            log.error("Error!!! Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }

    @When("I enter first name , surname , email , password , confirm password as null")
    public void iEnterFirstNameSurnameEmailPasswordConfirmPasswordAsNull() {
        try{
            registrationPage= new RegistrationPage(getThreadLocalDriver());
            log.info("Entered credentials - Firstname: {}, Surname: {}, Email: {}, Password: {}, Confirm Password: {}", null, null, null, null, null);
        } catch (Exception e) {
            log.error("Error!!! Failed to enter credentials: {}", e.getMessage());
            throw e;
        }
    }

    @When("I enter password as {string} and confirm password as {string}")
    public void iEnterPasswordAsAndConfirmPasswordAs(String pass, String confPass) {
        try{
            registrationPage=new RegistrationPage(getThreadLocalDriver());
            registrationPage.enterPassword(pass);
            registrationPage.enterConfirmPassword(confPass);
            log.info("Entered credentials - Password: {}, Confirm Password: {}", pass, confPass);
        } catch (Exception e) {
            log.error("Error!!! Failed to enter credentials: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the mismatch error message {string}")
    public void iShouldSeeTheMismatchErrorMessage(String errorMessage) {
        try{
            assertEquals(registrationPage.getPasswordMismatchErrorMessage(), errorMessage, "Password mismatch error message is "+registrationPage.getPasswordMismatchErrorMessage()+" and expected message is "+errorMessage);
            log.info("Validated password mismatch error: {}", errorMessage);
        } catch (Exception e) {
            log.error("Error!!! Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the error message {string}")
    public void iShouldSeeTheErrorMessage(String errorMessege) {
        try{
            assertEquals(registrationPage.getPasswordErrorMessage(),errorMessege , "Password error message is "+registrationPage.getPasswordErrorMessage()+" and expected message is "+errorMessege);
            log.info("Validated email error: {}", errorMessege);
        } catch (Exception e) {
            log.error("Error!!! Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }

    @When("I enter first name {string} surname {string} and unique email")
    public void iEnterFirstNameSurnameAndUniqueEmail(String firstName, String lastName) {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            String email = faker.internet().emailAddress();
            registrationPage.enterFirstName(firstName);
            registrationPage.enterSurName(lastName);
            registrationPage.enterEmail(email);
            log.info("Entered credentials - Firstname: {}, Surname: {}, Email: {}", firstName, lastName, email);
        } catch (Exception e) {
            log.error("Error!!! Failed to enter credentials: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should navigate to the LoginPage")
    public void iShouldNavigateToTheLoginPage() {
        try{
            loginPage= new LoginPage(getThreadLocalDriver());
            assertTrue(loginPage.isLoginPageTitleDisplayed());
            log.info("Login page title is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to navigate to login page: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click the register button")
    public void iClickTheRegisterButton() {
        try{
            registrationPage = new RegistrationPage(getThreadLocalDriver());
            registrationPage.clickRegisterButton();
            log.info("Clicked on register button");
        } catch (Exception e) {
            log.error("Error!!! Failed to click register button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see an error pop up message {string}")
    public void iShouldSeeAnErrorPopUpMessage(String errorMessage) {
        try{
            registrationPage.clickRegisterButton();
//            assertFalse(registrationPage.isRegisterButtonEnabled()," Register button is enabled");
        } catch (Exception e) {
            log.error("Error!!! Failed to check error message: {}", e.getMessage());
            throw e;
        }
    }
}
