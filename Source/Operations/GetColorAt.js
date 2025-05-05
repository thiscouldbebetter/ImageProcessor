
class ImageProcessorOperation_GetColorAt
{
	constructor()
	{
		this.name = "getcolorat";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var posToCheck = Coords.fromString(command.args[0]);

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var colorAtPosAsComponentsRGBA =
			gBefore.getImageData(posToCheck.x, posToCheck.y, 1, 1).data;
		var colorAtPosAsString =
			"rgba(" + colorAtPosAsComponentsRGBA.join(",") + ")";

		var fontHeightInPixels = 20;

		imageAfter.width = 200;
		imageAfter.height = fontHeightInPixels * 1.5;

		gAfter.fillStyle = "White";
		gAfter.fillRect(0, 0, imageAfter.width, imageAfter.height);
		gAfter.fillStyle = "Black";
		gAfter.font = fontHeightInPixels + "px sans-serif";
		gAfter.fillText(colorAtPosAsString, 0, fontHeightInPixels);
	}
}