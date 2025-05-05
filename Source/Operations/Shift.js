
class ImageProcessorOperation_Shift
{
	constructor()
	{
		this.name = "shift";
		this.parameters =
		[
			new ImageProcessorOperationParameter("offset", ImageProcessorOperationParameter.formatCoords)
		];
	}

	apply(command, imageBefore, imageAfter)
	{
		var gBefore = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageBefore);
		var gAfter = ImageProcessorOperation_Instances.canvasToGraphicsContext(imageAfter);

		var size = new Coords(imageBefore.width, imageBefore.height);

		var shiftAmount = Coords.fromString(command.args[0]);
		shiftAmount.wrapToRangeMax(size);

		// Split it into four pieces,
		// so that things shifted off to the left
		// show up on the right, and vice versa.

		// Draw the upper-left quadrant to the lower-right quadrant.
		gAfter.drawImage
		(
			imageBefore,
			0, 0, // sx, sy
			size.x - shiftAmount.x, size.y - shiftAmount.y, // sw, sh
			shiftAmount.x, shiftAmount.y, // dx, dy
			size.x - shiftAmount.x, size.y - shiftAmount.y // dw, dh
		);

		// Draw the upper-right quadrant to the lower-left quadrant.
		gAfter.drawImage
		(
			imageBefore,
			size.x - shiftAmount.x, 0, // sx, sy
			shiftAmount.x, size.y - shiftAmount.y, // sw, sh
			0, shiftAmount.y, // dx, dy
			shiftAmount.x, size.y - shiftAmount.y // dw, dh
		);

		// Draw the lower-left quadrant to the upper-right quadrant.
		gAfter.drawImage
		(
			imageBefore,
			0, size.y - shiftAmount.y, // sx, sy
			size.x - shiftAmount.x, shiftAmount.y, // sw, sh
			shiftAmount.x, 0, // dx, dy
			size.x - shiftAmount.x, shiftAmount.y // dw, dh
		);

		// Draw the lower-right quadrant to the upper-left quadrant.
		gAfter.drawImage
		(
			imageBefore,
			size.x - shiftAmount.x, size.y - shiftAmount.y, // sx, sy
			shiftAmount.x, shiftAmount.y, // sw, sh
			0, 0, // dx, dy
			shiftAmount.x, shiftAmount.y // dw, dh
		);
	}
}
