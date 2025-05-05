
class ImageProcessorOperation_DoNothing
{
	constructor()
	{
		this.name = "donothing";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);
		gAfter.drawImage(imageBefore, 0, 0);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_DoNothing() );