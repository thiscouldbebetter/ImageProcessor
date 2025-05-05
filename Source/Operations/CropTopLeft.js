
class ImageProcessorOperation_CropTopLeft
{
	constructor()
	{
		this.name = "croptopleft";
		this.parameters =
		[
			new ImageProcessorOperationParameter("amountToTrim", ImageProcessorOperationParameter.formatCoords),
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		command = command.clone();
		command.args =
		[
			command.args[0]
		];
		var instances = ImageProcessorOperation.Instances();
		instances.applyCrop(command, imageBefore, imageAfter);
	}
}
