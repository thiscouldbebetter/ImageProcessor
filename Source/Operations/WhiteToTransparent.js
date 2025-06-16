
class ImageProcessorOperation_WhiteToTransparent
{
	constructor()
	{
		this.name = "whitetotransparent";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		// This works, but there's a strange rendering problem,
		// where many of the pixels that should be transparent,
		// thus showing the background, render as black instead.
		// However, it still saves correctly.

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		gAfter.clearRect(0, 0, size.x, size.y);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		var componentMax = 255;
		var luminanceMax = componentMax * 3;

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

				var luminanceBefore =
					componentsBefore[0]
					+ componentsBefore[1]
					+ componentsBefore[2];

				var luminanceBeforeAsFractionOfWhite =
					luminanceBefore / luminanceMax;

				// The whiter the pixel, the more transparent,
				// and therefore less opaque, it becomes.
				var opacityAfterAsFraction =
					1 - luminanceBeforeAsFractionOfWhite;

				// Alpha seems to be in the range 0-1, not 0-255.
				//var opacityAfterAsComponent =
					//Math.round(opacityAfterAsFraction * componentMax);

				var colorAfter =
					"rgba("
					+ componentsBefore.join(",")
					+ ","
					+ opacityAfterAsFraction
					+ ")";

				gAfter.fillStyle = colorAfter;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_WhiteToTransparent() );