
class ImageProcessorOperation_CropToSize
{
	constructor()
	{
		this.name = "croptosize";
		this.parameters =
		[
			new ImageProcessorOperationParameter("size", ImageProcessorOperationParameter.formatCoords)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		command = command.clone();
		command.args =
		[
			Coords.zeroes(),
			command.args[0]
		];
		var instances = ImageProcessorOperation.Instances();
		instances.applyCrop(command, imageBefore, imageAfter);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_CropToSize() );