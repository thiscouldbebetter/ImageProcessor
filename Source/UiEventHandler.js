
class UiEventHandler
{
	static buttonApply_Clicked()
	{
		var imageProcessor = ImageProcessor.Instance();
		imageProcessor.imagesAfterApplyToBefore();
	}

	static buttonPreview_Clicked()
	{
		var d = document;

		var divImageBefore = d.getElementById("divImageBefore");
		var imageAsCanvasBefore =
			divImageBefore.getElementsByTagName("canvas")[0];

		if (imageAsCanvasBefore == null)
		{
			alert("An image must be loaded before previewing an operation!");
		}
		else
		{
			var textareaOperationsToPerform =
				d.getElementById("textareaOperationsToPerform");
			var commandsToPerformAsText =
				textareaOperationsToPerform.value;
			var commandsToPerformAsLines =
				commandsToPerformAsText.split("\n");
			commandsToPerformAsLines =
				commandsToPerformAsLines.map(x => x.trim());
			commandsToPerformAsLines =
				commandsToPerformAsLines.filter
				(
					x => x != "" && x.startsWith("//") == false
				);
			var commandsToPerform = commandsToPerformAsLines.map
			(
				x => ImageProcessorCommand.fromLine(x)
			);

			var imageProcessor = ImageProcessor.Instance();

			imageProcessor.commandsPerform(commandsToPerform);
		}
	}

	static buttonOperationsClear_Clicked()
	{
		var d = document;
		var textareaOperationsToPerform =
			d.getElementById("textareaOperationsToPerform");
		textareaOperationsToPerform.value = "";
	}

	static buttonOperationsLoadDemo_Clicked()
	{
		var d = document;
		var textareaOperationsToPerform =
			d.getElementById("textareaOperationsToPerform");

		var operationsToDemoAsLines =
		[
			"blur",
			"box cyan 20x30 40x50 fill",
			"colorinvert",
			"crop 10x20 200x200",
			"donothing",
			"fliphorizontal",
			"flipvertical",
			"rotate",
			"scale 2x.5",
			"text 40 red 20x30 hello",
			"shift 100x-20",
			"// End of list."
		];
		var newline = "\n";
		var operationsToDemoAsString = operationsToDemoAsLines.join(newline);
		textareaOperationsToPerform.value = operationsToDemoAsString;
	}

	static buttonOperationsList_Clicked()
	{
		var operationsAvailable =
			ImageProcessorOperation.Instances()._All;
		var operationsAvailableAsStrings =
			operationsAvailable.map(x => x.toStringInstructions());
		var operationsAvailableJoined =
			operationsAvailableAsStrings.join("\n");
		var instructions =
			"Operations Available:\n"
			+ "\n"
			+ operationsAvailableJoined
			+ "\n";

		alert(instructions);
	}

	static buttonSave_Clicked()
	{
		ImageProcessor.Instance().imagesProcessedSave();
	}

	static buttonSaveAsTarFile_Clicked()
	{
		ImageProcessor.Instance().imagesProcessedSaveAsTarFile();
	}

	static inputFiles_Changed(inputFiles)
	{
		var d = document;

		var divImageBefore = d.getElementById("divImageBefore");
		// divImageAsCanvas.innerHTML = "Loading image..."; // Probably doesn't work.

		var files = inputFiles.files;
		if (files.length > 0)
		{
			var imgElementsLoadedSoFar = [];

			for (var i = 0; i < files.length; i++)
			{
				var file = files[i];
				var fileReader = new FileReader();
				fileReader.fileName = file.name;
				fileReader.onload = (eventFileLoaded) =>
				{
					var imageAsDataUrl = eventFileLoaded.target.result;

					var imgImageToLoad = d.createElement("img");
					imgImageToLoad.name = eventFileLoaded.target.fileName;
					imgImageToLoad.style.border = "1px solid";
					imgImageToLoad.onload = (eventImageLoaded) =>
					{
						var imgImageLoaded = eventImageLoaded.target;
						imgElementsLoadedSoFar.push(imgImageLoaded);
						if (imgElementsLoadedSoFar.length >= files.length)
						{
							this.inputFiles_Changes_ImagesLoaded
							(
								imgElementsLoadedSoFar
							);
						}
					}
					imgImageToLoad.src = imageAsDataUrl;
				}
				fileReader.readAsDataURL(file);
			}
		}
	}

	static inputFiles_Changes_ImagesLoaded(imgElementsLoaded)
	{
		var imageProcessor = ImageProcessor.Instance();
		var d = document;
		var selectImagesToProcess =
			d.getElementById("selectImagesToProcess");
		for (var i = 0; i < imgElementsLoaded.length; i++)
		{
			var imgElement = imgElementsLoaded[i];

			imageProcessor.imageAdd(imgElement);

			var imageAsOption = d.createElement("option");
			imageAsOption.innerHTML = imgElement.name;
			imageAsOption.value = imgElement.name;
			selectImagesToProcess.appendChild(imageAsOption);
		}

		this.selectImagesToProcess_Changed();
	}

	static selectImagesToProcess_Changed()
	{
		var d = document;
		var selectImagesToProcess =
			d.getElementById("selectImagesToProcess");
		var imagePairBeforeAndAfterSelectedName =
			selectImagesToProcess.value;
		var imageProcessor = ImageProcessor.Instance();
		imageProcessor.imagePairBeforeAndAfterSelectByName
		(
			imagePairBeforeAndAfterSelectedName
		);
	}

	static textareaOperationsToPerform_KeyPressed(e)
	{
		var keyPressed = e.key;
		if (keyPressed == "F12")
		{
			e.preventDefault();
			if (e.shiftKey)
			{
				UiEventHandler.buttonApply_Clicked();
			}
			else
			{
				UiEventHandler.buttonPreview_Clicked();
			}
		}
	}

}
