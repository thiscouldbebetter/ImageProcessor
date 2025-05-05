
class ImageProcessorOperation_Monochrome
{
	constructor()
	{
		this.name = "monochrome";
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
				var intensity = Math.round(red + green + blue / 3);	
				var color = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Monochrome() );