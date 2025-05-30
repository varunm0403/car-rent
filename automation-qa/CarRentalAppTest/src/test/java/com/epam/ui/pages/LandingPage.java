package com.epam.ui.pages;

import com.epam.ui.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;


@SuppressWarnings({"unused"})
public class LandingPage extends BasePage {

    public LandingPage(WebDriver driver) {
        super(driver);
    }

    @FindBy(xpath = "//h1[@id='rental-form-title']")
    private WebElement landingPageTitle;

    @FindBy(xpath = "//img[@alt='User Avatar']")
    private WebElement profileButton;

    @FindBy(xpath = "//div[@id='rental-form-container']")
    private WebElement filtrationCards;

    @FindBy(xpath = "//select[@id='pickupLocation']")
    private WebElement pickupDropdown;

    @FindBy(xpath = "//select[@id='dropoffLocation']")
    private WebElement dropOffDropdown;

    @FindBy(xpath = "//input[@id='pickupDateTime']")
    private WebElement pickupDateButton;

    @FindBy(xpath = "//input[@id='dropoffDateTime']")
    private WebElement dropOffDate;

    @FindBy(xpath = "//select[@id='carCategory']")
    private WebElement carCategoryDropdown;

    @FindBy(xpath = "//select[@id='gearbox']")
    private WebElement gearBoxDropdown;

    @FindBy(xpath = "//select[@id='engineType']")
    private WebElement engineTypeDropdown;

    @FindBy(xpath = "//button[@id='findCarButton']")
    private WebElement findCarButton;

    @FindBy(xpath = "//button[@id='clear-filters-button']")
    private WebElement clearFiltersButton;

    @FindBy(xpath = "(//a[contains(text(),'See more')])[1]")
    private WebElement bookCarButton;



    public String getLandingPageTitle() {
        return getText(landingPageTitle);
    }


    public void clickProfileButton() {
        clickButton(profileButton);
    }


    public void selectPickupOption(String optionText) {
        wait.until(ExpectedConditions.visibilityOf(landingPageTitle));
        selectOptions(pickupDropdown, optionText);
    }

    public void selectDropOffOption(String optionText) {
        selectOptions(dropOffDropdown, optionText);
    }

    public void selectDate(String pickupDate, String dropOffDate , String pickTime, String dropTime) {
        clickButton(pickupDateButton);
        String pickXpath="(//div[text()= "+pickupDate+" ])[1]";
        String dropXpath="(//div[text()= "+dropOffDate+" ])[2]";
        System.out.println("pickXpath: "+pickXpath + " dropXpath: "+dropXpath);
        WebElement date1 = driver.findElement(By.xpath(pickXpath));
        clickButton(date1);
        WebElement selectDropOffDate = driver.findElement(By.xpath("(//select)[6]"));
        selectOptions(selectDropOffDate,pickTime);
        WebElement selectDropOffDate2 = driver.findElement(By.xpath("(//select)[7]"));
        selectOptions(selectDropOffDate2,dropTime);
        WebElement date2 =driver.findElement(By.xpath(dropXpath));
        clickButton(date2);
    }
    public void clickApplyButton() {
        WebElement applyButton = driver.findElement(By.xpath("//button[text()=' Apply ']"));
        clickButton(applyButton);
    }

    public void selectCarCategory(String optionText) {
        selectOptions(carCategoryDropdown, optionText);
    }

    public void selectGearBoxOption(String optionText) {
        selectOptions(gearBoxDropdown, optionText);
    }

    public void selectEngineTypeOption(String optionText) {
        selectOptions(engineTypeDropdown, optionText);
    }

    public void clickFindCarButton() {
        findCarButton.click();
    }

    public boolean isFindCarButtonEnabled() {
        return findCarButton.isEnabled();
    }

    public boolean isTitleDisplayed() {
        return isElementDisplayed(landingPageTitle);
    }
    public boolean isLoginButtonDisplayed() {
        WebElement loginButton = driver.findElement(By.xpath("//span[normalize-space()='Login']"));
        return isElementDisplayed(loginButton);
    }
    public void clickLoginButton() {
        WebElement loginButton = driver.findElement(By.xpath("//span[normalize-space()='Login']"));
        clickButton(loginButton);
    }
    public boolean isProfileButtonDisplayed() {
        return isElementDisplayed(profileButton);
    }
    public boolean isPickupDropdownDisplayed() {
        return isElementDisplayed(pickupDropdown);
    }
    public boolean isDropOffDropdownDisplayed() {
        return isElementDisplayed(dropOffDropdown);
    }
    public boolean isPickupDateDisplayed() {
        return isElementDisplayed(pickupDateButton);
    }
    public boolean isDropOffDateDisplayed() {
        return isElementDisplayed(dropOffDate);
    }
    public boolean isCarCategoryDropdownDisplayed() {
        return isElementDisplayed(carCategoryDropdown);
    }
    public boolean isGearBoxDropdownDisplayed() {
        return isElementDisplayed(gearBoxDropdown);
    }
    public boolean isEngineTypeDropdownDisplayed() {
        return isElementDisplayed(engineTypeDropdown);
    }
    public boolean isClearFiltersButtonDisplayed() {
        return isElementDisplayed(clearFiltersButton);
    }
    public boolean isFindCarButtonDisplayed() {
        return isElementDisplayed(findCarButton);
    }
    public boolean isClearFiltersButtonEnabled() {
        return clearFiltersButton.isEnabled();
    }
    public boolean isCarAvailable() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("(//div[@class='bg-gray-100 rounded-lg overflow-hidden shadow-sm h-full'])[1]")));
        return isElementDisplayed(driver.findElement(By.xpath("(//div[@class='bg-gray-100 rounded-lg overflow-hidden shadow-sm h-full'])[1]")));
    }
    public void clickBookCarButton() {
        clickButton(bookCarButton);
    }
    public void clickOnBookNowButton() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[@id='car-model']")));
        WebElement bookNowButton = driver.findElement(By.xpath("//button[@id='book-car-button']"));
        clickButton(bookNowButton);
    }
    public void selectDateInTheCard(String pickupDate, String dropOffDate , String pickTime, String dropTime){
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[@id='car-model']")));
        WebElement date = driver.findElement(By.xpath("//input[@id='pickup-date-input']"));
        wait.until(ExpectedConditions.elementToBeClickable(date));
        clickButton(date);
        String pickXpath="(//div[text()=' "+pickupDate+" '])[1]";
        String dropXpath="(//div[text()=' "+dropOffDate+" '])[2]";
        WebElement date1 = driver.findElement(By.xpath(pickXpath));
        wait.until(ExpectedConditions.elementToBeClickable(date1));
        clickButton(date1);
        WebElement selectDropOffDate = driver.findElement(By.xpath("(//select)[6]"));
        wait.until(ExpectedConditions.elementToBeClickable(selectDropOffDate));
        selectOptions(selectDropOffDate,pickTime);
        WebElement selectDropOffDate2 = driver.findElement(By.xpath("(//select)[7]"));
        wait.until(ExpectedConditions.elementToBeClickable(selectDropOffDate2));
        selectOptions(selectDropOffDate2,dropTime);
        WebElement date2 =driver.findElement(By.xpath(dropXpath));
        clickButton(date2);
    }
    public void chooseCurrentDate() {
        WebElement date = driver.findElement(By.xpath("//input[@id='pickup-date-input']"));
        wait.until(ExpectedConditions.elementToBeClickable(date));
        clickButton(date);
        WebElement currentDate = driver.findElement(By.xpath("//div[@class='today']"));
        wait.until(ExpectedConditions.elementToBeClickable(currentDate));
        clickButton(currentDate);
    }

}