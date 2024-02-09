// const APIURL = 'http://192.168.168.180:9000'

const getRailContent = async () => {
	try {
		const req = await fetch("./mediapool/rail.json")
		const content = await req.json()
		return content
	} catch (err) {
		console.log(err)
	}
}

const getConfig = async () => {
	try {
		const req = await fetch("./mediapool/config.json")
		const content = await req.json()
		return content
	} catch (err) {
		console.log(err)
	}
}

export const loadData = {
	rail: await getRailContent(),
	config: await getConfig(),
}

export const setRailStyles = (styleSet: any, configObject: any, gallery: string) => {
    console.log(configObject, gallery)
    styleSet.setProperty("--dr-title-font", configObject["dr-title-font"])
    styleSet.setProperty("--dr-body-font", configObject["dr-body-font"])
    styleSet.setProperty("--dr-gallery-color", configObject[gallery].color)
    styleSet.setProperty("--dr-gallery-color-active", configObject[gallery].activeColor)
    if (configObject[gallery].hasOwnProperty("dateRangeColor")) {
        styleSet.setProperty("--dr-gallery-color-dateRange", configObject[gallery].dateRangeColor)
    }
}