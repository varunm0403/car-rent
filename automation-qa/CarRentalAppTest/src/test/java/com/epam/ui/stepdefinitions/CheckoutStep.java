package com.epam.ui.stepdefinitions;

import com.epam.ui.pages.CarBookingPage;
import com.epam.ui.pages.LandingPage;
import com.epam.ui.pages.LoginPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import lombok.extern.log4j.Log4j2;
import org.testng.Assert;

import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.getThreadLocalDriver;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

@Log4j2
@SuppressWarnings({"FieldCanBeLocal"})
public class CheckoutStep {
    private LoginPage loginPage;
    private LandingPage landingPage;
    private CarBookingPage carBookingPage;

    @Then("I should see all checkout page elements")
    public void iShouldSeeAllCheckoutPageElements() {
        try {
            landingPage = new LandingPage(getThreadLocalDriver());
            assertTrue(landingPage.isTitleDisplayed());
            assertTrue(landingPage.isPickupDropdownDisplayed());
            assertTrue(landingPage.isDropOffDropdownDisplayed());
            assertTrue(landingPage.isPickupDateDisplayed());
            assertTrue(landingPage.isDropOffDateDisplayed());
            assertTrue(landingPage.isCarCategoryDropdownDisplayed());
            assertTrue(landingPage.isGearBoxDropdownDisplayed());
            assertTrue(landingPage.isEngineTypeDropdownDisplayed());
            assertTrue(landingPage.isClearFiltersButtonDisplayed());
            assertTrue(landingPage.isFindCarButtonDisplayed());
            assertTrue(landingPage.isClearFiltersButtonEnabled());
        } catch (Exception e) {
            log.error("Error!!! Failed to see all checkout page elements: {}", e.getMessage());
            throw e;
        }
    }

    @When("I choose pickup location as {string}")
    public void iChoosePickupLocationAs(String pickup) {
        try {
            landingPage = new LandingPage(getThreadLocalDriver());
            landingPage.selectPickupOption(pickup);
            log.info("Pickup location selected as {}", pickup);
        } catch (Exception e) {
            log.error("Error!!! Failed to choose pickup location: {}", e.getMessage());
            throw e;
        }
    }

    @And("I choose drop-off location as {string}")
    public void iChooseDropOffLocationAs(String drop) {
        try {
            landingPage = new LandingPage(getThreadLocalDriver());
            landingPage.selectDropOffOption(drop);
            log.info("Drop-off location selected as {}", drop);
        } catch (Exception e) {
            log.error("Error!!! Failed to choose drop-off location: {}", e.getMessage());
            throw e;
        }
    }
    @And("I select the pickup date and drop-off date as {string} and {string} and pickup and dropoff time as {string} and {string}")
    public void iSelectThePickupDateAndDropOffDateAsAndAndPickupAndDropoffTimeAsAnd(String pickDate, String dropDate, String pickTime, String dropTime) {
        try {
            landingPage.selectDate(pickDate, dropDate, pickTime, dropTime);
            log.info("Pickup and drop off date selected");
        } catch (Exception e) {
            log.error("Error!!! Failed to select pickup date: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click on apply button")
    public void iClickOnApplyButton() {
        try {
            landingPage.clickApplyButton();
            log.info("Apply button clicked");
        } catch (Exception e) {
            log.error("Error!!! Failed to click apply button: {}", e.getMessage());
            throw e;
        }
    }

    @And("I select the car type as {string}")
    public void iSelectTheCarTypeAs(String carCategory) {
        try {
            landingPage.selectCarCategory(carCategory);
            log.info("Car category selected as {}", carCategory);
        } catch (Exception e) {
            log.error("Error!!! Failed to select car category: {}", e.getMessage());
            throw e;
        }
    }

    @And("I select the gear box as {string}")
    public void iSelectTheGereBoxAs(String gearBox) {
        try {
            landingPage.selectGearBoxOption(gearBox);
            log.info("Gear box selected as {}", gearBox);
        } catch (Exception e) {
            log.error("Error!!! Failed to select gear box: {}", e.getMessage());
            throw e;
        }
    }

    @And("I select the engine type as {string}")
    public void iSelectTheEngineTypeAs(String engineType) {
        try {
            landingPage.selectEngineTypeOption(engineType);
            log.info("Engine type selected as {}", engineType);
        } catch (Exception e) {
            log.error("Error!!! Failed to select engine type: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click on the find car button")
    public void iClickOnTheFindCarButton() {
        try {
            landingPage.clickFindCarButton();
            log.info("Find car button clicked");
        } catch (Exception e) {
            log.error("Error!!! Failed to click find car button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the available cars")
    public void iShouldSeeTheAvailableCars() {
        try {
            Assert.assertTrue(landingPage.isCarAvailable());
            log.info("Available cars are displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to see available cars: {}", e.getMessage());
            throw e;
        }
    }

    @And("I select the car")
    public void iSelectTheCar() {
        try {
            landingPage.clickBookCarButton();
            log.info("Car selected");
        } catch (Exception e) {
            log.error("Error!!! Failed to select car: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click on the book now button")
    public void iClickOnTheBookNowButton() {
        try {
            landingPage.clickOnBookNowButton();
            log.info("Book now button clicked");
        } catch (Exception e) {
            log.error("Error!!! Failed to click book now button: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the booking confirmation page")
    public void iShouldSeeTheBookingConfirmationPage() {
        try {
            carBookingPage = new CarBookingPage(getThreadLocalDriver());
            assertEquals(carBookingPage.getConfirmBookingTitle(), "Car booking"
                    , "Booking confirmation page title does not match");

            log.info("Booking confirmation page is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to see booking confirmation page: {}", e.getMessage());
            throw e;
        }
    }

    @And("I select the pickup date and drop-off date as {string} and {string} and pickup and dropoff time as {string} and {string} in the Car Card")
    public void iSelectThePickupDateAndDropOffDateAsAndAndPickupAndDropoffTimeAsAndITheCarCard(String pickDate, String dropDate, String pickTime, String dropTime) {
        try {
            landingPage.selectDateInTheCard(pickDate, dropDate, pickTime, dropTime);
            log.info("Pickup and drop off date selected in the car card");
        } catch (Exception e) {
            log.error("Error!!! Failed to select pickup date in the car card: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see message having login button to continue")
    public void iShouldSeeMessageHavingLoginButtonToContinue() {
        try {
            assertTrue(landingPage.isLoginButtonDisplayed());
            log.info("Login button is displayed to continue");
        } catch (Exception e) {
            log.error("Error!!! Failed to see login button: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click on the login button it should redirect to login page")
    public void iClickOnTheLoginButtonItShouldRedirectToLoginPage() {
        try {
            landingPage.clickLoginButton();
            loginPage = new LoginPage(getThreadLocalDriver());
            String expectedTitle = "Log in";
            String actualTitle = loginPage.getLoginPageTitle();
            assertEquals(actualTitle, expectedTitle, "User is not redirected to the login page");
            log.info("Login button clicked");
        } catch (Exception e) {
            log.error("Error!!! Failed to click login button: {}", e.getMessage());
            throw e;
        }
    }
}