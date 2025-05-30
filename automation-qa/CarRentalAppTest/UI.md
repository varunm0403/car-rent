<!--suppress HtmlDeprecatedAttribute -->
<p align="center"><img src="https://i.imgur.com/A6bWGFl.gif" alt=""/></p>



<!--suppress HtmlDeprecatedAttribute -->
<div align="center" style="font-size: 24px; font-weight: bold;">
🚗✨ Car Rental UI Automation Test Suite 🚀
</div>

---

- 🗂️ This repository contains the implementation of the **UI Automation Test Suite** for the 🏎️ **Car Rental Application
  **.
- The tests are powered by:
  - **Cucumber** 🥒
  - **TestNG** 📚
  - **Selenium** 🖥️
- Designed to ensure:
  - **Functionality** ✅
  - **Performance** ⚡
- Compatible across different browsers 🌐.

---

# ✨ Key Features 🚀

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

- Feature files stored in the `ui.features` directory 📁.
- Step definitions located under the `stepdefinitions` folder 📝.

### 4️⃣ **Cross-Browser & Parallel Execution** 🌐

- Supports multiple browsers, including **Chrome** 🖥️ and **Firefox** 🦊.
- Parallel test execution enabled via TestNG ⚡.

### 5️⃣ **API Testing with Rest-Assured** 📡

- Efficient API testing 🔄 with JSON schema validation and Hamcrest Matchers 🧪.

### 6️⃣ **Robust Logging** 🛠️

- Integrated **Log4j2** 🪵 for customizable and efficient logging.

### 7️⃣ **Technology Stack** 🖥️

- Built with **Selenium** 🕸️, **TestNG** 📚, **Rest-Assured** 🌐, **Cucumber** 🥒, and **Allure** ✨.

This framework is 🔧 modular, 🔄 scalable, and 🏎️ optimized for all your automation testing needs! 🚀


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

#### 🔄 Common Maven Commands:

- **Clean the project** 🧹:  
  Cleans the `target` directory by running:
  ```bash
  mvn clean
  ```

- **Validate the project structure** ✅:  
  Validates the project's basic structure and configuration using:
  ```bash
  mvn validate
  ```

Here’s how your **How to Build and Run the Tests** section will look after adding emojis and formatting it for better
readability:

---

## 🛠️ How to Build and Run the Tests

This project leverages **Maven** 📦 as the build tool to manage dependencies and execute tests. It supports running tests
across multiple browsers — **Chrome** 🌍, **Firefox** 🦊, and **Edge** 💻 — by specifying the target browser using the
`-Dbrowser` parameter.

### 🌐 Default Browser Behavior

- Use the `-Dbrowser` parameter to specify the **target browser** 🔧 for test execution:
  ```bash  
  mvn test -Dbrowser=chrome  
  ```  

- **Supported values** ⚙️:
  - `chrome` 🌍

  - `firefox` 🦊

  - `edge` 💻


- **Default Behavior**:
  - If no browser is specified, the framework will automatically run tests on **Chrome** 🌍 by default.

---

### 🚀 Example: Run Tests on Specific Browsers

- To execute tests on **Chrome** 🌍:
  ```bash  
  mvn test -Dbrowser=chrome  
  ```  

- To execute tests on **Firefox** 🦊:
  ```bash  
  mvn test -Dbrowser=firefox  
  ```  

- To execute tests on **Edge** 💻:
  ```bash  
  mvn test -Dbrowser=edge  
  ```  

By leveraging **Maven** commands and browser-specific configurations, the project provides **flexible execution options
** 🙌 for different environments, enabling seamless testing on multiple browsers 🌐!


---

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
  - **Example with Chrome** 🌍:
    ```bash  
    mvn test -Dbrowser=chrome  
    ```  
  - **Default (Firefox)** 🦊:
    ```bash  
    mvn test  
    ```  

5️⃣ **Install** 📥

- Builds the project and installs it into the local Maven repository 🌟:
  ```bash  
  mvn install  
  ```

By following these steps, users can ensure a seamless build process 🔧 and successfully execute tests 🌟 across desired
environments 🖥️.

---

### 🌐 Running Tests in Different Browsers

After building the project with **Maven** 📦, you can execute the test suite in different browsers by passing the
`-Dbrowser` parameter:

1️⃣ **Chrome** 🌍

   ```bash  
   mvn clean test -Dbrowser=chrome  
   ```  

2️⃣ **Firefox** 🦊

   ```bash  
   mvn clean test -Dbrowser=firefox  
   ```  

3️⃣ **Edge** 💻

   ```bash  
   mvn clean test -Dbrowser=edge  
   ```  

---

### 📝 Notes

- ✅ Ensure the appropriate browser drivers (e.g., `chromedriver` 🚗, `geckodriver` 🦊, `edgedriver` 💻) are properly
  configured in your system's `PATH` 🔧 or project settings before running the tests.
- ⚙️ If specific **Maven profiles** are configured (e.g., for environment-specific settings), you can activate them by
  appending `-Pprofile-name` to the commands:
   ```bash  
   mvn clean test -Pprofile-name  
   ```  

By following these steps, you'll be able to **build** 🛠️ and **execute** 🚀 the project efficiently across multiple
browsers.

---

### 🏎️ Run Tests in Parallel

Parallel test execution is enabled via the `@DataProvider` in the `TestRunner` class 🧑‍💻. TestNG’s multi-threading
capabilities help execute scenarios concurrently 🔄.

To execute tests in parallel while specifying a browser:

```bash  
mvn test -Dbrowser=chrome  
```

---

### 🛠️ Customize the Browser Driver Path

Ensure the appropriate WebDriver (such as `chromedriver` 🚗, `geckodriver` 🦊, or `edgedriver` 💻) is readily available in
your system's `PATH` 🔍 or properly configured within the project settings.

#### ⚡ Example:

For **ChromeDriver**:

- 📥 Download the WebDriver from [ChromeDriver Download Page](https://sites.google.com/a/chromium.org/chromedriver/).
- 🛠 Add the binary to your system's `PATH` 🔧 variable.

By leveraging these instructions—and ensuring WebDriver compatibility—your testing workflow will be smooth, scalable,
and efficient 🏆!


---

## 📊 Reporting

The project integrates **Allure Reports** ✨ for **interactive** and **detailed visualization** of test execution
results.  
After executing tests, the report files are automatically generated in the following directory:

📁 **Path to Allure Report files:**

```
target/allure-results  
```

Here's the improved and updated **Viewing Allure Reports** section with instructions on how to stop the process,
formatted properly with emojis and Bash syntax:

---

Here’s the updated **Viewing Allure Reports** section with additional steps for generating the report:

---

### 👀 Viewing and Generating Allure Reports

To generate, view, and stop the report:

1️⃣ **Install Allure CLI** 🛠️ (if not already installed).

- Refer to the [Installation Guide](https://docs.qameta.io/allure/#_installing_a_commandline).

2️⃣ **Generate the Report** 📊:  
After running your **test cases**, the results should be automatically saved in the following directory:

   ```
   target/allure-results  
   ```  

Next, use the following command to manually generate an Allure report:

   ```bash  
 allure generate --single-file target/allure-results -o target/allure-report  
   ```  

- This command stores the generated report files in the `target/allure-report` directory.

3️⃣ **View the Report** 👁️:  
To view the generated report in your browser directly:

   ```bash  
   allure serve target/allure-results  
   ```  

- The command will start a local server 🌐 and open the report 📄 in your default browser automatically.

4️⃣ **Stop the Allure Server** ❌:

- Press **`CTRL+C`** on your terminal to stop the server 🛑.
- When prompted, type `y` and hit **Enter**. This will terminate the running server.  
  Example:
   ```bash  
   ^C  
   Terminate batch job (Y/N)? y  
   ```  

5️⃣ **Use the Interactive Dashboard** 📈:  
Explore your test results, including statistics 📊, trends 📉, and detailed execution reports 📝 via the Allure interface.

---

With **Allure Reports**, this test framework empowers users with **comprehensive insights** ✅ into test execution
results, making **debugging** 🐞 and **reporting** 🔎 streamlined and highly effective 🚀.

---

## 🔑 Key Dependencies

The project leverages the following **essential dependencies** defined in the `pom.xml` 📦 to enable seamless building
and running of automated tests:

- 🥒 **Cucumber**: Facilitates **Behavior-Driven Development (BDD)** with support for **feature files** and **step
  definitions**.
- 📚 **TestNG**: Enables **test execution**, **parallel testing**, and advanced annotations 🎯.
- 🖥️ **Selenium**: Powers **browser-based automation** 🔄 for web UI testing.
- 📊 **Allure Reports**: Provides **interactive**, visual test execution reports ✨.
- 📡 **Rest-Assured**: Supports **API testing** 🔄 with simplified methods for requests and validations.
- 📝 **Log4j2**: Implements **detailed logging** 🪵 for better test debugging and traceability 🔍.
- 📋 **Apache POI**: Handles **data-driven testing** with Excel files 🧮.
- 🧩 **Hamcrest**: Enables **flexible and readable assertions** ✅, especially useful for API tests.

These dependencies work together to create a **robust**, **scalable**, and **maintainable automation framework** ⚙️,
empowering teams to achieve efficient and reliable test execution 🚀.

---

## 🤝 Contribution

We **welcome contributions** from anyone interested in improving this project! 🚀 Here's how you can get involved:

1️⃣ **Fork the Repository** 🍴

- Start by forking this repository into your own GitHub account.

2️⃣ **Make Changes** ✍️

- Customize or improve the code 💻, add new features 🌟, fix bugs 🐞, or enhance the documentation 📝.

3️⃣ **Submit a Pull Request (PR)** 📬

- Once you're confident in your changes ✅, submit a **pull request** with a clear description 🖊️ of:
  - What you've done
  - Why it benefits the project
- Follow the repository's contribution guidelines and standards.

We encourage **constructive collaboration** 🛠️ and are excited to see your contributions! Before contributing, please
ensure your changes align with the **project's goals** 🎯 and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) 👩‍⚖️.

---

### 🛠️ Steps to Contribute:

1️⃣ **Clone the repository** 📂:

   ```bash  
   git clone https://git.epam.com/epm-edai/project-runs/run-8-2/team-4/serverless/team04-car-rental-app  
   ```  

2️⃣ **Create a feature branch** 🌿:

   ```bash  
   git checkout -b feature/qa  
   ```  

3️⃣ **Commit your changes** 💾 and **submit a PR** 🔀:  
Provide a meaningful **commit message** and follow the pull request process to propose your contributions.

By participating in this project, you're contributing to something impactful 🏆 and helping us make the **Car Rental UI
Automation Test Suite** even better 🚗✨! Thank you for your collaboration 🙌.

---

## 📜 License

This project is licensed under the **GPL-3.0** license. For more details, see the [LICENSE](LICENSE.md) file 📄.

---

### 📌 Key Details

1️⃣ **Copyright Section**:

- **`© EPAM Systems AT Run 8.2 Team 4, 2025. All rights reserved.`**  
  This explicitly states the ownership of the project by **EPAM Systems AT Run 8.2 Team 4**.

- Authored and managed by **Debadatta Pujhari**, a key contributor from **EPAM Systems Automation Testing Run 8.2 Team 4
  ** 🧑‍💻🌟.

2️⃣ **License**:

- This project is open source, licensable under **GPL-3.0**, which provides freedom to **use**, **modify**,
  and **distribute** the software freely, as long as adherence to the license terms is maintained.
- The full details of the license can be found in the `[LICENSE](LICENSE.md)` file 📃.

3️⃣ **Contact Information** 📨:

- For **support**, **contributions**, or **questions**, feel free to reach out to the author:
  - 👉 **GitHub**: [Debadatta Pujhari](https://github.com/devpool08)

4️⃣ **Organization Details** 🏢:

- This project is maintained by **EPAM Systems**, a global leader in software engineering 💼.
- Visit the [official website](https://www.epam.com/) 🌐 to learn more about the organization.

---
⭐️ *A Project By* [Debadatta Pujhari](https://github.com/datt03)  
**Happy Testing!** 🚀✨

<!--suppress HtmlDeprecatedAttribute -->
<p align="center">

<img src="https://github.com/thompsonemerson/thompsonemerson/raw/master/cover-thompson.png"  alt=""/>

</p>