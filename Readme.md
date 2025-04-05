ImageProcessor
==============

The code in this repository, when run, will allow the user to
upload one or more images, and then run operations on them to modify them.

<img src="Screenshot.png" />


Running
-------

This utility makes use of the This Could Be Better TarFileExplorer
library as a Git submodule, to allow the processed images to be
downloaded as a single file, which may prevent the browser from
automatically suppressing the download of more than a certain number
of files. To use these features, this repository will need to be
cloned using the --recursive command-line switch, as:

	git clone --recursive http://github.com/thiscouldbebetter/ImageProcessor

Alternatively, if the ImageProcessor repository has already been cloned
without the --recursive switch, the TarFileExplorer submodule may be cloned
after the fact by running, from within the empty TarFileExplorer directory,
this command:

	git submodule update --init .

To see the code in action, open the Source/ImageProcessor.html file in a web
browser that runs JavaScript.