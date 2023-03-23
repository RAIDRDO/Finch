# Stack 2.0 Security (WIP)
DevSecOps for Stack 2.0 takes reference from the following:

1. Open Web Application Security Project (OWASP) [Secure Coding Practices Checklist](https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf)
2. Rules for finding [JavaScript](https://rules.sonarsource.com/javascript) / [TypeScript](https://rules.sonarsource.com/typescript) vulnerabilities, bugs, security hotspots, or code smells
3. Testing: [Web Security Testing Guide](https://github.com/OWASP/wstg/)
4. Snyk.io scanning

Tools to incorporate (WIP):

1. Jest

## Security Checklist for React Frontend (Provisional)
Based on the readings below.

| S/N | Category | Item | Check |
| :-: | :------- | :--- | :---- |
|  1  | Input Validation | Use [Validator.js](https://github.com/validatorjs/validator.js) to validate all form inputs. |  |
|  2  | Input Validation | Tell the user what is wrong as part of post-validation. |  |
|  3  | Input Validation | If you must accept URLs from the user, validate it using the HTTP or HTTPS protocols. |  |
|  4  | Output Encoding | Avoid `dangerouslySetInnerHTML` as far as possible. If you must use it, sanitise the inputs using `dompurify` first. |  |
|  5  | Output Encoding | Use default data binding (`{}`) instead of rendering or using user-supplied attributes directly in HTML tags with injectable attributes. |  |
|  6  | Access Control | Assign the minimum SharePoint permissions for users to perform their tasks. |  |
|  7  | Data Protection | Remove sensitive data from SharePoint once no longer required. |  |
|  8  | System Configuration | Manage and record all changes to the source code via GitHub. |  |
|  9  | File Management | If files must be uploaded, (1) validate them and (2) store them in a Document Library separate from the app's document library. |  |
| 10  | General Coding Practices | Limit the developer team (GitHub collaborators) to approved developers only. |  |
| 11  | General Coding Practices | Use Snyk.io to scan the repo for vulnerabilities. |  |
| 12  | General Coding Practices | Use SonarLint for code smells. |  |


## Education
Selected Youtube videos for education on security matters:

1. [Web Application Security for Frontend Devs](https://www.youtube.com/watch?v=kEYYDWQPa0w)
2. [Writing Secure JavaScript](https://www.youtube.com/watch?v=Xy1K8ODZC8w)
3. [DevSecOps Course for Beginners](https://www.youtube.com/watch?v=F5KJVuii0Yw)
4. [OWASP Top 10 (Security Risks and Vulnerabilities)](https://www.youtube.com/watch?v=7UG8wE58vU8)

Readings:

1. [10 React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
2. [ReactJS Security Best Practices](https://aglowiditsolutions.com/blog/reactjs-security-best-practices/) by AGLOWID
3. [JavaScript Secure Coding Practices (JS-SCP) guide](https://checkmarx.gitbooks.io/js-scp/content/) by Checkmarx Security



## Notes on JavaScript Secure Coding Practices (JS-SCP) Guide by Checkmarx Security
The [JS-SCP guide](https://checkmarx.gitbooks.io/js-scp/content/) from Checkmarx Security contextualises the OWASP Secure Coding Practices Checklist to JavaScript. The notes below provide some context for Stack 2.0 DevSecOps:

1. Input Validation:
    - Use a centralised, well-tested, and actively-maintained validation routine: [Validator.js](https://github.com/validatorjs/validator.js).
    - Validator.js has many functions for validating data, including types, ranges, and other methods (e.g. allowable characters, escaping HTML characters). It's more efficient to use this than to use vanilla JS.
    - Perform post-validation: tell the user what's wrong
    - Always treat user inputs as untrusted and unsafe data
2. Output Encoding: For safely displaying data exactly as a user typed it
    - Main threat: cross-site scripting (XSS)
    - React escapes values by default, but there are watch areas:
      - Never use `dangerouslySetInnerHTML`
      - Never create React components from user-supplied objects
      - Never use user-supplied `href` attributes, or other HTML tags with injectable attributes (link tag, HTML5 imports)
3. Databases:
    - Main threat: SQL and NoSQL injection
    - Both are not actionable in Stack 2.0 DevSecOps
4. Authentication and Password Management: Managed by SharePoint; nothing actionable in Stack 2.0 DevSecOps
5. Session Management: Done primarily on the backend; nothing actionable in Stack 2.0 DevSecOps
6. Access Control: Managed by SharePoint; nothing actionable in Stack 2.0 DevSecOps
7. Cryptographic Practices: Done primarily on the backend; nothing actionable in Stack 2.0 DevSecOps
8. Error Handling and Logging: Done primarily on the backend; nothing actionable in Stack 2.0 DevSecOps
9. Data Protection:
    - Remove caches as soon as they're not needed. Do this by setting cache time appropriately in react-query.
    - Never store any sensitive info in clear text on the client side. Encryption on the client side is not ideal, so avoid sensitive info altogether.
10. Communication Security: Managed by SharePoint; nothing actionable in Stack 2.0 DevSecOps
11. System Configuration: Managed by SharePoint; nothing actionable in Stack 2.0 DevSecOps
12. Database Security: Primarily managed by SharePoint
    - Use parameterised queries. For REST API calls, validation is important.
13. File Management: See filtered checklist.
14. General Coding Practices:
    - Dependencies: Use `npm audit` and Snyk to scan
    - Code integrity: Use checksums to verify integrity of libraries

### OWASP Secure Coding Practices Checklist for Stack 2.0 DevSecOps
Full checklist, filtered from OWASP Secure Coding Practices Checklist.

<details>
<summary>Input Validation</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Identify all data sources and classify them into trusted and untrusted. Validate all data from untrusted sources (e.g. Databases, file streams). | Trusted = SharePoint; non-trusted = any other source. Developer to implement input validation for user-uploaded data. | |
| There should be a centralized input validation routine for the application. | Developer to implement validator.js (strings only) for user-provided data. | |
| Specify proper character sets, such as UTF-8, for all sources of input. | Developer to include <meta charset="UTF-8"> in <head>. | |
| Encode data to a common character set before validating (Canonicalize). | Developer to implement UTF-8 encoding prior to validator.js validation. | |
| All validation failures should result in input rejection. | Developer to implement flashing of error messages upon input rejection. | |
| Determine if the system supports UTF-8 extended character sets and if so, validate after UTF-8 decoding is completed. | Similar to S/N 5. Developer to implement. | |
| Validate all client provided data before processing, including all parameters, URLs and HTTP header content (e.g. Cookie names and values). Be sure to include automated post backs from JavaScript, Flash or other embedded code. | URLs and HTTP headers are managed by SharePoint backend. Developer to implement check on user-provided data in parameters.  | |
| Validate for expected data types. | Developer to implement validation using validator.js | |
| Validate data range. | Developer to implement validation using validator.js IsInt and isFloat methods. | |
| Validate data length. | Developer to implement validation using validator.js isByteLength method. | |
| Validate all input against a "whitelist" of allowed characters, whenever possible. | Developer to implement validation using validator.js | |
| If any potentially hazardous characters must be allowed as input, be sure that you implement additional controls like output encoding, secure task specific APIs and accounting for the utilization of that data throughout the application . Examples of common hazardous characters include: < > " ' % ( ) & + \ \' \" . | Developer to implement validation using validator.js | |
| If your standard validation routine cannot address the following inputs, then they should be checked discretely. Check for (1) null bytes (%00), (2) new line characters (%0d, %0a, \r, \n), and (3) "dot-dot-slahs" path alterations characters. | Developer to implement validation using validator.js | |

</details>

<details>
<summary>Access Control</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Restrict access to files or other resources, including those outside the application's direct control, to only authorized users. | To be managed through SharePoint roles and permissions. Developer to implement. | |
| Restrict access to protected URLs to only authorized users. | To be managed through SharePoint roles and permissions IF app has specific routes meant for only some users. Developer to implement. | |
| Restrict access to protected functions to only authorized users. | To be managed through SharePoint roles and permissions IF app has specific functions meant for only some users. Developer to implement. | |
| *If state data must be stored on the client, use encryption and integrity checking on the server side to catch state tampering.* | *Cannot implement encryption securely on the client side. Challenging to implement encryption without being able to store keys in backend. Need to study further whether to encrypt state.* | |
| Enforce application logic flows to comply with business rules. | Map out user journeys. Developer to implement. | |
| Service accounts or accounts supporting connections to or from external systems should have the least privilege possible. | To be managed through SharePoint roles and permissions. Developer to implement. | |
| Create an Access Control Policy to document an application's business rules, data types and access authorization criteria and/or processes so that access can be properly provisioned and controlled. This includes identifying access requirements for both the data and system resources. | Developer to implement. | |

</details>

<details>
<summary>Data Protection</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Implement least privilege, restrict users to only the functionality, data and system information that is required to perform their tasks. | To be managed through SharePoint roles and permissions. Developer to implement. | |
| Remove unnecessary application and system documentation as this can reveal useful information to attackers. | Developer to ensure that GitHub repos are private. | |
| Do not include sensitive information in HTTP GET request parameters. | Developer to check. | |
| The application should support the removal of sensitive data when that data is no longer required. (e.g. personal information or certain financial data). | Developer / product manager to manage this manually via SharePoint. | |

</details>

<details>
<summary>System Configuration</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Prevent disclosure of your directory structure in the robots.txt file by placing directories not intended for public indexing into an isolated parent directory. Then "Disallow" that entire parent directory in the robots.txt file rather than Disallowing each individual directory. | Developer to ensure robots.txt is not uploaded. | |
| Isolate development environments from the production network and provide access only to authorized development and test groups. Development environments are often configured less securely than production environments and attackers may use this difference to discover shared weaknesses or as an avenue for exploitation. | Developer to manage access. For dev environment, GitHub. For production environment, use SharePoint permissions. | |
| Implement a software change control system to manage and record changes to the code both in development and production. | Developer to manage. For dev environment, use GitHub. For production environment, use DocLib versioning. | |

</details>

<details>
<summary>Database Security</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Use strongly typed parameterized queries. | Developer to implement validation. |
| Utilize input validation and output encoding and be sure to address meta characters. If these fail, do not run the database command. | Developer to implement. |
| The application should use the lowest possible level of privilege when accessing the database. | Developer to manage SharePoint roles and permissions. |

</details>

<details>
<summary>File Management</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Do not pass user supplied data directly to any dynamic include function. | Developer to comply. | |
| Limit the type of files that can be uploaded to only those types that are needed for business purposes. | Developer to implement checks based on business rules. | |
| Validate uploaded files are the expected type by checking file headers. Checking for file type by extension alone is not sufficient. | Developer to implement. | |
| Do not save files in the same web context as the application. Files should either go to the content server or in the database. | Developer to implement. | |
| Do not pass user supplied data into a dynamic redirect. If this must be allowed, then the redirect should accept only validated, relative path URLs. | Developer to comply. | |
| Ensure application files and resources are read-only. | Developers to set correct SharePoint permissions for app files. | |

</details>

<details>
<summary>Memory Management</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Utilize input and output control for un-trusted data. | Developer to implement. | |

</details>

<details>
<summary>General Coding Practices</summary>

| Checklist Item | Remarks | Check |
| :------------- | :------ | ----- |
| Use tested and approved managed code rather than creating new unmanaged code for common tasks. | Developer to use well-known, updated libraries. |
| Explicitly initialize all your variables and other data stores, either during declaration or just before the first usage. | Developer to implement. |
| In cases where the application must run with elevated privileges, raise privileges as late as possible, and drop them as soon as possible. | Developer to ensure that privileges are static. |
| Avoid calculation errors by understanding your programming language's underlying representation and how it interacts with numeric calculation. Pay close attention to byte size discrepancies, precision, signed/unsigned distinctions, truncation, conversion and casting between types, "not-a-number" calculations, and how your language handles numbers that are too large or too small for its underlying representation. | Developer to check. |
| Do not pass user supplied data to any dynamic execution function. | Developer to comply. |
| Restrict users from generating new code or altering existing code. | Developer to assign read-only permissions to app files. |
| Review all secondary applications, third party code and libraries to determine business necessity and validate safe functionality, as these can introduce new vulnerabilities. | Developer to scan repo with Snyk.io. |

</details>