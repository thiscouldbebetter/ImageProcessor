
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

		var ipo = (n, p, a) => new ImageProcessorOperation(n, p, a);
		var parametersNone = null;

		this.Blur = new ImageProcessorOperation_Blur();
		this.Box = new ImageProcessorOperation_Box();
		this.Brighten = new ImageProcessorOperation_Brighten();
		this.Clear = new ImageProcessorOperation_Clear();
		this.ColorInvert = new ImageProcessorOperation_ColorInvert();
		this.ColorReplace = new ImageProcessorOperation_ColorReplace();
		this.Crop = new ImageProcessorOperation_Crop();
		this.CropBottomRight = new ImageProcessorOperation_CropBottomRight();
		this.CropToSize = new ImageProcessorOperation_CropToSize();
		this.CropTopLeft = new ImageProcessorOperation_CropTopLeft();
		this.DoNothing = new ImageProcessorOperation_DoNothing();
		this.FlipHorizontal = new ImageProcessorOperation_FlipHorizontal();
		this.FlipVertical = new ImageProcessorOperation_FlipVertical();
		this.GetColorAt = new ImageProcessorOperation_GetColorAt();
		this.GetSize = new ImageProcessorOperation_GetSize();
		this.Grid = new ImageProcessorOperation_Grid();
		this.Monochrome = new ImageProcessorOperation_Monochrome();
		this.Rotate = new ImageProcessorOperation_Rotate();
		this.Scale = new ImageProcessorOperation_Scale();
		this.Shift = new ImageProcessorOperation_Shift();
		this.Text = new ImageProcessorOperation_Text();
		this.Threshold = new ImageProcessorOperation_Threshold();

		this._All =
		[
			this.Blur,
			this.Box,
			this.Brighten,
			this.Clear,
			this.ColorInvert,
			this.ColorReplace,
			this.Crop,
			this.CropBottomRight,
			this.CropToSize,
			this.CropTopLeft,
			this.DoNothing,
			this.FlipHorizontal,
			this.FlipVertical,
			this.GetColorAt,
			this.GetSize,
			this.Grid,
			this.Monochrome,
			this.Rotate,
			this.Scale,
			this.Shift,
			this.Text,
			this.Threshold
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

	static canvasToGraphicsContext(canvas)
	{
		var g = canvas.getContext
		(
			"2d",
			{willReadFrequently: true}
		);
		return g;
	}
}

class ImageProcessorOperationParameter
{
	constructor(name, format)
	{
		this.name = name;
		this.format = format;
	}

	static formatCoords = "[x]x[y]";
	static formatNumber = "number";
	static formatString = "text";

	toStringInstructions()
	{
		return "<" + this.name + ": " + this.format + ">";
	}
}
