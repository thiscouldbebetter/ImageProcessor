
class ImageProcessorOperation_Threshold
{
	constructor()
	{
		this.name = "threshold";
		this.parameters =
		[
			new ImageProcessorOperationParameter("intensityAsFraction", ImageProcessorOperationParameter.formatNumber),
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var intensityThresholdAsFraction =
			parseFloat(command.args[0]);

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
				var intensityBefore = Math.round(red + green + blue / 3);
				var intensityBeforeAsFraction =
					intensityBefore / componentMax;
				var intensityAfter =
					intensityBeforeAsFraction < intensityThresholdAsFraction
					? 0
					: componentMax;
				var color =
					"rgb(" + intensityAfter + "," + intensityAfter + "," + intensityAfter + ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}
