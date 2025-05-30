package com.epam.ui.stepdefinitions;

import com.epam.ui.pages.CarBookingPage;
import com.epam.ui.pages.MyBookingsPage;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import lombok.extern.log4j.Log4j2;
import org.testng.asserts.SoftAssert;


import java.util.Map;

import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.getThreadLocalDriver;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;


@Log4j2
public class ConfirmBookingStep {
    private CarBookingPage carBookingPage;
    private MyBookingsPage myBookingsPage;
    private final SoftAssert softAssert = new SoftAssert();

    @Given("I am in the booking confirmation page")
    public void iAmInTheBookingConfirmationPage() {
        try {
            carBookingPage = new CarBookingPage(getThreadLocalDriver());
            log.info("Booking confirmation page is displayed");
        } catch (Exception e) {
            log.error("Error!!! Failed to navigate to booking confirmation page: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the booking confirmation page with the following details:")
    public void iShouldSeeTheBookingConfirmationPageWithTheFollowingDetails(DataTable dataTable) {
        Map<String, String> bookingDetails = dataTable.asMap(String.class, String.class);

        String expectedPageTitle = bookingDetails.get("Page Title");
        String expectedPickupLocation = bookingDetails.get("Pickup Location");
        String expectedDropOffLocation = bookingDetails.get("Drop-off Location");
        String expectedPickupDate = "May " + bookingDetails.get("Pickup Date") + ", 2025 | " + bookingDetails.get("Pickup Time");
        String expectedDropOffDate = "May " + bookingDetails.get("Drop-off Date") + ", 2025 | " + bookingDetails.get("Drop-off Time");
        String expectedCarName = bookingDetails.get("Car Name");

        String actualPageTitle = carBookingPage.getConfirmBookingTitle();
        String actualPickupLocation = carBookingPage.getPickupLocation();
        String actualDropOffLocation = carBookingPage.getDropOffLocation();
        String actualPickupDate = carBookingPage.getPickupDateAndTime();
        String actualDropOffDate = carBookingPage.getDropOffDateAndTime();
        String actualCarName = carBookingPage.getCarName();

        softAssert.assertEquals(actualPageTitle, expectedPageTitle, "Page Title mismatch");
        softAssert.assertEquals(actualPickupLocation, expectedPickupLocation, "Pickup Location mismatch");
        softAssert.assertEquals(actualDropOffLocation, expectedDropOffLocation, "Drop-off Location mismatch");
        softAssert.assertEquals(actualPickupDate, expectedPickupDate, "Pickup Date mismatch");
        softAssert.assertEquals(actualDropOffDate, expectedDropOffDate, "Drop-off Date mismatch");
        softAssert.assertEquals(actualCarName, expectedCarName, "Car Name mismatch");
        softAssert.assertAll();
    }

    @When("I click the Confirm Booking button")
    public void iClickTheConfirmBookingButton() {
        try {
            carBookingPage.clickConfirmBookingButton();
            log.info("Clicked on Confirm Booking button");
        } catch (Exception e) {
            log.error("Error!!! Failed to click Confirm Booking button: {}", e.getMessage());
            throw e;
        }
    }
    @And("I accept Confirmation message")
    public void iAcceptConfirmationMessage() {
        try {
            carBookingPage.clickOkButton();
            log.info("Accepted confirmation message");
        } catch (Exception e) {
            log.error("Error!!! Failed to accept confirmation message: {}", e.getMessage());
            throw e;
        }
    }
    @Then("I should see the The car {string} in my Bookings page")
    public void iShouldSeeTheTheCarInMyBookingsPage(String expectedCarModel) {
        try {
            myBookingsPage = new MyBookingsPage(getThreadLocalDriver());
            String actualBookingTitle = myBookingsPage.getMyBookingsTitle();
            String expectedBookingTitle = "My Bookings";
            String actualCarModel = myBookingsPage.getCarModel();
            softAssert.assertEquals(actualCarModel, expectedCarModel, "Car model mismatch");
            softAssert.assertEquals(actualBookingTitle, expectedBookingTitle, "Booking title mismatch");
            softAssert.assertAll();
            log.info("Booking is displayed in My Bookings page");
        } catch (Exception e) {
            log.error("Error!!! Failed to verify booking in Bookings page: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the cancel button is not disabled")
    public void iShouldSeeTheCancelButtonIsNotDisabled() {
        try{
            myBookingsPage = new MyBookingsPage(getThreadLocalDriver());
            myBookingsPage.clickEditButton();
            boolean cancelButtonStatus = myBookingsPage.cancelButtonStatus();
            assertFalse(cancelButtonStatus, "Cancel button is disabled");
            log.info("Cancel button is not disabled");
        } catch (Exception e) {
            log.error("Error!!! Failed to verify cancel button is not disabled: {}", e.getMessage());
            throw e;
        }
    }

    @When("I click the Cancel Booking button")
    public void iClickTheCancelBookingButton() {
        try {
            myBookingsPage= new MyBookingsPage(getThreadLocalDriver());
            myBookingsPage.clickCancelButton();
            log.info("Clicked on Cancel Booking button");
        } catch (Exception e) {
            log.error("Error!!! Failed to click Cancel Booking button: {}", e.getMessage());
            throw e;
        }
    }

    @And("I accept Cancellation message")
    public void iAcceptCancellationMessage() {
        try {
            myBookingsPage.clickConfirmCancelButton();
            log.info("Accepted cancellation message");
        } catch (Exception e) {
            log.error("Error!!! Failed to accept cancellation message: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the The car in cancellation section")
    public void iShouldSeeTheTheCarInCancellationSection() {
        try {
            myBookingsPage.clickCancellationTab();
            String actualCarModel = myBookingsPage.getCarModel();
            String expectedCarModel = "Audi A6 Quattro 2023";
            softAssert.assertEquals(actualCarModel, expectedCarModel, "Car model mismatch");
            softAssert.assertAll();
            log.info("Booking is displayed in Cancellation section");
        } catch (Exception e) {
            log.error("Error!!! Failed to verify booking in Cancellation section: {}", e.getMessage());
            throw e;
        }
    }

    @When("I change the pickup time to {string}")
    public void iChangeThePickupTimeTo(String pickUpTime) {
        try {
            carBookingPage.selectPickupOption(pickUpTime);
            log.info("Changed the pickup time to {}", pickUpTime);
        } catch (Exception e) {
            log.error("Error!!! Failed to change pickup time: {}", e.getMessage());
            throw e;
        }
    }

    @And("I change the dropoff time to {string}")
    public void iChangeTheDropoffTimeTo(String dropOffTime) {
        try {
            carBookingPage.selectDropOffOption(dropOffTime);
            log.info("Changed the dropoff time to {}", dropOffTime);
        } catch (Exception e) {
            log.error("Error!!! Failed to change dropoff time: {}", e.getMessage());
            throw e;
        }
    }

    @When("I click on the change Date and Time button")
    public void iClickOnTheChangeDateAndTimeButton() {
        try {
            carBookingPage.clickChangeDate();
            log.info("Clicked on Change Date and Time button");
        } catch (Exception e) {
            log.error("Error!!! Failed to click Change Date and Time button: {}", e.getMessage());
            throw e;
        }
    }

    @When("I change the pickup date to {string}")
    public void iChangeThePickupDateTo(String pickDate) {
        try {
            carBookingPage.selectPickupDate(pickDate);
            log.info("Changed the pickup date to {}", pickDate);
        } catch (Exception e) {
            log.error("Error!!! Failed to change pickup date: {}", e.getMessage());
            throw e;
        }
    }
    @When("I change the dropoff date to {string}")
    public void iChangeTheDropoffDateTo(String dropDate) {
        try {
            carBookingPage.selectDropOffDate(dropDate);
            log.info("Changed the dropoff date to {}", dropDate);
        } catch (Exception e) {
            log.error("Error!!! Failed to change dropoff date: {}", e.getMessage());
            throw e;
        }
    }

    @When("I click on the change Location button")
    public void iClickOnTheChangeLocationButton() {
        try {
            carBookingPage.clickChangeLocation();
            log.info("Clicked on Change Location button");
        } catch (Exception e) {
            log.error("Error!!! Failed to click Change Location button: {}", e.getMessage());
            throw e;
        }
    }
    @And("I change the pickup location to {string}")
    public void iChangeThePickupLocationTo(String pickupLocation) {
        try {
            carBookingPage.selectPickupOption(pickupLocation);
            log.info("Changed the pickup location to {}", pickupLocation);
        } catch (Exception e) {
            log.error("Error!!! Failed to change pickup location: {}", e.getMessage());
            throw e;
        }
    }
    @And("I change the dropoff location to {string}")
    public void iChangeTheDropoffLocationTo(String dropOffLocation) {
        try {
            carBookingPage.selectDropOffOption(dropOffLocation);
            log.info("Changed the dropoff location to {}", dropOffLocation);
        } catch (Exception e) {
            log.error("Error!!! Failed to change dropoff location: {}", e.getMessage());
            throw e;
        }
    }

    @When("I am refresh the page")
    public void iAmRefreshThePage() {
        try{
            carBookingPage.refreshPage();
            log.info("refresh the page ");
        } catch (Exception e) {
            log.error("Error!!! Failed in session: {}", e.getMessage());
            throw e;
        }
    }

    @When("I navigate to service started tab")
    public void iNavigateToServiceStartedTab() {
        try{
            myBookingsPage=new MyBookingsPage(getThreadLocalDriver());
            myBookingsPage.clickServiceStartedTab();
        } catch (Exception e) {
            log.error("Error!!! Failed in display car in service started tab: {}", e.getMessage());
            throw e;
        }
    }

    @Then("I should see the car in that the car model should be {string}")
    public void iShouldSeeTheCarInThatTheCarModelShouldBe(String model) {
        try{
            assertEquals(myBookingsPage.getCarModel(),model,"the car model is not matching");
        } catch (Exception e) {
            log.error("Error!!! Failed in display car model in service started tab: {}", e.getMessage());
            throw e;
        }
    }

    @And("I click on my bookings button")
    public void iClickOnMyBookingsButton() {
        try{
            carBookingPage= new CarBookingPage(getThreadLocalDriver());
            carBookingPage.clickMyBookingsButton();
            log.info("Clicked on My Bookings button");
        } catch (Exception e) {
            log.error("Error!!! Failed in display car in my bookings tab: {}", e.getMessage());
            throw e;
        }
    }
}