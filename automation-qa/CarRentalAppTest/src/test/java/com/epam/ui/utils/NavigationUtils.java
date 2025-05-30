package com.epam.ui.utils;

import org.openqa.selenium.WebDriver;

public class NavigationUtils {
    public static void openPage(WebDriver driver, String url) {
        driver.get(url);
    }
}
