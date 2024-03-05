export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const convertColorsStringToColorsObject = (input: string) => {
    // Crear un mapa de correspondencias entre las claves del string y las claves del objeto
    const keyMap: { [key: string]: string } = { Hair: "hairColor", Eyes: "eyesColor", Skin: "skinTone", Clothes: "clothesColor", Gender: "gender" }

    // Crear un objeto vacío para almacenar los resultados
    let colors: { [key: string]: string } = {}

    // Dividir el string de entrada en pares clave-valor
    input.split(', ').forEach(pair => {
        let [originalKey, value] = pair.split(': ')
        // Usar el mapa de correspondencias para convertir las claves
        let mappedKey = keyMap[originalKey]
        if (mappedKey) {
            colors[mappedKey] = value
        }
    });

    return colors
}