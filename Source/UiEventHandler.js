
class UiEventHandler
{
	static buttonApply_Clicked()
	{
		var d = document;

		var divImageAfter = d.getElementById("divImageAfter");
		var imageAsCanvasAfter =
			divImageAfter.getElementsByTagName("canvas")[0];
		if (imageAsCanvasAfter != null)
		{
			var divImageBefore = d.getElementById("divImageBefore");
			var imageAsCanvasBefore =
				divImageBefore.getElementsByTagName("canvas")[0];
			imageAsCanvasBefore.width = imageAsCanvasAfter.width;
			imageAsCanvasBefore.height = imageAsCanvasAfter.height;
			var graphicsBefore =
				imageAsCanvasBefore.getContext("2d");

			graphicsBefore.drawImage(imageAsCanvasAfter, 0, 0);
		}
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
			var imageAsCanvasWorking = d.createElement("canvas");
			imageAsCanvasWorking.width = imageAsCanvasBefore.width;
			imageAsCanvasWorking.height = imageAsCanvasBefore.height;

			var imageAsCanvasAfter = d.createElement("canvas");
			imageAsCanvasAfter.width = imageAsCanvasBefore.width;
			imageAsCanvasAfter.height = imageAsCanvasBefore.height;
			var divImageAfter = d.getElementById("divImageAfter");
			divImageAfter.innerHTML = "";
			divImageAfter.appendChild(imageAsCanvasAfter);

			var imageProcessor = new ImageProcessor
			(
				imageAsCanvasBefore, imageAsCanvasWorking, imageAsCanvasAfter
			);

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
			if (commandsToPerform.length == 0)
			{
				alert("There are no operations to perform.");
			}
			else
			{
				imageProcessor.imageBeforeCopyToWorking();
				var imageWorking = imageProcessor.imageAsCanvasWorking;
				var imageAfter = imageProcessor.imageAsCanvasAfter;

				for (var i = 0; i < commandsToPerform.length; i++)
				{
					var command = commandsToPerform[i];
					command.apply(imageWorking, imageAfter);

					imageProcessor.imageAfterCopyToWorking();
				}
			}
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
			"shift 100x-20"
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

	static inputFile_Changed()
	{
		var d = document;

		var divImageBefore = d.getElementById("divImageBefore");
		// divImageAsCanvas.innerHTML = "Loading image..."; // Probably doesn't work.

		var inputFile = d.getElementById("inputFile");
		var file = inputFile.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (eventFileLoaded) =>
			{
				var imageAsDataUrl = eventFileLoaded.target.result;

				var imgImageLoaded = d.createElement("img");
				imgImageLoaded.style.border = "1px solid";
				imgImageLoaded.onload = (eventImageLoaded) =>
				{
					var canvasImage = d.createElement("canvas");
					canvasImage.width = imgImageLoaded.width;
					canvasImage.height = imgImageLoaded.height;
					var graphics = canvasImage.getContext("2d");
					graphics.drawImage(imgImageLoaded, 0, 0);
					divImageBefore.innerHTML = "";
					divImageBefore.appendChild(canvasImage);
				}
				imgImageLoaded.src = imageAsDataUrl;
			}
			fileReader.readAsDataURL(file);
		}
	}
}
