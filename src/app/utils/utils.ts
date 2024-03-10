export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const convertStringToCharacterObject = (input: string) => {
    const keyMap: { [key: string]: string } = { Glasses: "glassesBoolean", FaceShape: "faceShape", Hair: "hairColor", Eyes: "eyesColor", Skin: "skinTone", Clothes: "clothesColor" }
    let values: { [key: string]: string } = {}

    input.split(', ').forEach(pair => {
        let [originalKey, value] = pair.split(': ')
        let mappedKey = keyMap[originalKey]
        if (mappedKey) {
            values[mappedKey] = value
        }
    });

    return values
}