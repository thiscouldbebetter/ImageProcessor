
class ImageProcessorOperation_Crop
{
	constructor()
	{
		this.name = "crop";
		this.parameters =
		[
			new ImageProcessorOperationParameter("pos", ImageProcessorOperationParameter.formatCoords),
			new ImageProcessorOperationParameter("size", ImageProcessorOperationParameter.formatCoords)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var sizeBefore =
			new Coords(imageBefore.width, imageBefore.height);

		var pos =
			command.args[0] == null
			? Coords.zeroes()
			: Coords.fromString(command.args[0]);

		var sizeCropped =
			command.args[1] == null
			? sizeBefore.clone().subtract(pos)
			: Coords.fromString(command.args[1]);

		imageAfter.width = sizeCropped.x;
		imageAfter.height = sizeCropped.y;

		gAfter.drawImage
		(
			imageBefore,
			pos.x, pos.y,
			sizeCropped.x, sizeCropped.y,
			0, 0,
			sizeCropped.x, sizeCropped.y
		);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Crop() );