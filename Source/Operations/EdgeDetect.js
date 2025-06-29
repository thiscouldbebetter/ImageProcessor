
class ImageProcessorOperation_EdgeDetect
{
	constructor()
	{
		this.name = "edgedetect";
		this.parameters = [];
	}

	apply(command, imageBefore, imageAfter)
	{
		throw new Error("Not yet implemented!");

		// This doesn't work.  At a minimum,
		// I don't think this program can handle
		// convolution mask cells with negative values.

		var masks =
		[
			[
				[1, 0, -1],
				[2, 0, -2],
				[1, 0, -1]
			],

			[
				[1, 2, 1],
				[0, 0, 0],
				[-1, -2, -1]
			]
		];

		for (var m = 0; m < masks.length; m++)
		{
			var mask = masks[m];

			var convolutionKernel =
				ConvolutionKernel.fromCellRowsAsArrays(mask);

			convolutionKernel.apply
			(
				imageBefore, imageAfter
			);
		}
	}
}

// ImageProcessorOperation.Instances().operationAdd(new ImageProcessorOperation_EdgeDetect() );