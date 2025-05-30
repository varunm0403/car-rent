package com.epam.api;

import java.io.FileInputStream;
import java.util.Properties;

public class ConfigReader {

    private static final ThreadLocal<Properties> threadLocalProperties = ThreadLocal.withInitial(() -> {
        Properties properties = new Properties();
        try (FileInputStream fis = new FileInputStream("src/test/resources/config.properties")) {
            properties.load(fis);
        } catch (Exception exception) {
            exception.printStackTrace();
            throw new RuntimeException("Failed to load configuration file: ", exception);
        }
        return properties;
    });

    public static String getBackendURL()
    {
        return threadLocalProperties.get().getProperty("url.backend");
    }
}