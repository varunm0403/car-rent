# 🚗✨ Car Rental Automation Test Suite 🚀

---

## ✨ Overview

This repository contains the implementation of the **Automation Test Suite** for the 🏎️ **Car Rental Application**.  
It includes both **API** and **UI** test layers, ensuring:

- **Functionality** ✅
- **Performance** ⚡

The tests are powered by:

- **Cucumber** 🥒
- **TestNG** 📚
- **Rest-Assured** 🌐
- **Selenium** 🖥️

---

## ✨ Key Features 🚀

### 1️⃣ **Organized Folder Structure** 📂

- Clear separation of `api` 👾 and `ui` 🎨 test layers under `src/test/java`.
- Centralized 🗄️ configuration files in `resources`.

### 2️⃣ **Allure Reports** 📊

- Interactive and detailed test execution reports ✍️.
- Generated in: `target/allure-results`.
- View using:
  ```bash
  allure serve target/allure-results
  ```

### 3️⃣ **BDD with Cucumber** 🥒

- Feature files stored in the `features` directory 📁.
- Step definitions located under the `stepdefinitions` folder 📝.

### 4️⃣ **JSON Schema Validation** 📋 (API)

- Validates API responses against predefined JSON schemas for accuracy and consistency.

### 5️⃣ **Cross-Browser & Parallel Execution** 🌐 (UI)

- Supports multiple browsers, including **Chrome** 🌍 and **Firefox** 🦊.
- Parallel test execution enabled via TestNG ⚡.

### 6️⃣ **Robust Logging** 🛠️

- Integrated **Log4j2** 🪵 for customizable and efficient logging.

---

## ✅ Prerequisites

### 1️⃣ **Java Development Kit (JDK)** ☕

- Ensure that **Java 8** or higher is installed.
- Verify the installation by running:
  ```bash
  java -version
  ```

### 2️⃣ **Apache Maven** 📦

- Install **Maven** for dependency management 🛠️ and project building 🚧.
- Verify the installation by running:
  ```bash
  mvn -version
  ```

---

## 🛠️ How to Build and Run the Tests

This project leverages **Maven** 📦 as the build tool to manage dependencies and execute tests.

### 🌐 Default Behavior

- Use the `-Dtest` parameter to specify the **target feature file** 🔧 for test execution:
  ```bash
  mvn test -Dtest=TestRunner
  ```

### 🚀 Example: Run Specific Feature Files

- To execute tests for a specific feature file:
  ```bash
  mvn test -Dcucumber.options="src/test/resources/features/api/CarsGetAll.feature"
  ```

### 🚀 Maven Lifecycle Commands

Below are essential Maven commands for building and executing the project:

1️⃣ **Clean** 🧹

- Removes previously compiled files and temporary data:
  ```bash
  mvn clean
  ```

2️⃣ **Compile** 🛠️

- Compiles the source code:
  ```bash
  mvn compile
  ```

3️⃣ **Validate** ✅

- Ensures the project structure 🌐 and necessary dependencies 📦 are configured properly:
  ```bash
  mvn validate
  ```

4️⃣ **Test** 🧪

- Execute the test suite:
  ```bash
  mvn test
  ```

5️⃣ **Install** 📥

- Builds the project and installs it into the local Maven repository 🌟:
  ```bash
  mvn install
  ```

---

## 📊 Reporting

The project integrates **Allure Reports** ✨ for **interactive** and **detailed visualization** of test execution results.

### 👀 Viewing and Generating Allure Reports

1️⃣ **Install Allure CLI** 🛠️ (if not already installed).  
Refer to the [Installation Guide](https://docs.qameta.io/allure/#_installing_a_commandline).

2️⃣ **Generate the Report** 📊:  
After running your **test cases**, the results should be automatically saved in the following directory:
   ```
   target/allure-results
   ```
Use the following command to manually generate an Allure report:
   ```bash
   allure generate target/allure-results -o target/allure-report
   ```

3️⃣ **View the Report** 👁️:  
To view the generated report in your browser directly:
   ```bash
   allure serve target/allure-results
   ```

4️⃣ **Stop the Allure Server** ❌:  
Press **`CTRL+C`** on your terminal to stop the server 🛑.

---

## 🔑 Key Dependencies

The project leverages the following **essential dependencies** defined in the `pom.xml` 📦:

- 🥒 **Cucumber**: Facilitates **Behavior-Driven Development (BDD)** with support for **feature files** and **step definitions**.
- 📚 **TestNG**: Enables **test execution**, **parallel testing**, and advanced annotations 🎯.
- 🌐 **Rest-Assured**: Simplifies **API testing** with JSON schema validation and Hamcrest Matchers 🧪.
- 🖥️ **Selenium**: Powers **browser-based automation** 🔄 for web UI testing.
- 📊 **Allure Reports**: Provides **interactive**, visual test execution reports ✨.
- 📝 **Log4j2**: Implements **detailed logging** 🪵 for better test debugging and traceability 🔍.

---

## 🤝 Contribution

We **welcome contributions** from anyone interested in improving this project! 🚀 Here's how you can get involved:

1️⃣ **Fork the Repository** 🍴  
Start by forking this repository into your own GitHub account.

2️⃣ **Make Changes** ✍️  
Customize or improve the code 💻, add new features 🌟, fix bugs 🐞, or enhance the documentation 📝.

3️⃣ **Submit a Pull Request (PR)** 📬  
Once you're confident in your changes ✅, submit a **pull request** with a clear description 🖊️.

---

## 📜 License

This project is licensed under the **GPL-3.0** license. For more details, see the [LICENSE](LICENSE.md) file 📄.

---

⭐️ *A Project By* [Debadatta Pujhari](https://github.com/datt03)  
**Happy Testing!** 🚀✨
```