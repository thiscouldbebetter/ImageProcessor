
class ImageProcessorCommand
{
	constructor(operation, args) // Note that "arguments" is a keyword.
	{
		this.operation = operation;
		this.args = args;
	}

	static fromLine(lineToParse)
	{
		var returnValue = null;

		var operations =
			ImageProcessorOperation.Instances();

		var commentCode = "//";
		if (lineToParse.startsWith(commentCode) )
		{
			returnValue = ImageProcessorCommand(operation.DoNothing, []);
		}
		else
		{
			var operationNameAndArguments = lineToParse.split(" ");
			var operationName = operationNameAndArguments[0];
			var operation = operations.byName(operationName);
			var operationArguments = operationNameAndArguments.slice(1);
			returnValue = new ImageProcessorCommand(operation, operationArguments);
		}

		return returnValue;
	}

	apply(imageBefore, imageAfter)
	{
		this.operation.apply(this, imageBefore, imageAfter);
	}
}
