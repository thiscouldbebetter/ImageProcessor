
class ImageProcessorOperation_BlackWhiteThresholds
{
	constructor()
	{
		this.name = "blackwhitethresholds";
		this.parameters =
		[
			new ImageProcessorOperationParameter
			(
				"intensityMaxBlackAsFraction",
				ImageProcessorOperationParameter.formatNumber
			),
			new ImageProcessorOperationParameter
			(
				"intensityMinWhiteAsFraction",
				ImageProcessorOperationParameter.formatNumber
			),
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var intensityMaxBlackAsFraction =
			command.args[0] == null
			? 0.5
			: parseFloat(command.args[0]);

		var intensityMinWhiteAsFraction =
			command.args[1] == null
			? 0.5
			: parseFloat(command.args[1]);

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		var componentMax = 255;

		for (var y = 0; y < size.y; y++)
		{
			for (var x = 0; x < size.x; x++)
			{
				var pixelIndex = y * size.x + x;
				var pixelComponentOffset = pixelIndex * 4;
				var red = imageBeforeData[pixelComponentOffset];
				var green = imageBeforeData[pixelComponentOffset + 1];
				var blue = imageBeforeData[pixelComponentOffset + 2];
				var intensityBefore = Math.round( (red + green + blue) / 3);
				var intensityBeforeAsFraction =
					intensityBefore / componentMax;

				var intensityAfterAsFraction =
					intensityBeforeAsFraction < intensityMaxBlackAsFraction
					? 0
					: intensityBeforeAsFraction > intensityMinWhiteAsFraction
					? 1
					: intensityBeforeAsFraction;

				var intensityAfterAsComponent = Math.round
				(
					intensityAfterAsFraction * componentMax
				);

				var color =
					"rgb("
					+ intensityAfterAsComponent + ","
					+ intensityAfterAsComponent + ","
					+ intensityAfterAsComponent + ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_BlackWhiteThresholds() );