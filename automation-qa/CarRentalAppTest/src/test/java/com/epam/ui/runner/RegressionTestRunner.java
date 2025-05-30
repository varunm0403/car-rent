package com.epam.ui.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

@SuppressWarnings("all")
@CucumberOptions(
        features = "src/test/resources/features/ui",
        glue = {"com.epam.ui.stepdefinitions", "com.epam.ui.hooks"},
        monochrome = true,
        tags = "@regression",
        plugin = {
                "pretty",                              // Pretty console output
                "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm" // Allure plugin
        }
)
public class RegressionTestRunner extends AbstractTestNGCucumberTests {
    @Override
    @DataProvider(parallel = true)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
