
class ImageProcessorOperation_Blur
{
	constructor()
	{
		this.name = "blur";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

		var convolutionKernel = 
		[
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1]
		];
		var kernelSize = new Coords
		(
			convolutionKernel[0].length,
			convolutionKernel.length
		);

		for (var yCenter = 0; yCenter < size.y; yCenter++)
		{
			for (var xCenter = 0; xCenter < size.x; xCenter++)
			{
				var pixelRgb = [0, 0, 0];

				for (var c = 0; c < 3; c++)
				{
					var kernelCellTotal = 0;

					for (var kernelY = 0; kernelY < kernelSize.y; kernelY++)
					{
						for (var kernelX = 0; kernelX < kernelSize.x; kernelX++)
						{
							var pixelSourcePosX = xCenter + kernelX - 1;
							var pixelSourcePosY = yCenter + kernelY - 1;
							if
							(
								pixelSourcePosX >= 0
								&& pixelSourcePosX < size.x
								&& pixelSourcePosY >= 0
								&& pixelSourcePosY < size.y
							)
							{
								var kernelCellValue = convolutionKernel[kernelY][kernelX];
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
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Blur() );