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
        console.log('Preview:', content)
        return content
    } catch (err) {
        console.log(err)
    }
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
