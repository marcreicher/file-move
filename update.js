'use strict';
var dive = require('dive'),
    fs = require('fs'),
    path = require('path'),
    program = require('commander');



/*------------CLI Options---------------*/
function list(val) {
  return val.split(',');
}
program
  .option('-o, --oldfilepath [value]', 'File you want to move')
  .option('-n, --newfilepath [value]', 'New file location')
  .option('-d, --directory [value]', 'Directory containing require statements to update (defaults to current working directory). \n\t\t\t  This will likely be the absolute file path of your project repository.')
  .option('-i, --ignore <items>', 'File types to ignore (e.g. --ignore html,css,jpeg).', list)
  .parse(process.argv);

if (!program.oldfilepath) {
  throw new Error('-o or --oldpath required. Please specify the file path (absolute) that you would like to move');
}

if (!program.newfilepath) {
  throw new Error('-n or --newpath required. Please specify the file path (absolute) the new file location');
}
/*------------CLI Options---------------*/



var projectDirectory = program.directory || process.cwd(),
    oldAbsolutePath = program.oldfilepath, //file we are going to move
    newAbsolutePath = program.newfilepath, //new file location
    requireStatements = /require\(['"].*['"]\)/g;



/*------------REGEX to define which files in project we can ignore---------------*/
var ignoreRegEx = '(node_modules'; //always ignore node modules since we don't want to risk editing them
if(program.ignore) {
  program.ignore.forEach(function(fileType) {
    ignoreRegEx += '|\\.' + fileType;
  });
}
ignoreRegEx += ')';
var filesToIgnore = new RegExp(ignoreRegEx);
/*------------REGEX to define which files in project we can ignore---------------*/




/*------------Move File And Update Require Statements---------------*/
//traverses current working directory
dive(projectDirectory, { ignore: filesToIgnore }, function(err, file, stat) {
  if (err) throw err;
  //move the old file to the new file path
  console.log(file);
  if(file === oldAbsolutePath) {
    fs.readFile(file, 'utf-8', function(err, data) {
      if(err) throw err;
      fs.writeFile(newAbsolutePath, data, function(err, newFile) {
        if(err) throw err;
        fs.unlink(oldAbsolutePath, function(err, data) {
          if(err) throw err;
        })
      })
    })
  } else {
    //update the require statements in all other files
    fs.readFile(file, 'utf-8', function(err, data) {
      if (err) throw err;
      var changesMade = false;
      var updatedFile = data.replace(requireStatements, function(requireStatement) {
        var folder = path.dirname(file);
        var oldRelativeFilePath = requireStatement.substring(9, requireStatement.length - 2);
        if(path.join(folder, oldRelativeFilePath) === oldAbsolutePath) {
          //update the path
          var newRelativeFilePath = './'+ path.relative(folder, newAbsolutePath);
          changesMade = true;
          return 'require(\'' + newRelativeFilePath + '\')';
        }
        return requireStatement;
      });
      if(changesMade) {
        fs.writeFile(file, updatedFile, function(err, update) {
          if(err) throw err;
        })
      }
    });
  }
});
/*------------Move File And Update Require Statements---------------*/



