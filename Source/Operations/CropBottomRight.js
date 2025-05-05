
class ImageProcessorOperation_CropBottomRight
{
	constructor()
	{
		this.name = "cropbottomright";
		this.parameters =
		[
			new ImageProcessorOperationParameter("amountToTrim", ImageProcessorOperationParameter.formatCoords),
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var sizeBefore =
			new Coords(imageBefore.width, imageBefore.height);

		var amountToTrimAsString =
			command.args[0] || "0x0";
		var amountToTrim =
			Coords.fromString(amountToTrimAsString);

		var sizeAfter =
			sizeBefore
				.clone()
				.subtract(amountToTrim);

		command = command.clone();
		command.args =
		[
			Coords.zeroes().toString(),
			sizeAfter.toString()
		];
		var instances = ImageProcessorOperation.Instances();
		instances.applyCrop(command, imageBefore, imageAfter);
	}
}
