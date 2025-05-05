
class ImageProcessorOperation_ColorInvert
{
	constructor()
	{
		this.name = "colorinvert";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
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
				var red = imageBeforeData[pixelComponentOffset];
				var green = imageBeforeData[pixelComponentOffset + 1];
				var blue = imageBeforeData[pixelComponentOffset + 2];
				red = 255 - red;
				green = 255 - green;
				blue = 255 - blue;
				var color = "rgb(" + red + "," + green + "," + blue + ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_ColorInvert() );