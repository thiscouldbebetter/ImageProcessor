
class ImageProcessorOperation_Text
{
	constructor()
	{
		this.name = "text";
		this.parameters =
		[
			new ImageProcessorOperationParameter("heightInPixels", ImageProcessorOperationParameter.formatNumber),
			new ImageProcessorOperationParameter("color", ImageProcessorOperationParameter.formatString),
			new ImageProcessorOperationParameter("pos", ImageProcessorOperationParameter.formatCoords),
			new ImageProcessorOperationParameter("text", ImageProcessorOperationParameter.formatString)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		gAfter.drawImage(imageBefore, 0, 0);

		var args = command.args;
		var fontHeight = parseFloat(args[0]);
		var color = args[1];
		var pos = Coords.fromString(args[2]);
		var text = args.slice(3).join(" ");

		gAfter.fillStyle = color;
		gAfter.font = "" + fontHeight + "px sans-serif";
		gAfter.fillText(text, pos.x, pos.y);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Text() );