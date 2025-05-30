package com.epam.ui.utils;


import io.qameta.allure.Allure;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@SuppressWarnings("all")
public class ScreenShotUtils {


    public static void getScreenShot(WebDriver driver, String resultName) {

        String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new Date());

        File screenshotFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);

        String screenshotName = System.getProperty("user.dir") + "\\target\\screenshots\\screenshot-" + timeStamp + " - " + ".png";

        try {

            Allure.addAttachment("screenshot of view port", FileUtils.openInputStream(screenshotFile));

            FileUtils.copyFile(screenshotFile, new File(screenshotName));

        } catch (IOException e) {

            throw new RuntimeException(e);

        }

    }
}
