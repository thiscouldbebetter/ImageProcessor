
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

	static toStringInstructions(operation)
	{
		var returnValue =
			operation.name + " "
			+ operation.parameters.map(x => x.toStringInstructions()).join(" ");

		return returnValue;
	}
}

class ImageProcessorOperation_Instances
{
	constructor()
	{
		this._All = [];

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

	operationAdd(operationToAdd)
	{
		this._All.push(operationToAdd);
		this._AllByName.set(operationToAdd.name, operationToAdd);
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
