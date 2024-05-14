const getRailContent = async () => {
	try {
		const req = await fetch("./files/rail.json")
		const content = await req.json()
		return content
	} catch (err) {
		console.log(err)
	}
}

const getConfig = async () => {
	try {
		const req = await fetch("./files/config.json")
		const content = await req.json()
		return content
	} catch (err) {
		console.log(err)
	}
}

const getPreviewContent = async (identifier: string | null) => {
	try {
		const req = await fetch(`http://192.168.168.180:3000/api/preview/${identifier}`)
		const content = await req.json()
		console.log("Preview:", content)
		return content
	} catch (err) {
		console.log(err)
	}
}

export const getAllImages = (Object) => {
	let Array: string[] = []
	Array = [...Array, ...Object.dwell.images]
	Object.content.forEach((Category) => {
		if (Category._type === "stories") {
			Category.items.forEach((Item) => {
				if (Item.heroImage) Array = Array = [...Array, Item.heroImage]
				Item.storyMedia.forEach((Media) => {
					if (Media.full) Array = Array = [...Array, Media.full]
					if (Media.thumbnail) Array = Array = [...Array, Media.thumbnail]
				})
			})
		} else if (Category._type === "media") {
			Category.items.forEach((Group) => {
				if (Group.heroImage) Array = Array = [...Array, Group.heroImage]
				Group.items.forEach((Item) => {
					if (Item.thumbnail) Array = Array = [...Array, Item.thumbnail]
				})
			})
		} else if (Category._type === "artifacts") {
			Category.items.forEach((Item) => {
				Item.artifactImages.forEach((Image) => {
					if (Image.image) Array = Array = [...Array, Image.image, addAltSize(Image.image, "_threequarter"), addAltSize(Image.image, "_half"), addAltSize(Image.image, "_quarter")]
				})
			})
		}
	})
	return Array
}

const addAltSize = (path: string, size: string) => {
	const filename = path.substring(0, path.length - 4)
	const extension = path.replace(filename, "")
    return `${filename}${size}${extension}`
}

export const loadData = async (previewIdentifier = null) => {
	try {
		if (!previewIdentifier) {
			const rail = await getRailContent()
			const config = await getConfig()
			return { rail: rail, config: config }
		} else {
			const previewContent = await getPreviewContent(previewIdentifier)
			return previewContent
		}
	} catch (err) {
		console.log(err)
	}
}

export const setRailStyles = (styleSet: any, configObject: any, gallery: string) => {
	styleSet.setProperty("--dr-title-font", configObject["dr-title-font"])
	styleSet.setProperty("--dr-body-font", configObject["dr-body-font"])
	styleSet.setProperty("--dr-gallery-color", configObject[gallery].color)
	styleSet.setProperty("--dr-gallery-color-active", configObject[gallery].activeColor)
	if (configObject[gallery].hasOwnProperty("dateRangeColor")) {
		styleSet.setProperty("--dr-gallery-color-dateRange", configObject[gallery].dateRangeColor)
	}
}
