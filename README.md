# file-move
Welcome to File-Move! File-Move is a CLI tool that allows you to:
<ol>
<li>Move a file in your project directory</li>
<li>Automatically update all require statements referencing the old file</li>
</ol>

##Usage

To download as a node module:
```
npm install https://github.com/marcreicher/file-move
```

###Example
Let's say you placed a file called dbconfig.js in a folder called 'database' in your project directory. You later decide that you want to move the dbconfig.js file into your folder called 'server'. 

<ul>
<li>Old Path: /Users/myusername/Desktop/myawesomeapp/database/dbconfig.js</li>
<li>New Path: /Users/myusername/Desktop/myawesomeapp/server/dbconfig.js</li>
</ul>

From the root of your project directory:
```
node node_modules/file-move/update.js --oldfilepath /Users/myusername/Desktop/myawesomeapp/database/dbconfig.js --newfilepath /Users/myusername/Desktop/myawesomeapp/server/dbconfig.js
```

Prior to running this command, let's say you had a file called server.js that included the following line of code:
```
var db = require('./database/dbconfig.js');
```

This would automatically get updated to show: 
```
var db = require('./server/dbconfig.js');
```

Note that all files (<b><i>except for node modules<i/></b>) in the directory are automatically parsed through and require statements are updated as necessary. If you have any large files in your directory that you want to ignore (e.g. jpeg or png files) in order to increase performance, you can select file types to ignore by using the --ignore flag. You must include a comma separated list (with no spaces) after the --ignore flag. Example usage:
```
node node_modules/file-move/update.js --oldfilepath [oldfilename] --newfilepath [newfilename] --ignore jpeg,png,gif
```









