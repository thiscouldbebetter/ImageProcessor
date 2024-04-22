
class ImageProcessor
{
	constructor()
	{
		this.imagePairsBeforeAndAfter = [];

		this.imagePairBeforeAndAfterSelectedName = null;

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
			var imagePairs =
				this.imagePairsBeforeAndAfter;

			for (var i = 0; i < imagePairs.length; i++)
			{
				var imagePair = imagePairs[i];
				var imageBefore = imagePair.before;
				var imageAfter = imagePair.after;

				var imageAsCanvasBefore = this.imageAsCanvasBefore;
				imageAsCanvasBefore.width = imageBefore.width;
				imageAsCanvasBefore.height = imageBefore.height;

				var imageAsCanvasWorking = this.imageAsCanvasWorking;
				imageAsCanvasWorking.width = imageBefore.width;
				imageAsCanvasWorking.height = imageBefore.height;

				var imageAsCanvasAfter = this.imageAsCanvasAfter;
				imageAsCanvasAfter.width = imageBefore.width;
				imageAsCanvasAfter.height = imageBefore.height;

				var gBefore = imageAsCanvasBefore.getContext
				(
					"2d", {willReadFrequently: true}
				);
				gBefore.drawImage(imageBefore, 0, 0);

				var imageWorking = this.imageAsCanvasWorking;
				this.imageCopyToOther(imageBefore, imageWorking);

				for (var c = 0; c < commandsToPerform.length; c++)
				{
					var command = commandsToPerform[c];
					command.apply(imageWorking, imageAfter);

					this.imageCopyToOther(imageAfter, imageWorking);
				}
			}
		}

		this.domElementUpdate();
	}

	imageAdd(imageToAdd)
	{
		var d = document;
		var imageBeforeAsCanvas = d.createElement("canvas");
		var imageAfterAsCanvas = d.createElement("canvas");
		var imagePairBeforeAndAfter = new ImagePairBeforeAndAfter
		(
			imageToAdd.name,
			imageBeforeAsCanvas,
			imageAfterAsCanvas
		);
		this.imageCopyToOther(imageToAdd, imageBeforeAsCanvas);
		this.imageCopyToOther(imageToAdd, imageAfterAsCanvas);
		this.imagePairsBeforeAndAfter.push(imagePairBeforeAndAfter);
	}

	imagePairBeforeAndAfterByName(name)
	{
		return this.imagePairsBeforeAndAfter.find(x => x.name == name);
	}

	imageCopyToOther(imageToCopy, imageToCopyOver)
	{
		imageToCopyOver.name = imageToCopy.name;
		imageToCopyOver.width = imageToCopy.width;
		imageToCopyOver.height = imageToCopy.height;
		var graphicsToCopyOver = imageToCopyOver.getContext("2d");
		graphicsToCopyOver.drawImage(imageToCopy, 0, 0);
	}

	imagePairBeforeAndAfterSelected()
	{
		return this.imagePairBeforeAndAfterByName
		(
			this.imagePairBeforeAndAfterSelectedName
		);
	}

	imagePairBeforeAndAfterSelectByName(name)
	{
		this.imagePairBeforeAndAfterSelectedName = name;

		var imagePairSelected =
			this.imagePairBeforeAndAfterByName(name);
		if (imagePairSelected == null)
		{
			var imagePairSelected =
				this.imagePairsBeforeAndAfter[0];
		}

		this.imageCopyToOther(imagePairSelected.before, this.imageAsCanvasBefore);

		this.domElementUpdate();
	}

	imagePairBeforeAndAfterSelected()
	{
		return this.imagePairBeforeAndAfterByName
		(
			this.imagePairBeforeAndAfterSelectedName
		);
	}

	imagesAfterApplyToBefore()
	{
		var imagePairs = this.imagePairsBeforeAndAfter;

		for (var i = 0; i < imagePairs.length; i++)
		{
			var imagePair = imagePairs[i];
			var imageAfter = imagePair.after;
			var imageBefore = imagePair.before;
			this.imageCopyToOther(imageAfter, imageBefore);
		}
		this.domElementUpdate();
	}

	imagesProcessedSave()
	{
		var imagePairs = this.imagePairsBeforeAndAfter;

		var d = document;

		for (var i = 0; i < imagePairs.length; i++)
		{
			var imagePair = imagePairs[i];
			var imageName = imagePair.name;
			var imageToSave = imagePair.after;

			var imageToSaveAsDataUrl =
				imageToSave.toDataURL("image/png");

			var imageToSaveAsLink = d.createElement("a");
			imageToSaveAsLink.href = imageToSaveAsDataUrl;
			imageToSaveAsLink.download = imageName;
			imageToSaveAsLink.click();
		}

		alert("" + imagePairs.length + " image(s) saved.");
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

		var imagePairSelected = this.imagePairBeforeAndAfterSelected();
		if (imagePairSelected != null)
		{
			this.imageCopyToOther
			(
				imagePairSelected.before,
				this.imageAsCanvasBefore
			);

			this.imageCopyToOther
			(
				imagePairSelected.after,
				this.imageAsCanvasAfter
			);

			divImageBefore.appendChild(this.imageAsCanvasBefore);

			divImageAfter.appendChild(this.imageAsCanvasAfter);
		}
	}
}

class ImagePairBeforeAndAfter
{
	constructor(name, before, after)
	{
		this.name = name;
		this.before = before;
		this.after = after;
	}
}