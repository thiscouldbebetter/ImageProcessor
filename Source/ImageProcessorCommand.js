
class ImageProcessorCommand
{
	constructor(operation, args) // Note that "arguments" is a keyword.
	{
		this.operation = operation;
		this.args = args;
	}

	static fromLine(lineToParse)
	{
		var operationNameAndArguments = lineToParse.split(" ");
		var operationName = operationNameAndArguments[0];
		var operationInstances = ImageProcessorOperation.Instances();
		var operation = operationInstances.byName(operationName);
		var operationArguments = operationNameAndArguments.slice(1);
		var returnValue = new ImageProcessorCommand(operation, operationArguments);
		return returnValue;
	}

	apply(imageBefore, imageAfter)
	{
		this.operation.apply(this, imageBefore, imageAfter);
	}
}
