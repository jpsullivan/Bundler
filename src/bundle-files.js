var ext = require('./string-extensions.js');

function BundleFiles() {
    this.files = [];
    this.indexed = false;
};

exports.BundleFiles = BundleFiles;
exports.BundleType = { Javascript: "Javascript", Css: "Css" };

BundleFiles.prototype.jsMatches = function (fileName, bundleDir, recursive, path) {

    if (!fileName.isJs()) return '#';

    if (!fileName.startsWith(bundleDir)) return '#';
    if (!recursive && (path.dirname(fileName) !== bundleDir)) return '#';
    return fileName.substring(bundleDir.length + 1);
};

BundleFiles.prototype.addDirectories = function (file, directoryDictionary) {

    var directories = ['/'];
    var combined = null;

    var tokens = file.split('/');
    tokens.pop();

    tokens.forEach(function (token) {
        
        if (token == '') { return; }

        if (!combined) {
            combined = '/' + token;
        }
        else {
            combined = combined + '/' + token;
        }

        directories.push(combined);

    });

    directories.forEach(function (directory) {

        if (!directoryDictionary[directory]) {
            directoryDictionary[directory] = [];
        }

        directoryDictionary[directory].push(file);

    });
}

BundleFiles.prototype.cssMatches = function(fileName, bundleDir, recursive, path) {

    if (!fileName.isCss()) return '#';
    if (!fileName.startsWith(bundleDir)) return '#';
    if (!recursive && (path.dirname(fileName) !== bundleDir)) return '#';
    return fileName.substring(bundleDir.length + 1);
};


BundleFiles.prototype.addFiles = function (filesToAdd) {
    var _this = this;
    _this.files = _this.files.concat(filesToAdd);
};

BundleFiles.prototype.addFile = function (fileToAdd) {
    var _this = this;
    _this.files.push(fileToAdd);
};

BundleFiles.prototype.Index = function () {
    var _this = this;
    _this.indexed = true;

    _this._jsBundles = [];
    _this._jsDirectories = {};
    _this._cssBundles = [];
    _this._cssDirectories = {};

    _this.files.forEach(function (file) {

        if (file.endsWith(".js.bundle")) {
            _this._jsBundles.push(file);
            return;
        }

        if (file.endsWith(".css.bundle")) {
            _this._cssBundles.push(file);
            return;
        }

        if (file.isJs()) {
            _this.addDirectories(file, _this._jsDirectories);
        }

        if (file.isCss()) {
            _this.addDirectories(file, _this._cssDirectories);
        }

    });

}

BundleFiles.prototype.getBundles = function (fileType) {
    var _this = this;

    if (!_this.indexed) { throw new Error("Files are not indexed!") };

    if (fileType == exports.BundleType.Javascript) {
        return _this._jsBundles;
    }
    else {
        return _this._cssBundles;
    }
};

BundleFiles.prototype.getFilesInDirectory = function (fileType, bundleDir, currentDir) {
    var _this = this,
        matcher = fileType == exports.BundleType.Javascript ? _this.jsMatches : _this.cssMatches,
        dictionary = fileType == exports.BundleType.Javascript ? _this._jsDirectories : _this._cssDirectories
        output = [];

    if (!_this.indexed) { throw new Error("Files are not indexed!") };

    var dictEntry = bundleDir.NormalizeSlash(true, true);
    bundleDir = bundleDir.NormalizeSlash(false, true);
    currentDir = currentDir.NormalizeSlash(false, true);

    (dictionary[dictEntry] || []).forEach(function (name) {

        var match = currentDir + '/' + matcher(name, bundleDir, true);

        if (!match.endsWith('#')) {
            output.push(match);
        }
    });

    return output;
};

BundleFiles.prototype.getFilesInFolder = function (fileType, bundleDir, recursive, path) {
    var _this = this,
        matcher = fileType == exports.BundleType.Javascript ? _this.jsMatches : _this.cssMatches;

    return _this.files.map(function (fileName) {
        return matcher(fileName, bundleDir, recursive, path);
    });
}
