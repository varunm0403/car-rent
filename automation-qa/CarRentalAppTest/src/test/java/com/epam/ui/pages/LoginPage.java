package com.epam.ui.pages;

import com.epam.ui.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

@SuppressWarnings({"unused", "ConstantConditions"})
public class LoginPage extends BasePage {
    public LoginPage(WebDriver driver) {
        super(driver);
    }

    @FindBy(xpath = "//h1[normalize-space()='Log in']")
    private WebElement loginPageTitle;
    @FindBy(xpath = "//input[@placeholder='Write your email']")
    private WebElement emailInput;
    @FindBy(xpath = "//input[@placeholder='Write your password']")
    private WebElement passwordInput;
    @FindBy(xpath = "//button[normalize-space()='Login']")
    private WebElement loginButton;
    @FindBy(xpath = "//span[@class='text-black font-semibold cursor-pointer']")
    private WebElement registerLink;


    public void cancelPopup() {
        dismissPopup();
    }

    public String getLoginPageTitle() {
        return getText(loginPageTitle);
    }

    public void enterEmail(String email) {
        sendQuery(emailInput, email);
    }

    public void enterPassword(String password) {
        sendQuery(passwordInput, password);
    }

    public void clickLoginButton() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        clickButton(loginButton);
    }

    public void clickRegisterLink() {
        clickButton(registerLink);
    }

    public boolean isLoginPageTitleDisplayed() {
        return isElementDisplayed(loginPageTitle);
    }

    public boolean isEmailInputDisplayed() {
        return isElementDisplayed(emailInput);
    }

    public void isPasswordInputDisplayed() {
        isElementDisplayed(passwordInput);
    }

    public void isLoginButtonDisplayed() {
        isElementDisplayed(loginButton);
    }

    public void isRegisterLinkDisplayed() {
        isElementDisplayed(registerLink);
    }

    public String getErrorMessageNoCredentials() {
        String xpath = "//button[contains(text(), 'Login')]/ancestor::form/following-sibling::div/p";
        WebElement errorMessage = null;
        for (int attempt = 0; attempt < 3; attempt++) {
            errorMessage = driver.findElement(By.xpath(xpath));
            if (errorMessage.isDisplayed()) {
                wait.until(ExpectedConditions.visibilityOf(errorMessage));
                break;
            }
        }
        return errorMessage != null ? getText(errorMessage) : "";
    }

    public String getErrorMessageInvalidCredentials() {
        String xpath = "//button[contains(text(), 'Login')]/ancestor::form/following-sibling::div/p";
        WebElement errorMessage = null;
        for (int attempt = 0; attempt < 3; attempt++) {
            errorMessage = driver.findElement(By.xpath(xpath));
            if (errorMessage.isDisplayed()) {
                wait.until(ExpectedConditions.visibilityOf(errorMessage));
                break;
            }
        }
        return errorMessage != null ? getText(errorMessage) : "";
    }
}