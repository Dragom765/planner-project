# planner-project
### A week planner that stores user information in a database

####Things you will need:
1. NODE.js downloaded on your computer
2. A running mysql server
   * The application will take care of creating the necessary tables
   * **_Important_**: Should the format of the tables change in a later PR, since the only current check is that they exist and not if they have the correct columns and types, it may be necessary to manually delete the _plan_ database that is created in your MySQL server.

#### Using the application
1. Download or clone the _Master_ branch, and unzip it if you downloaded.

2. Navigate to the file system through the command prompt, after relocating the planner-project file if desired. A download's original path will have `/downloads/planner-project-master/planner-project-master/` for the correct file location.

   (feel free to move contents first to negate this double-filing)

3. Run 'npm install'.

4. Create a file called 'mydb.env', and enter three variables: DB_HOST, DB_USER, and DB_PASS. These stand as your credentials for logging into your MySQL server. Format them each like so (minus the bullets, of course);

   - `DB_HOST=`_your database host_ (ex: localhost)
   - `DB_USER=`_your database username_ (ex: root)
   - `DB_PASS=`_your database password_ (ex: password123)

.5 Execute `node mysql_con.js` in the command prompt.

.6 In your web browser, navigate to [http://localhost:6143/api/](http://localhost:6143/api/ "To-Do Weekly List") to access the application.

        *Note:* this application is being designed using Firefox, for it's _Firebug_ tool. Other browsers such as Chrome shouldn't lose functionality, but they may lack the alignment until a specific PR to optimize the display is made.
