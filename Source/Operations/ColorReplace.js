
class ImageProcessorOperation_ColorReplace
{
	constructor()
	{
		this.name = "colorreplace";
		this.parameters =
		[
			new ImageProcessorOperationParameter("colorFrom", ImageProcessorOperationParameter.formatString),
			new ImageProcessorOperationParameter("colorTo", ImageProcessorOperationParameter.formatString)
		];
	}
	apply(command, imageBefore, imageAfter)
	{
		var args = command.args;
		var colorFrom = args[0];
		var colorTo = args[1];

		var d = document;
		var colorFromAsCanvas = d.createElement("canvas");
		colorFromAsCanvas.width = 1;
		colorFromAsCanvas.height = 1;
		var gColorFromSwatch = colorFromAsCanvas.getContext("2d");
		gColorFromSwatch.fillStyle = colorFrom;
		gColorFromSwatch.fillRect(0, 0, 1, 1);
		var colorFromAsImageData =
			gColorFromSwatch.getImageData(0, 0, 1, 1).data;
		var colorFromRed = colorFromAsImageData[0];
		var colorFromGreen = colorFromAsImageData[1];
		var colorFromBlue = colorFromAsImageData[2];
		var colorFromAlpha = colorFromAsImageData[3];

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		gAfter.drawImage(imageBefore, 0, 0);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		for (var y = 0; y < size.y; y++)
		{
			for (var x = 0; x < size.x; x++)
			{
				var pixelIndex = y * size.x + x;
				var pixelComponentOffset = pixelIndex * 4;

				var colorBeforeRed =
					imageBeforeData[pixelComponentOffset];
				var colorBeforeGreen =
					imageBeforeData[pixelComponentOffset + 1];
				var colorBeforeBlue =
					imageBeforeData[pixelComponentOffset + 2];
				var colorBeforeAlpha =
					imageBeforeData[pixelComponentOffset + 3];

				var colorMatches =
					(colorBeforeRed == colorFromRed)
					&& (colorBeforeGreen == colorFromGreen)
					&& (colorBeforeBlue == colorFromBlue)
					&& (colorBeforeAlpha == colorFromAlpha);

				if (colorMatches)
				{
					gAfter.clearRect(x, y, 1, 1);
					if (colorTo != null)
					{
						gAfter.fillStyle = colorTo;
						gAfter.fillRect(x, y, 1, 1);
					}
				}
			}
		}
	}
}
