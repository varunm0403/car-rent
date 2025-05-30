package com.epam.api.stepdefinitions;

import com.epam.api.contexts.APITestContext;
import io.cucumber.java.en.And;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.greaterThan;

public class CarsSteps {

    private final APITestContext testContext;

    public CarsSteps() {
        this.testContext = APITestContext.getInstance();
    }

    @And("Response should have car with status {string}")
    public void responseShouldHaveCarWithStatus(String status) {
        testContext.getResponse().then().body("content.findAll { it.status != null }.status", everyItem(equalTo(status)));
    }

    @And("Response should have car with ID {string}")
    public void responseShouldHaveCarWithID(String ID) {
        testContext.getResponse().then().body("carId", equalTo(ID));
    }

    @And("Response should have car with prices less than {int}")
    public void responseShouldHaveCarWithPricesLessThan(int price) {
        testContext.getResponse().then().body("content.findAll { it.pricePerDay != null }.pricePerDay.collect { it.toInteger() }", everyItem(lessThan(price)));
    }

    @And("Response should have car with prices greater than {int}")
    public void responseShouldHaveCarWithPricesGreaterThan(int price) {
        testContext.getResponse().then().body("content.findAll { it.pricePerDay != null }.pricePerDay.collect { it.toInteger() }", everyItem(greaterThan(price)));
    }

    @And("Response should have car with rating equal to {string}")
    public void responseShouldHaveCarWithRatingEqualTo(String rating) {
        testContext.getResponse().then().body("content.findAll { it.carRating != null }.carRating", everyItem(greaterThan(rating)));
    }


//    @And("Response should have car with rating equal to {string}")
//    public void responseShouldHaveCarWithRatingEqualTo(String arg0) {
//    }
}

