const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const rootDirectory = './';

checkDirectory(rootDirectory);

function checkDirectory(directory) {
  fs.readdir(directory, (readDirError, files) => {
    if (readDirError) {
      console.log(chalk.red('Error found:', readDirError));
      return;
    }
    // 1. Find package.json
    let index = files.findIndex((value) => value === 'package.json');
    if (index > -1) {
      fs.readFile(
        path.join(directory, files[index]),
        'utf8',
        (readFileError, packageJSONFile) => {
          if (readFileError) {
            console.log(chalk.red('Error found:', readFileError));
            return;
          }
          // 2. Find dependencies in package.json
          const dependencies = JSON.parse(packageJSONFile).dependencies;
          console.log(
            chalk.green.bold(
              `${directory} - ${Object.keys(dependencies).length}`
            )
          );
          Object.keys(dependencies).forEach((dependency) => {
            fs.readdir(
              path.join(directory, 'node_modules', dependency),
              (depError, depFiles) => {
                let depIndex = depFiles.findIndex(
                  (dep) => dep === 'package.json'
                );
                if (depIndex > -1) {
                  fs.readFile(
                    path.join(
                      directory,
                      'node_modules',
                      dependency,
                      depFiles[depIndex]
                    ),
                    'utf-8',
                    (fileError, depPackageJSONFile) => {
                      if (fileError) {
                        console.log(chalk.red('Error found:', fileError));
                        return;
                      }
                      depPackageJSON = JSON.parse(depPackageJSONFile);
                      if ('dependencies' in depPackageJSON)
                        console.log(
                          chalk.green.bold(
                            `${dependency} - ${
                              Object.keys(depPackageJSON.dependencies).length
                            }`
                          )
                        );
                    }
                  );
                }
              }
            );
          });

          // console.log(
          //   `${directory} has ${Object.keys(dependencies).length} dependencies`
          // );
          // console.log(Object.keys(dependencies));
        }
      );
    } else {
      console.log('not found');
    }

    // 3. Find package in node_modules

    // 4. Read package.json of package
  });
}
