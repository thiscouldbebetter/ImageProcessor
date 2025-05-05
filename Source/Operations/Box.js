
class ImageProcessorOperation_Box
{
	constructor()
	{
		this.name = "box";
		this.parameters =
		[
			new ImageProcessorOperationParameter("color", ImageProcessorOperationParameter.formatString),
			new ImageProcessorOperationParameter("pos", ImageProcessorOperationParameter.formatCoords),
			new ImageProcessorOperationParameter("size", ImageProcessorOperationParameter.formatCoords),
			new ImageProcessorOperationParameter("fill", ImageProcessorOperationParameter.formatString)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);
		gAfter.drawImage(imageBefore, 0, 0);

		var args = command.args;
		var color = args[0];
		var pos = Coords.fromString(args[1]);
		var size = Coords.fromString(args[2]);
		var fill = (args[3] == "fill");

		if (fill)
		{
			gAfter.fillStyle = color;
			gAfter.fillRect(pos.x, pos.y, size.x, size.y);
		}
		else
		{
			gAfter.strokeStyle = color;
			gAfter.strokeRect(pos.x, pos.y, size.x, size.y);
		}
	}
}
