# planner-project
## A week planner that stores user information in a database


##Things you will need:
1. NODE.js downloaded on your computer
2. A running mysql server
   * The application will take care of creating the necessary tables
   * **_Important_**: Should any of the created colums or rows be edited manually by the user in MySQL, the software doesn't have safeties to catch this as of yet.

#### Using the application
1. Download or clone the _Master_ branch. Unzip it if you downloaded.

2. Navigate to the file system through the command prompt, after relocating the planner-project file if desired. A download's original path will have `/downloads/planner-project-master/planner-project-master/` for the correct file location.

   (feel free to move contents first to negate this double directory)

3. Run 'npm install' to install the necessary node.js packages to run the application.

4. Edit the file called 'mydb.env', and give values to the three variables, DB_HOST, DB_USER, and DB_PASS. These stand as your credentials for logging into your MySQL server. Note: you will need to delete everything after the equals signs first, and quotations are not allowed (for example, type just localhost, rather than 'localhost' or "localhost").

5. __NEW Step:__ There's now three more variables in mydb.env, used for the database initiation. They're named the same as the three mentioned above, but with an '\_INIT' extention on the ends. This is more for someone dealing with MySQL permissions and limiting client access; _if you're keeping things simple, put the same credentials for both sets_. If you are, use these to give a different-/higher-permissioned account for making tables and the plan database upon startup if the system sees they're missing.

6. Execute `node mysql_con.js` in the command prompt.

7. In your web browser, navigate to [http://localhost:6143/api/](http://localhost:6143/api/ "To-Do Weekly List") to access the application.

 - *Additional Note:* this application was designed using Firefox, but currently, the formatting should be such that it works for most browsers. Chrome was also used and approved by the designer. Please feel free to comment on any errors found that were missed in the last update.
