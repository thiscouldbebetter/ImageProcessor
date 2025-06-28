
class ConvolutionKernel
{
	constructor(cellRowsAsArrays)
	{
		this.cellRowsAsArrays = cellRowsAsArrays;
	}

	static fromCellRowsAsArrays(cellRowsAsArrays)
	{
		return new ConvolutionKernel(cellRowsAsArrays);
	}

	apply
	(
		imageBefore,
		imageAfter
	)
	{
		var gBefore =
			ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter =
			ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		var cellRowsAsArrays = this.cellRowsAsArrays;
		var kernelSize = Coords.fromXY
		(
			cellRowsAsArrays[0].length,
			cellRowsAsArrays.length
		);

		var centerPos = Coords.create();

		for (var yCenter = 0; yCenter < size.y; yCenter++)
		{
			centerPos.y = yCenter;

			for (var xCenter = 0; xCenter < size.x; xCenter++)
			{
				centerPos.x = xCenter;

				var pixelRgb = this.apply_Pixel
				(
					kernelSize,
					centerPos,
					size,
					imageBeforeData
				);

				var color =
					"rgb("
					+ Math.round(pixelRgb[0]) + ","
					+ Math.round(pixelRgb[1]) + ","
					+ Math.round(pixelRgb[2])
					+ ")";
				gAfter.fillStyle = color;
				gAfter.fillRect(xCenter, yCenter, 1, 1);
			}
		}
	}

	apply_Pixel
	(
		kernelSize,
		centerPos,
		size,
		imageBeforeData
	)
	{
		var pixelRgb = [0, 0, 0];

		var componentsPerColor = 3;
		for (var c = 0; c < componentsPerColor; c++)
		{
			var kernelCellTotal = 0;

			var kernelCellPos = Coords.create();

			for (var kernelY = 0; kernelY < kernelSize.y; kernelY++)
			{
				kernelCellPos.y = kernelY;
				var kernelCellRow = this.cellRowsAsArrays[kernelY];

				for (var kernelX = 0; kernelX < kernelSize.x; kernelX++)
				{
					kernelCellPos.x = kernelX;
					var kernelCellValue = kernelCellRow[kernelX];

					var pixelSourcePosX = centerPos.x + kernelCellPos.x - 1;
					var pixelSourcePosY = centerPos.y + kernelCellPos.y - 1;
					if
					(
						pixelSourcePosX >= 0
						&& pixelSourcePosX < size.x
						&& pixelSourcePosY >= 0
						&& pixelSourcePosY < size.y
					)
					{
						kernelCellTotal += kernelCellValue;

						var pixelSourceIndex =
							pixelSourcePosY * size.x + pixelSourcePosX;
						var pixelComponentOffset = pixelSourceIndex * 4;

						var pixelSourceComponent =
							imageBeforeData[pixelComponentOffset + c];

						pixelSourceComponent *= kernelCellValue;

						pixelRgb[c] += pixelSourceComponent;
					}
				}
			}

			pixelRgb[c] /= kernelCellTotal;
		}

		return pixelRgb;
	}
}
