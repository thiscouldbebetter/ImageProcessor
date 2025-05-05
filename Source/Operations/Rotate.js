
class ImageProcessorOperation_Rotate
{
	constructor()
	{
		this.name = "rotate";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		imageAfter.width = imageBefore.height;
		imageAfter.height = imageBefore.width;

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
				var color = "rgb(" + red + "," + green + "," + blue + ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(size.y - y - 1, x, 1, 1);
			}
		}
	}
}
