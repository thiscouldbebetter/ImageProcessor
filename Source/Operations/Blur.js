
class ImageProcessorOperation_Blur
{
	constructor()
	{
		this.name = "blur";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		var convolutionKernelCellRowsAsArrays = 
		[
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1]
		];

		var convolutionKernel =
			ConvolutionKernel.fromCellRowsAsArrays
			(
				convolutionKernelCellRowsAsArrays
			);

		convolutionKernel.apply
		(
			imageBefore, imageAfter, convolutionKernel
		);
	}
}

ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_Blur() );