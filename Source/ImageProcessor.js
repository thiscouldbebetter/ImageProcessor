
class ImageProcessor
{
	constructor(imageAsCanvasBefore, imageAsCanvasWorking, imageAsCanvasAfter)
	{
		this.imageAsCanvasBefore = imageAsCanvasBefore;
		this.imageAsCanvasWorking = imageAsCanvasWorking;
		this.imageAsCanvasAfter = imageAsCanvasAfter;
	}

	imageCopyToOther(imageToCopy, imageToCopyOver)
	{
		imageToCopyOver.width = imageToCopy.width;
		imageToCopyOver.height = imageToCopy.height;
		var graphicsAfter = imageToCopyOver.getContext("2d");
		graphicsAfter.drawImage(imageToCopy, 0, 0);
	}

	// Copying.

	imageAfterCopyToWorking()
	{
		this.imageCopyToOther(this.imageAsCanvasAfter, this.imageAsCanvasWorking);
	}

	imageBeforeCopyToWorking()
	{
		this.imageCopyToOther(this.imageAsCanvasBefore, this.imageAsCanvasWorking);
	}

	imageWorkingCopyToAfter()
	{
		this.imageCopyToOther(this.imageAsCanvasWorking, this.imageAsCanvasAfter);
	}
}
