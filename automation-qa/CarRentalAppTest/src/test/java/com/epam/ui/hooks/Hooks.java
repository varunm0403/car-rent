package com.epam.ui.hooks;

import com.epam.ui.utils.ScreenShotUtils;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import static com.epam.ui.utils.SingletonWebDriverFactoryUtils.*;

@Log4j2
@SuppressWarnings({"unused"})
public class Hooks {
    @Getter
    private static Properties properties;
    @Getter
    private static String browserName;

    @Before
    public void setUp() {
        try{
            browserName=System.getProperty("browser", "chrome");
            loadProperties();
            setThreadLocalDriver(browserName);
            getThreadLocalDriver().manage().window().maximize();
            log.info("Setup Completed for : {}", getThreadLocalDriver().getClass().getSimpleName());
        }
        catch (Exception e){
            log.error("Error!!! Failed to setup WebDriver: {}", e.getMessage());
            throw e;
        }
    }

    @SneakyThrows
    public static void loadProperties() {
        properties = new Properties();
        try (FileInputStream fis = new FileInputStream("src/test/resources/config.properties")) {
            properties.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @After
    @SneakyThrows
    public void tearDown(Scenario scenario) {
        try{
            log.info("TearDown invoked...");
            if(scenario.isFailed()){
                log.error("Scenario Failed {}", scenario.getName());
                ScreenShotUtils.getScreenShot(getThreadLocalDriver(), scenario.getName()+this.getClass().getName());
                quitDriverAndRemove();
            }
            else {
                if (getThreadLocalDriver() != null) {
                    log.info("Quitting WebDriver...");
                    quitDriverAndRemove();
                }
            }
        }
        catch (Exception e){
            log.error("Error!!! Failed to quit WebDriver: {}", e.getMessage());
            throw e;
        }
    }
}