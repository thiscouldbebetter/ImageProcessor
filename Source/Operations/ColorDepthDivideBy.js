
class ImageProcessorOperation_ColorDepthDivideBy
{
	constructor()
	{
		this.name = "colordepthdivideby";
		this.parameters =
		[
			new ImageProcessorOperationParameter
			(
				"divisor",
				ImageProcessorOperationParameter.formatNumber
			)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		var divisor = parseFloat(command.args[0]);

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
					componentsBefore.map(x => Math.floor(x / divisor) * divisor);

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

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_ColorDepthDivideBy() );