
class Coords
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	static fromString(stringToParse)
	{
		var xAndY = stringToParse.split("x");
		var x = parseFloat(xAndY[0]);
		var y = parseFloat(xAndY[1]);
		return new Coords(x, y);
	}

	wrapToRangeMax(max)
	{
		while (this.x < 0)
		{
			this.x += max.x;
		}

		while (this.x >= max.x)
		{
			this.x -= max.x;
		}

		while (this.y < 0)
		{
			this.y += max.y;
		}

		while (this.y >= max.y)
		{
			this.y -= max.y;
		}

		return this;
	}
}
