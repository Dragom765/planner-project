# planner-project
## A week planner that stores user information in a database

#### Site demo link: [http://104.236.105.200:6207/api/](http://104.236.105.200:6207/api/ "To-Do Weekly List")

__*Notice:*__ Current efforts are being made to have an app demo accessible through the link. As of now, there's some memory leaking that needs to be addressed, possibly in the NODE or MySQL software.

##Things you will need:
1. NODE.js downloaded on your computer
2. A running mysql server
   * The application will take care of creating the necessary tables
   * **_Important_**: Should the format of the tables change in a later PR, since the only current check is that they exist and not if they have the correct columns and types, it may be necessary to manually delete the _plan_ database that is created in your MySQL server.

#### Using the application
1. Download or clone the _Master_ branch, and unzip it if you downloaded.

2. Navigate to the file system through the command prompt, after relocating the planner-project file if desired. A download's original path will have `/downloads/planner-project-master/planner-project-master/` for the correct file location.

   (feel free to move contents first to negate this double directory)

3. Run 'npm install' to install the necessary node.js packages to run the application.

4. Edit the file called 'mydb.env', and give values to the three variables, DB_HOST, DB_USER, and DB_PASS. These stand as your credentials for logging into your MySQL server. Note: you will need to delete everything after the equals signs first, and quotations are not allowed (for example, type just localhost, rather than 'localhost' or "localhost").

5. __NEW Step:__ There's now three more variables in mydb.env, used for the database initiation. They're named the same as the three mentioned above, but with an '\_INIT' extention on the ends. This is more for someone dealing with MySQL permissions and limiting client access; _if you're keeping things simple, put the same credentials for both sets_. If you are, use these to give a different-/higher-permissioned account for making tables and the plan database upon startup if the system sees they're missing.

5. Execute `node mysql_con.js` in the command prompt.

6. In your web browser, navigate to [http://localhost:6143/api/](http://localhost:6143/api/ "To-Do Weekly List") to access the application.

 - *Additional Note:* this application was designed using Firefox, but currently, the formatting should be such that it works for most, if not all, browsers. Chrome was also used and approved by the designer. Should there be anything that looks like an error, or improper formatting, please feel free to comment on it here.
