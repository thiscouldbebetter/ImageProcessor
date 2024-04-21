
class ImageProcessorOperation
{
	constructor(name, parameters, apply)
	{
		this.name = name;
		this.parameters = parameters || [];
		this._apply = apply;
	}

	static Instances()
	{
		if (ImageProcessorOperation._instances == null)
		{
			ImageProcessorOperation._instances =
				new ImageProcessorOperation_Instances();
		}
		return ImageProcessorOperation._instances;
	}

	apply(command, imageBefore, imageAfter)
	{
		this._apply(command, imageBefore, imageAfter);
	}

	toStringInstructions()
	{
		var returnValue =
			this.name + " "
			+ this.parameters.map(x => x.toStringInstructions()).join(" ");

		return returnValue;
	}
}

class ImageProcessorOperation_Instances
{
	constructor()
	{
		var p = (n, f) => new ImageProcessorOperationParameter(n, f);

		var formatCoords = "[x]x[y]";
		var formatNumber = "number";
		var formatString = "text";

		var ipo = (n, p, a) => new ImageProcessorOperation(n, p, a);
		var parametersNone = null;

		this.Blur = ipo("blur", parametersNone, this.applyBlur);

		this.Box = ipo
		(
			"box",
			[
				p("color", formatString),
				p("pos", formatCoords),
				p("size", formatCoords),
				p("fill", formatString)
			], // parameters
			this.applyBox
		);

		this.Brighten = ipo
		(
			"brighten",
			[
				p("increment", formatNumber)
			], // parameters
			this.applyBrighten
		);

		this.Clear = ipo
		(
			"clear",
			[
				p("color", formatString),
			], // parameters
			this.applyClear
		);

		this.ColorInvert = ipo("colorinvert", parametersNone, this.applyColorInvert);

		this.ColorReplace = ipo
		(
			"colorreplace",
			[
				p("colorFrom", formatString),
				p("colorTo", formatString)
			],
			this.applyColorReplace
		);

		this.Crop = new ImageProcessorOperation
		(
			"crop",
			[
				p("pos", formatCoords),
				p("size", formatCoords)
			], // parameters
			this.applyCrop
		);

		this.DoNothing = ipo
		(
			"donothing",
			[], // parameters
			this.applyDoNothing
		);

		this.FlipHorizontal = ipo
		(
			"fliphorizontal",
			[], // parameters
			this.applyFlipHorizontal
		);

		this.FlipVertical = ipo
		(
			"flipvertical",
			[], // parameters
			this.applyFlipVertical
		);

		this.GetColorAt = ipo
		(
			"getcolorat",
			[], // parameters
			this.applyGetColorAt
		);

		this.GetSize = ipo
		(
			"getsize",
			[], // parameters
			this.applyGetSize
		);

		this.Monochrome = ipo
		(
			"monochrome",
			[], // parameters
			this.applyMonochrome
		);

		this.Rotate = ipo
		(
			"rotate",
			[], // parameters
			this.applyRotate
		);

		this.Scale = ipo
		(
			"scale",
			[
				p("scaleFactors", formatCoords)
			], // parameters
			this.applyScale
		);

		this.Shift = ipo
		(
			"shift",
			[
				p("offset", formatCoords)
			], // parameters
			this.applyShift
		);

		this.Text = ipo
		(
			"text",
			[
				p("heightInPixels", formatNumber),
				p("color", formatString),
				p("pos", formatCoords),
				p("text", formatString)
			], // parameters
			this.applyText
		);

		this._All =
		[
			this.Blur,
			this.Box,
			this.Brighten,
			this.Clear,
			this.ColorInvert,
			this.ColorReplace,
			this.Crop,
			this.DoNothing,
			this.FlipHorizontal,
			this.FlipVertical,
			this.GetColorAt,
			this.GetSize,
			this.Monochrome,
			this.Rotate,
			this.Scale,
			this.Text,
			this.Shift
		];

		this._AllByName = new Map
		(
			this._All.map(x => [x.name, x] )
		);
	}

	byName(name)
	{
		return this._AllByName.get(name);
	}

	// Applys.

	applyBlur(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyBox(command, imageBefore, imageAfter)
	{
		var gAfter = imageAfter.getContext("2d");
		gAfter.drawImage(imageBefore, 0, 0);

		var args = command.args;
		var color = args[0];
		var pos = Coords.fromString(args[1]);
		var size = Coords.fromString(args[2]);
		var fill = (args[3] == "fill");

		if (fill)
		{
			gAfter.fillStyle = color;
			gAfter.fillRect(pos.x, pos.y, size.x, size.y);
		}
		else
		{
			gAfter.strokeStyle = color;
			gAfter.strokeRect(pos.x, pos.y, size.x, size.y);
		}
	}

	applyBrighten(command, imageBefore, imageAfter)
	{
		var args = command.args;
		var intensityOffset = 255 * parseFloat(args[0]);

		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

		var size = new Coords(imageBefore.width, imageBefore.height);

		var imageBeforeData =
			gBefore.getImageData(0, 0, size.x, size.y).data;

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

				var componentsAfter = 
					componentsBefore.slice().map
					(
						x =>
						{
							x += intensityOffset;
							x = x < 0 ? 0 : x > 255 ? 255 : x;
							return x;
						}
					)

				var colorAfter =
					"rgb("
					+ componentsAfter.join(",")
					+ ")";

				gAfter.fillStyle = colorAfter;
				gAfter.fillRect(x, y, 1, 1);
			}
		}
	}

	applyClear(command, imageBefore, imageAfter)
	{
		var gAfter = imageAfter.getContext("2d");
		var size = new Coords(imageBefore.width, imageBefore.height);
		imageAfter.width = size.x;
		imageAfter.height = size.y;
		gAfter.clearRect(0, 0, size.x, size.y);

		var args = command.args;
		var color = args[0];
		if (color != null)
		{
			gAfter.fillStyle = color;
			gAfter.fillRect(0, 0, size.x, size.y);
		}
	}

	applyColorInvert(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyColorReplace(command, imageBefore, imageAfter)
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

		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyCrop(command, imageBefore, imageAfter)
	{
		var gAfter = imageAfter.getContext("2d");

		var sizeBefore = new Coords(imageBefore.width, imageAfter.height);

		var pos = Coords.fromString(command.args[0]);
		var sizeCropped = Coords.fromString(command.args[1]);

		imageAfter.width = sizeCropped.x;
		imageAfter.height = sizeCropped.y;

		gAfter.drawImage
		(
			imageBefore,
			pos.x, pos.y,
			sizeCropped.x, sizeCropped.y,
			0, 0,
			sizeCropped.x, sizeCropped.y
		);
	}

	applyDoNothing(command, imageBefore, imageAfter)
	{
		var gAfter = imageAfter.getContext("2d");
		gAfter.drawImage(imageBefore, 0, 0);
	}

	applyFlipHorizontal(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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
				gAfter.fillRect(size.x - x - 1, y, 1, 1);
			}
		}
	}

	applyFlipVertical(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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
				gAfter.fillRect(x, size.y - y - 1, 1, 1);
			}
		}
	}

	applyGetColorAt(command, imageBefore, imageAfter)
	{
		var posToCheck = Coords.fromString(command.args[0]);

		var gBefore = imageBefore.getContext("2d");
		var colorAtPosAsComponentsRGBA =
			gBefore.getImageData(posToCheck.x, posToCheck.y, 1, 1).data;
		var colorAtPosAsString =
			"rgba(" + colorAtPosAsComponentsRGBA.join(",") + ")";

		var fontHeightInPixels = 20;

		imageAfter.width = 200;
		imageAfter.height = fontHeightInPixels * 1.5;
		var gAfter = imageAfter.getContext("2d");

		gAfter.fillStyle = "White";
		gAfter.fillRect(0, 0, imageAfter.width, imageAfter.height);
		gAfter.fillStyle = "Black";
		gAfter.font = fontHeightInPixels + "px sans-serif";
		gAfter.fillText(colorAtPosAsString, 0, fontHeightInPixels);
	}

	applyGetSize(command, imageBefore, imageAfter)
	{
		var size = new Coords(imageBefore.width, imageBefore.height);
		var sizeAsString = size.x + "x" + size.y;

		var fontHeightInPixels = 20;

		imageAfter.width = 200;
		imageAfter.height = fontHeightInPixels * 1.5;
		var gAfter = imageAfter.getContext("2d");

		gAfter.fillStyle = "White";
		gAfter.fillRect(0, 0, imageAfter.width, imageAfter.height);
		gAfter.fillStyle = "Black";
		gAfter.font = fontHeightInPixels + "px sans-serif";
		gAfter.fillText(colorComponentsRGBAAsString, 0, fontHeightInPixels);
	}

	applyMonochrome(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyRotate(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyScale(command, imageBefore, imageAfter)
	{
		var sizeBefore = new Coords(imageBefore.width, imageAfter.height);

		var scaleFactors = Coords.fromString(command.args[0]);
		var sizeScaled = new Coords
		(
			sizeBefore.x * scaleFactors.x,
			sizeBefore.y * scaleFactors.y
		);

		imageAfter.width = sizeScaled.x;
		imageAfter.height = sizeScaled.y;

		var gAfter = imageAfter.getContext("2d");
		gAfter.drawImage
		(
			imageBefore,
			0, 0, // pos
			sizeScaled.x, sizeScaled.y // size
		);
	}

	applyShift(command, imageBefore, imageAfter)
	{
		var gBefore = imageBefore.getContext("2d");
		var gAfter = imageAfter.getContext("2d");

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

	applyText(command, imageBefore, imageAfter)
	{
		var gAfter = imageAfter.getContext("2d");

		gAfter.drawImage(imageBefore, 0, 0);

		var args = command.args;
		var fontHeight = parseFloat(args[0]);
		var color = args[1];
		var pos = Coords.fromString(args[2]);
		var text = args.slice(3).join(" ");

		gAfter.fillStyle = color;
		gAfter.font = "" + fontHeight + "px sans-serif";
		gAfter.fillText(text, pos.x, pos.y);
	}
}

class ImageProcessorOperationParameter
{
	constructor(name, format)
	{
		this.name = name;
		this.format = format;
	}

	toStringInstructions()
	{
		return "<" + this.name + ": " + this.format + ">";
	}
}
