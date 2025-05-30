Here's the `api.md` file similar to the `ui.md` file you're referring to, based on the provided snippets and structure of your project.

---

# 🚗✨ Car Rental API Automation Test Suite 🚀

This repository contains the implementation of the **API Automation Test Suite** for the **Car Rental Application** 🏎️.

The project is designed to **automate** and **validate** RESTful API endpoints using **Rest-Assured**, **Cucumber**, and **TestNG**, ensuring **robust** and **reliable** API layers.

## ✨ Key Features 🚀

### 1️⃣ **BDD with Cucumber** 🥒

- Feature files for APIs are stored in the `src/test/resources/features/api` directory 📂.
- Step definitions for the corresponding feature files are located under the `com.epam.api.stepdefinitions` package 📝.

### 2️⃣ **End-to-End API Testing** 🔄

- Automated **GET**, **POST**, **PUT**, and **DELETE** requests.
- Supports:
    - **Dynamic Query Parameters** 🛠️
    - **Header Management** ✉️
    - **Payload Validation** ✅
    - **JSON Schema Validation** 📜

### 3️⃣ **Parameterized Tests** 🧳

The test suite leverages Cucumber's DataTables to handle scenarios requiring parameterized data for APIs. Examples include:
- Specifying **query parameters** dynamically.
- Passing **payloads** for POST and PUT requests.

### 4️⃣ **Built-in Response Validation** 🔍

- Validates response **status codes** ⚙️.
- Verifies response **payload structure** 🗂️.
- Supports assertion of **success/error messages** 📝.

### 5️⃣ **Robust Logging** 🛠️

- Integrated **Log4j2** 🪵 for customizable and efficient logging of API interactions and responses 🔄.

### 6️⃣ **Allure Reports** 📊

- Enables **detailed reporting** for API test results.
- Reports are auto-generated in the `target/allure-results` folder after each run.

### 7️⃣ **Configurable Base URL** 🌐

- Centralized configuration for base URLs 🗂️ via the `ConfigReader` utility.

---

## 🔑 Technology Stack

- **Rest-Assured** 📡 for API request handling and response validation.
- **Cucumber** 🥒 for Behavior-Driven Development.
- **TestNG** 📚 for execution and parallelization.
- **Lombok** ⚡ for boilerplate-free Java code.
- **Hamcrest** 🎯 for fluent API assertions.
- **Allure** ✨ for reporting and analytics.

---

## ✅ Prerequisites

### 1️⃣ **Java Development Kit (JDK)** ☕

Make sure **Java 8** or higher is installed.  
To verify:
```bash
java -version
```

### 2️⃣ **Apache Maven** 📦

Install **Apache Maven** to handle project dependencies and test execution.  
To confirm Maven is installed:
```bash
mvn -version
```  

### 3️⃣ **Required Tools** 🛠️

- REST API server should be running for validation.
- Configured `config.properties` file for API **base URL** and **environment-specific properties**.

---

### Sample Configuration File (`config.properties`)

```properties
url.backend=https://api.carrental.com/v1
```

Property `url.backend` determines the API's **base URL** and is accessible via the `ConfigReader` class.

---

## 🛠️ How to Run API Tests

Leverage **Maven** commands to build and execute the test suite.

### 1️⃣ **Clean and Build the Project** 🧹

To clean temporary files and compile the project:

```bash
mvn clean install
```

### 2️⃣ **Run API Tests** 📋

Run your API scenarios by executing:

```bash
mvn test -Dcucumber.filter.tags="@api"
```

- **`@api`** is the tag applied to API scenarios in `.feature` files.

---

### 🏎️ Run Tests in Parallel

Parallel test execution is handled via **TestNG's `@DataProvider`** annotation in the `TestRunner` class.

To execute tests in parallel:

```bash
mvn test -Dcucumber.filter.tags="@api" -Dparallel=true
```

---

## 📜 Folder Structure

Here's the structure of the API automation framework directory:

```plaintext
```

---

## 📊 Reporting with Allure

API test execution results are captured and visualized via **Allure Reports**.

### To Generate and View Allure Reports:

1️⃣ **Run API Tests** 💻:

```bash
mvn test -Dcucumber.filter.tags="@api"
```

2️⃣ **Generate Allure Report** 📊:

```bash
allure generate --single-file target/allure-results -o target/allure-report
```

3️⃣ **Serve Allure Report** 🌟:

```bash
allure serve target/allure-results
```

4️⃣ **Stop Allure Server** ❌:  
Press `Ctrl + C` to stop the local server.

---

## ✨ Key Classes

### 1️⃣ `APITestContext` Class 🖥️

- Stores test-specific data such as **base URL**, **request payload**, and **response object**.
- Accessible during feature execution via dependency injection.

```java
// Example usage:
testContext.setBaseUrl("https://api.carrental.com");
testContext.setResponse(given().baseUri(testContext.getBaseUrl()).get("/endpoint"));
```

---

### 2️⃣ `ConfigReader` Utility 📄

- Dynamically reads backend **base URL** and other runtime properties.

```java
String baseUrl = ConfigReader.getBackendURL();
```

---

### 3️⃣ Common Step Definitions 🧩

Located in the `stepdefinitions` package:
- Reusable steps for sending **GET**, **POST**, and **PUT** requests.
- Dynamic header, payload, and response validation methods.

---

## 🔄 Validation Features

### JSON Schema Validation 📜

Ensure the response adheres to the expected structure:
- Place schema files under `src/test/resources/schemas`.
- Use the following snippet to validate:

```java
testContext.getResponse().then().assertThat()
    .body(matchesJsonSchemaInClasspath("schemas/schemaName.json"));
```

---

### Success/Error Message Validation 📝

Verify response messages for accuracy:

```java
testContext.getResponse().then().body("message", equalTo("Expected message"));
```

---

### Query Parameters Handling 🔧

Automatically append query parameters:

```gherkin
Given User sets the following query parameters
  | key1 | value1 |
  | key2 | value2 |
```

---

## 🔑 Key Dependencies

Defined in `pom.xml`:

- **Rest-Assured** ([5.5.0](https://github.com/rest-assured/rest-assured)): Simplifies API testing.
- **Cucumber Java** ([7.20.1](https://cucumber.io/)): Behavior-driven development framework.
- **Json-Schema Validator** ([4.4.0](https://github.com/rest-assured/rest-assured/wiki/Usage#json-schema-validation)): Validates JSON responses.
- **Lombok** ([1.18.36](https://projectlombok.org/)): Reduces boilerplate code.
- **Allure Reporting** ([2.22.0](https://allure.qameta.io/)): Generate beautiful reports.

---

## 🤝 Contribution

We encourage contributions to enhance this framework. Follow these steps to get started:

1️⃣ **Fork the repository** 🍴  
2️⃣ **Create a feature branch** 🌿  
3️⃣ **Submit a pull request** 📬

---

## 📝 Notes

- For **support** or **questions**, feel free to contact:
    - **Author**: `Debadatta Pujhari`
    - **GitHub**: [Devpool08](https://github.com/devpool08)

---

## 📜 License

This project is licensed under **GPL-3.0**. For more details, see the [LICENSE](LICENSE.md) file.

---

💡 **Happy Testing!** 🚀