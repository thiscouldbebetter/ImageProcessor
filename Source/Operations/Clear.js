
class ImageProcessorOperation_Clear
{
	constructor()
	{
		this.name = "clear";
		this.parameters =
		[
			new ImageProcessorOperationParameter("color", ImageProcessorOperationParameter.formatString),
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);
		var size = new Coords(imageBefore.width, imageBefore.height);
		imageAfter.width = size.x;
		imageAfter.height = size.y;
		gAfter.clearRect(0, 0, size.x, size.y);

		var args = command.args;
		var color = args[0];
		if (color != null)
		{
			gAfter.fillStyle = color;
			gAfter.fillRect(0, 0, size.x, size.y);
		}
	}
}
