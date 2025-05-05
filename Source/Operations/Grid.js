
class ImageProcessorOperation_Grid
{
	constructor()
	{
		this.name = "grid";
		this.parameters =
		[
			new ImageProcessorOperationParameter("cellSizeInPixels", ImageProcessorOperationParameter.formatCoords),
			new ImageProcessorOperationParameter("color", ImageProcessorOperationParameter.formatString)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var args = command.args;
		var cellSizeInPixels =
			args[0] == null
			? new Coords(100, 100)
			: Coords.fromString(args[0]);
		var gridColor = args[1] || "Cyan";

		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var imageSizeInPixels =
			new Coords(imageBefore.width, imageBefore.height);
		var imageSizeInCells =
			imageSizeInPixels
				.clone()
				.divide(cellSizeInPixels)
				.ceiling();

		gAfter.drawImage(imageBefore, 0, 0);
		gAfter.strokeStyle = gridColor;

		for (var y = 0; y < imageSizeInCells.y; y++)
		{
			var linePosInPixels = y * cellSizeInPixels.y;
			gAfter.beginPath();
			gAfter.moveTo(0, linePosInPixels);
			gAfter.lineTo(imageSizeInPixels.x, linePosInPixels);
			gAfter.stroke();
		}

		for (var x = 0; x < imageSizeInCells.x; x++)
		{
			var linePosInPixels = x * cellSizeInPixels.x;
			gAfter.beginPath();
			gAfter.moveTo(linePosInPixels, 0);
			gAfter.lineTo(linePosInPixels, imageSizeInPixels.y);
			gAfter.stroke();
		}
	}
}
