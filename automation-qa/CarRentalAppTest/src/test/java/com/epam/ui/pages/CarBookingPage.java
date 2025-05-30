package com.epam.ui.pages;

import com.epam.ui.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;


@SuppressWarnings({"unused"})
public class CarBookingPage extends BasePage {
    public CarBookingPage(WebDriver driver) {
        super(driver);
    }

    @FindBy(xpath = "//h1[normalize-space()='Car booking']")
    private WebElement confirmBookingTitle;
    @FindBy(xpath = "//button[normalize-space()='Confirm Booking']")
    private WebElement confirmBookingButton;
    @FindBy(xpath = "(//p[text()='Personal Info']//following-sibling::div//p)[2]")
    private WebElement userName;
    @FindBy(xpath = "(//p[@class='font-medium'])[1]")
    private WebElement pickupLocation;
    @FindBy(xpath = "(//p[@class='font-medium'])[2]")
    private WebElement dropOffLocation;
    @FindBy(xpath = "(//p[@class='font-medium'])[3]")
    private WebElement pickupDateAndTime;
    @FindBy(xpath = "(//p[@class='font-medium'])[4]")
    private WebElement dropOffDateAndTime;
    @FindBy(xpath = "//p[@class='text-xl font-semibold mt-2']")
    private WebElement carName;
    @FindBy(xpath = "//button[normalize-space()='OK']")
    private WebElement okButton;
    @FindBy(xpath = "(//button[text()='Change'])[1]")
    private WebElement changeLocation;
    @FindBy(xpath = "(//button[text()='Change'])[2]")
    private WebElement changeDate;
    @FindBy(xpath = "(//select)[1]")
    private WebElement pickupTime;
    @FindBy(xpath = "(//select)[2]")
    private WebElement dropOffTime;
    @FindBy(xpath = "//a[contains(text(),'My Bookings')]")
    private WebElement myBookingsButton;


    public String getConfirmBookingTitle() {
        return getText(confirmBookingTitle);
    }

    public String getBookingUserName() {
        return getText(userName);
    }

    public String getPickupLocation() {
        return getText(pickupLocation);
    }

    public String getDropOffLocation() {
        return getText(dropOffLocation);
    }

    public String getPickupDateAndTime() {
        return getText(pickupDateAndTime);
    }

    public String getDropOffDateAndTime() {
        return getText(dropOffDateAndTime);
    }

    public String getCarName() {
        return getText(carName);
    }

    public void clickConfirmBookingButton() {
        clickButton(confirmBookingButton);
    }

    public void clickOkButton() {
        clickButton(okButton);
    }

    public void clickChangeLocation() {
        clickButton(changeLocation);
    }

    public void clickChangeDate() {
        clickButton(changeDate);
    }
    public void selectPickupOption(String optionText) {
        selectOptions(pickupTime, optionText);
    }
    public void selectDropOffOption(String optionText) {
        selectOptions(dropOffTime, optionText);
    }
    public void selectPickupDate(String pickupDate) {
        String pickXpath="(//div[text()= "+pickupDate+" ])[1]";
        WebElement pickupDateElement = driver.findElement(By.xpath(pickXpath));
        clickButton(pickupDateElement);
    }
    public void selectDropOffDate(String dropOffDate) {
        String dropXpath="(//div[text()= "+dropOffDate+" ])[2]";
        WebElement dropOffDateElement = driver.findElement(By.xpath(dropXpath));
        clickButton(dropOffDateElement);
    }
    public void refreshPage(){
        driver.navigate().refresh();
    }
    public void clickMyBookingsButton() {
        clickButton(myBookingsButton);
    }
}
