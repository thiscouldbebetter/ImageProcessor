
class ImageProcessor
{
	constructor()
	{
		this.imagesToProcessAsImgElements = [];
		this.imagesProcessedAsCanvases = [];

		this.imageToProcessSelectedName = null;

		this.domElementUpdate();
	}

	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new ImageProcessor();
		}
		return this._instance;
	}

	commandsPerform(commandsToPerform)
	{
		if (commandsToPerform.length == 0)
		{
			alert("There are no operations to perform.");
		}
		else
		{
			for (var i = 0; i < this.imagesToProcessAsImgElements.length; i++)
			{
				var imageToProcess =
					this.imagesToProcessAsImgElements[i];

				var imageAsCanvasBefore = this.imageAsCanvasBefore;
				imageAsCanvasBefore.width = imageToProcess.width;
				imageAsCanvasBefore.height = imageToProcess.height;

				var imageAsCanvasWorking = this.imageAsCanvasWorking;
				imageAsCanvasWorking.width = imageToProcess.width;
				imageAsCanvasWorking.height = imageToProcess.height;

				var imageAsCanvasAfter = this.imageAsCanvasAfter;
				imageAsCanvasAfter.width = imageToProcess.width;
				imageAsCanvasAfter.height = imageToProcess.height;

				var gBefore = imageAsCanvasBefore.getContext("2d");
				gBefore.drawImage(imageToProcess, 0, 0);

				this.imageBeforeCopyToWorking();
				var imageWorking = this.imageAsCanvasWorking;
				var imageAfter = this.imageAsCanvasAfter;

				for (var c = 0; c < commandsToPerform.length; c++)
				{
					var command = commandsToPerform[c];
					command.apply(imageWorking, imageAfter);

					this.imageAfterCopyToWorking();
				}

				var d = document;
				var imageProcessedAsCanvas =
					d.createElement("canvas");
				this.imageCopyToOther
				(
					imageAfter, imageProcessedAsCanvas
				);

				this.imagesProcessedAsCanvases[i] =
					imageProcessedAsCanvas;
			}
		}

		this.domElementUpdate();
	}

	imageAdd(imageToAdd)
	{
		this.imagesToProcessAsImgElements.push(imageToAdd);
	}

	imageByName(name)
	{
		return this.imagesToProcessAsImgElements.find(x => x.name == name);
	}

	imageCopyToOther(imageToCopy, imageToCopyOver)
	{
		imageToCopyOver.width = imageToCopy.width;
		imageToCopyOver.height = imageToCopy.height;
		var graphicsToCopyOver = imageToCopyOver.getContext("2d");
		graphicsToCopyOver.drawImage(imageToCopy, 0, 0);
	}

	imageSelectByName(name)
	{
		this.imageToProcessSelectedName = name;

		var imgSelected = this.imageByName(name);
		if (imgSelected == null)
		{
			imgSelected = this.imagesToProcessAsImgElements[0];
		}

		this.imageCopyToOther(imgSelected, this.imageAsCanvasBefore);
		this.domElementUpdate();
	}

	imageSelected()
	{
		return this.imageByName(this.imageToProcessSelectedName);
	}

	// Copying.

	imageAfterCopyToWorking()
	{
		this.imageCopyToOther(this.imageAsCanvasAfter, this.imageAsCanvasWorking);
	}

	imageBeforeCopyToAfter()
	{
		this.imageCopyToOther(this.imageAsCanvasBefore, this.imageAsCanvasAfter);
	}

	imageBeforeCopyToWorking()
	{
		this.imageCopyToOther(this.imageAsCanvasBefore, this.imageAsCanvasWorking);
	}

	imageWorkingCopyToAfter()
	{
		this.imageCopyToOther(this.imageAsCanvasWorking, this.imageAsCanvasAfter);
	}

	// DOM.

	domElementUpdate()
	{
		var d = document;

		if (this._domElement == null)
		{
			var divUi = d.getElementById("divUi");
			this._domElement = divUi;

			this.imageAsCanvasBefore = d.createElement("canvas");
			this.imageAsCanvasWorking = d.createElement("canvas");
			this.imageAsCanvasAfter = d.createElement("canvas");
		}

		var divImageBefore = d.getElementById("divImageBefore");
		divImageBefore.innerHTML = "";

		var divImageAfter = d.getElementById("divImageAfter");
		divImageAfter.innerHTML = "";

		var imageSelected = this.imageSelected();
		if (imageSelected != null)
		{
			this.imageAsCanvasBefore = imageSelected;
			this.imageBeforeCopyToAfter();

			divImageBefore.appendChild(this.imageAsCanvasBefore);

			divImageAfter.appendChild(this.imageAsCanvasAfter);
		}
	}
}
