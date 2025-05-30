package com.epam.ui.pages;

import com.epam.ui.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

@SuppressWarnings({"unused"})
public class RegistrationPage extends BasePage {
    public RegistrationPage(WebDriver driver) {
        super(driver);
    }
    @FindBy(xpath = "//h1[normalize-space()='Create an account']")
    private WebElement registrationPageTitle;
    @FindBy(xpath = "//input[@id='firstName']")
    private WebElement firstNameField;
    @FindBy(xpath = "//input[@id='lastName']")
    private WebElement surNameField;
    @FindBy(xpath = "//input[@id='email']")
    private WebElement emailField;
    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;
    @FindBy(xpath = "//input[@id='confirmPassword']")
    private WebElement confirmPasswordField;
    @FindBy(xpath = "//button[normalize-space()='Register']")
    private WebElement registerButton;
    @FindBy(xpath = "//button[normalize-space()='Cancel']")
    private WebElement cancelButton;
    @FindBy(xpath = "//span[@class='text-black font-semibold hover:underline cursor-pointer']")
    private WebElement loginLink;


    public String getRegistrationPageTitle() {
        return getText(registrationPageTitle);
    }
    public boolean isFirstNameFieldDisplayed() {
        return isElementDisplayed(firstNameField);
    }
    public void enterFirstName(String firstName) {
        sendQuery(firstNameField, firstName);
    }
    public boolean isSurNameFieldDisplayed() {
        return isElementDisplayed(surNameField);
    }
    public void enterSurName(String surName) {
        sendQuery(surNameField, surName);
    }
    public boolean isEmailFieldDisplayed() {
        return isElementDisplayed(emailField);
    }
    public void enterEmail(String email) {
        sendQuery(emailField, email);
    }
    public boolean isPasswordFieldDisplayed() {
        return isElementDisplayed(passwordField);
    }
    public void enterPassword(String password) {
        sendQuery(passwordField, password);
    }
    public boolean isConfirmPasswordFieldDisplayed() {
        return isElementDisplayed(confirmPasswordField);
    }
    public void enterConfirmPassword(String confirmPassword) {
        sendQuery(confirmPasswordField, confirmPassword);
    }
    public boolean isLoginLinkDisplayed() {
        return isElementDisplayed(loginLink);
    }
    public void clickLoginLink() {
        clickButton(loginLink);
    }
    public boolean isRegisterButtonDisplayed() {
        return isElementDisplayed(registerButton);
    }
    public void clickRegisterButton() {
        clickButton(registerButton);
    }
    public boolean isCancelButtonDisplayed() {
        return isElementDisplayed(cancelButton);
    }
    public void clickCancelButton() {
        clickButton(cancelButton);
    }
    public boolean isRegisterButtonEnabled() {
        return registerButton.isEnabled();
    }
    public String getFirstNameInvalidFormatErrorMessage() {
        WebElement firstNameInvalidFormatErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Special characters are not allowed in first name.']"));
        return getText(firstNameInvalidFormatErrorMessage);
    }
    public String getSurNameInvalidFormatErrorMessage() {
        WebElement surNameInvalidFormatErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Special characters are not allowed in surname.']"));
        return getText(surNameInvalidFormatErrorMessage);
    }
    public void enterInvalidEmail(String email) {
        sendQuery(emailField, email);
        emailField.sendKeys(Keys.TAB);
    }
    public String getEmailInvalidFormatErrorMessage() {
        WebElement emailInvalidFormatErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Enter a valid email.']"));
        return getText(emailInvalidFormatErrorMessage);
    }
    public String getEmptyFirstNameErrorMessage() {
        firstNameField.sendKeys(Keys.TAB);
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='First name is required.']"));
        return getText(emptyErrorMessage);
    }
    public String getEmptySurNameErrorMessage() {
        surNameField.sendKeys(Keys.TAB);
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Surname is required.']"));
        return getText(emptyErrorMessage);
    }
    public String getEmptyEmailErrorMessage() {
        emailField.sendKeys(Keys.TAB);
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Enter a valid email.']"));
        return getText(emptyErrorMessage);
    }
    public String getEmptyPasswordErrorMessage() {
        passwordField.sendKeys(Keys.TAB);
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Password is required.']"));
        return getText(emptyErrorMessage);
    }
    public String getPasswordMismatchErrorMessage() {
        confirmPasswordField.sendKeys(Keys.TAB);
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[normalize-space()='Password and Confirm Password do not match.']"));
        wait.until(ExpectedConditions.visibilityOf(emptyErrorMessage));
        return getText(emptyErrorMessage);
    }
    public String getPasswordErrorMessage() {
        WebElement emptyErrorMessage=driver.findElement(By.xpath("//small[text()=' Password must be at least 8 characters long, contain at least one uppercase letter and one number. ']"));
        wait.until(ExpectedConditions.visibilityOf(emptyErrorMessage));
        return getText(emptyErrorMessage);
    }
    public void acceptAlert(){
        acceptPopup();
    }

}