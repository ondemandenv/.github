/**
 * Sort the packages using the following criteria:
 *
 * - A package is **bulky** if its volume (Width x Height x Length) is greater than or equal to 1,000,000 cm³ or when one of its dimensions is greater or equal to 150 cm.
 * - A package is **heavy** when its mass is greater or equal to 20 kg.
 *
 * You must dispatch the packages in the following stacks:
 *
 * - **STANDARD**: standard packages (those that are not bulky or heavy) can be handled normally.
 * - **SPECIAL**: packages that are either heavy or bulky can't be handled automatically.
 * - **REJECTED**: packages that are **both** heavy and bulky are rejected.
 *
 * ### Implementation
 *
 * Implement the function **`sort(width, height, length, mass)`** (units are centimeters for the dimensions and kilogram for the mass). This function must return a string: the name of the stack where the package should go.
 * @param width
 * @param height
 * @param length
 * @param mass
 */

function sort(width: number, height: number, length: number, mass: number): "REJECTED" | "SPECIAL" | "STANDARD" {
    const volume = width * height * length;
    const isBulky = volume >= 1000000 || width >= 150 || height >= 150 || length >= 150;
    const isHeavy = mass >= 20;

    if (isBulky && isHeavy) {
        return "REJECTED";
    } else if (isBulky || isHeavy) {
        return "SPECIAL";
    } else {
        return "STANDARD";
    }
}

//simple test cases:
if (sort(100, 50, 200, 19) != "SPECIAL") throw new Error("SPECIAL is expected") ;
if (sort(50, 50, 50, 5) != "STANDARD") throw new Error("STANDARD is expected")
if (sort(200, 200, 200, 30) != "REJECTED") throw new Error("REJECTED is expected")
if (sort(100, 100, 100, 10) != "SPECIAL") throw new Error("SPECIAL is expected")


console.log("tests passed ...");