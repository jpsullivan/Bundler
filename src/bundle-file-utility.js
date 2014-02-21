var ext = require('./string-extensions.js');

function BundleFileUtility(fs) {
    this.FileSystem = fs;
}


exports.BundleFileUtility = BundleFileUtility;

getSplit = function(fileName) {
    return fileName.indexOf('/') < 0 ? '\\' : '/';
};

getStagingDirectory = function(fs, bundleName, filename, options) {

    var split = getSplit(bundleName);
    var splitBundle = bundleName.split(split);
    var outputDir =  options.stagingdirectory + split + splitBundle.pop().replace('.','');

    var stagingFileName = getStagingFileName(bundleName, filename);

    if(!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    return outputDir + split + stagingFileName;
};

getStagingFileName = function(bundleName, filename) {

    var fileSplit = getSplit(filename);

    if(bundleName == filename) {
        return filename.split(fileSplit).pop();
    }

    var splits = filename.split(fileSplit);
    if(splits.length > 1) {
        splits.splice(0, 1);
    }
    var stagingFileName = splits.join('-');

    return stagingFileName;
}

getOutputDirectory = function(bundleName, filename, options) {
    var split = getSplit(filename);
    var bundleFileName = filename.split(split).pop();
    return options.outputdirectory + split + bundleFileName;
};

BundleFileUtility.prototype.getOutputFilePath = function(bundleName, filename, options) {

    if(options.stagingdirectory) {

        return getStagingDirectory(this.FileSystem, bundleName, filename, options);
    }
    else if(options.outputdirectory) {
        return getOutputDirectory(bundleName, filename, options);
    }

    return filename;
};

BundleFileUtility.prototype.getMinFileName = function(bundleName, fileName, options) {

    if(options.outputdirectory &&
        bundleName == fileName) {
        fileName = getOutputDirectory(bundleName, fileName, options);
    }

    var extension = fileName.substring(fileName.lastIndexOf('.'));
    return fileName.substring(0, fileName.length - extension.length) + ".min" + extension;
}