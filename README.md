Vercel link to run the project without setup https://missing-person-tracker.vercel.app/

![image](https://github.com/user-attachments/assets/c609635a-ad07-4dde-ae4c-550fff655579)

# Missing Persons Tracker using Knowledge Graphs


Instructions on setup
------


### Requirements:
[Latest version of Node.js to run npm commands](https://nodejs.org/en/download/prebuilt-installer)


### Steps to run in command line to launch the application locally:

1. Ensure npm is installed by running the command npm -v in command line. This should return your NPM version

2. Navigate to the client folder under app through \app\client.

3. In the client folder, run the following command to install the required dependencies
   ```
    npm install .
   ```

   or

   ```
    npm i . 

   ```

4. Keep the shell for the client folder open.

5. Navigate to the server folder under \app\server.

6. In the server folder, run the following command to install the required dependencies.

   ```
    npm install .
   ```

   or

   ```
    npm i . 
   ```

7. Keep the shell for the server folder open.

8. In the server folder, create a .env file and paste the following into the .env file. This is the api key necessary to run the ChatGPT summarizer. This is important as github does not allow users to push .env files into repositories.:

   ```
    OPENAI_API_KEY=<Insert OPEN API key here>
   ```
![image](https://github.com/user-attachments/assets/92fe8886-891c-4299-956a-06349baacc0e)


9. In the shell for the server folder, run the following command to get the server started:
   ```
    npm run dev 
   ```

10. In the shell for the client folder, run the following command to get the client started:
   ```
    npm run dev 
   ```

11. In a browser, open the http://localhost:5173/ to view the launched application!

![Landing page](https://github.com/user-attachments/assets/2204fb20-d480-4bc7-afb1-4b8da35510bc)


