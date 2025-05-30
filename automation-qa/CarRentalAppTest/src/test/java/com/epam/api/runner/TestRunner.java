package com.epam.api.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;


@SuppressWarnings("all")
@CucumberOptions(
        features = "src/test/resources/features/api",
        glue = {"com.epam.api.stepdefinitions"},
        monochrome = true,
        plugin = {
                "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm" // Allure plugin
        }
)
public class TestRunner extends AbstractTestNGCucumberTests {
    @Override
    @DataProvider(parallel = true)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
