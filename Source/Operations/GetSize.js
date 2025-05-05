
class ImageProcessorOperation_GetSize
{
	constructor()
	{
		this.name = "getsize";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var size = new Coords(imageBefore.width, imageBefore.height);
		var sizeAsString = size.x + "x" + size.y;

		var fontHeightInPixels = 20;

		imageAfter.width = 200;
		imageAfter.height = fontHeightInPixels * 1.5;
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		gAfter.fillStyle = "White";
		gAfter.fillRect(0, 0, imageAfter.width, imageAfter.height);
		gAfter.fillStyle = "Black";
		gAfter.font = fontHeightInPixels + "px sans-serif";
		gAfter.fillText(colorComponentsRGBAAsString, 0, fontHeightInPixels);
	}
}
