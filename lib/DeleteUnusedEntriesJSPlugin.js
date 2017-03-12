const path = require('path');

function DeleteUnusedEntriesJSPlugin(entriesToDelete = []) {
    this.entriesToDelete = entriesToDelete;
}
DeleteUnusedEntriesJSPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', (compilation, callback) => {

        // loop over output chunks
        compilation.chunks.forEach((chunk) => {
            // see of this chunk is one that needs its .js deleted
            if (this.entriesToDelete.includes(chunk.name)) {
                let fileDeleteCount = 0;

                // loop over the output files and find the 1 that ends in .js
                chunk.files.forEach((filename) => {
                    if (path.extname(filename) == '.js') {
                        fileDeleteCount++;
                        delete compilation.assets[filename];
                    }
                });

                // sanity check: make sure 1 file was deleted
                // if there's some edge case where multiple .js files
                // or 0 .js files might be deleted, I'd rather error
                if (fileDeleteCount != 1) {
                    throw new Error(`Problem deleting JS entry for ${chunk.name}: ${fileDeleteCount} files were deleted`);
                }
            }
        });

        callback();
    });
};

module.exports = DeleteUnusedEntriesJSPlugin;