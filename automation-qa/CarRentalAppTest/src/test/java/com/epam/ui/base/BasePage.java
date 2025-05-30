package com.epam.ui.base;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static java.time.Duration.ofSeconds;
import static org.openqa.selenium.support.PageFactory.initElements;

@SuppressWarnings({"unused"})
public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, ofSeconds(20));
        initElements(driver, this);
    }

    protected String getText(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        return element.getText();
    }

    protected String getTitle() {
        return driver.getTitle();
    }
    protected void sendQuery(WebElement element, String query) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.clear();
        element.sendKeys(query);
    }
    protected void clickButton(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
        element.click();
    }
    protected boolean isElementDisplayed(WebElement element) {
            wait.until(ExpectedConditions.visibilityOf(element));
            return element.isDisplayed();
    }
    protected void selectOptions(WebElement element, String option) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
        Select select = new Select(element);
        select.selectByVisibleText(option);
    }
    protected void isElementEnabled(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.isEnabled();
    }
    protected void acceptPopup(){
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
    }
    protected void dismissPopup(){
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().dismiss();
    }
}
