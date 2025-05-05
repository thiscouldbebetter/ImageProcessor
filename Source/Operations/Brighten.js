
class ImageProcessorOperation_Brighten
{
	constructor()
	{
		this.name = "brighten";
		this.parameters =
		[
			new ImageProcessorOperationParameter("increment", ImageProcessorOperationParameter.formatNumber)
		]
	}

	apply(command, imageBefore, imageAfter)
	{
		var args = command.args;
		var intensityOffset = 255 * parseFloat(args[0]);

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		for (var y = 0; y < size.y; y++)
		{
			for (var x = 0; x < size.x; x++)
			{
				var pixelIndex = y * size.x + x;
				var pixelComponentOffset = pixelIndex * 4;

				var componentsBefore =
				[
					imageBeforeData[pixelComponentOffset],
					imageBeforeData[pixelComponentOffset + 1],
					imageBeforeData[pixelComponentOffset + 2]
				];

				var componentsAfter = 
					componentsBefore.slice().map
					(
						x =>
						{
							x += intensityOffset;
							x = x < 0 ? 0 : x > 255 ? 255 : x;
							return x;
						}
					)

				var colorAfter =
					"rgb("
					+ componentsAfter.join(",")
					+ ")";

				gAfter.fillStyle = colorAfter;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Brighten() );