
class ImageProcessorOperation_Scale
{
	constructor()
	{
		this.name = "scale";
		this.parameters =
		[
			new ImageProcessorOperationParameter("scaleFactors", ImageProcessorOperationParameter.formatCoords)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var sizeBefore = new Coords(imageBefore.width, imageBefore.height);

		var scaleFactors = Coords.fromString(command.args[0]);
		var sizeScaled = new Coords
		(
			sizeBefore.x * scaleFactors.x,
			sizeBefore.y * scaleFactors.y
		);

		imageAfter.width = sizeScaled.x;
		imageAfter.height = sizeScaled.y;

		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);
		gAfter.drawImage
		(
			imageBefore,
			0, 0, // pos
			sizeScaled.x, sizeScaled.y // size
		);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Scale() );