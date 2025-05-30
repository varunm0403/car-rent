package com.epam.ui.pages;

import com.epam.ui.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;


@SuppressWarnings({"unused"})

public class MyBookingsPage extends BasePage {
    public MyBookingsPage(WebDriver driver) {
        super(driver);
    }
    @FindBy(xpath = "//p[@id='bookings-title']")
    private WebElement myBookingsTitle;
    @FindBy(xpath = "//p[@id='car-model']")
    private WebElement carModel;
    @FindBy(xpath = "//button[@id='edit-button-0']")
    private WebElement editButton;
    @FindBy(xpath = "//button[@id='cancel-button-0']")
    private WebElement cancelButton;
    @FindBy(xpath = "//li[@id='desktop-tab-5']")
    private WebElement cancellationTab;
    @FindBy(xpath = "//li[@id='desktop-tab-2']")
    private WebElement serviceStartedTab;

    public String getMyBookingsTitle() {
        return getText(myBookingsTitle);
    }
    public String getCarModel() {
        return getText(carModel);
    }
    public void clickEditButton() {
        clickButton(editButton);
    }
    public boolean cancelButtonStatus() {
        try{
            WebElement cancel = driver.findElement(By.xpath("//button[@id='cancel-button-0']"));
            return isElementDisplayed(cancel);
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    public void clickCancelButton() {
        clickButton(cancelButton);
    }
    public void clickConfirmCancelButton() {
        WebElement confirmCancelButton = driver.findElement(By.xpath("//button[text()=' Yes, Cancel ']"));
        clickButton(confirmCancelButton);
    }
    public void clickCancellationTab() {
        clickButton(cancellationTab);
    }

    public void clickServiceStartedTab(){
        clickButton(serviceStartedTab);
    }

}
