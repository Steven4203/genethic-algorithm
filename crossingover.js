var randomstring = require('random-string-gen')

const iterationNumber = 1
const populationNumber = 10
const crossingOverRatio = 0.3
const mutationRatio = 1
const bitSize = 6

function randomizeArrays(populationNumber) {
    let populations = []
    for (let i = 0; i < populationNumber; i++) {
        let randomBinaryNumber = randomstring({
            length: 6,
            type: 'binary',
        })

        if (parseInt(randomBinaryNumber, 2) > 36) {
            i -= 1
            continue
        }

        populations.push(randomBinaryNumber)
        //console.log(parseInt(populations[i], 2));
    }
    return populations
}

function calculateFitnessScores(arr, populationNumber, bestFit) {
    let fitnessScore = 0
    let tempNumber

    for (let i = 0; i < populationNumber; i++) {
        tempNumber =
            (36 * parseInt(arr[i], 2) + 20) /
            (parseInt(arr[i], 2) * parseInt(arr[i], 2) + 2)
        if (tempNumber > bestFit.bestFitnessScoredNumber) {
            // console.log(
            //     'Yeni en iyi skor => ' +
            //         tempNumber +
            //         '\nYeni en iyi eleman => ' +
            //         parseInt(arr[i], 2)
            // )
            bestFit.bestFitNumber = parseInt(arr[i], 2)
            bestFit.bestFitnessScoredNumber = tempNumber
        }
        fitnessScore += tempNumber
    }

    if (fitnessScore > bestFit.bestFitnessScore) {
        // console.log(
        //     'Yeni en iyi grup skoru => ' +
        //         fitnessScore +
        //         '\nYeni en iyi küme => ' +
        //         arr
        // )
        bestFit.bestFitnessScore = fitnessScore
        bestFit.bestFitnessArray = arr
    }

    return bestFit
}

function crossingOver(arr, crossingOverRatio, bitSize) {
    let arrSum = 0
    let arrRouletteRatio = []
    let randomMembers = []
    let arrRouletteRatioSum = 0
    let randomCrossPoint = Math.floor(Math.random() * bitSize + 1)

    let crossingOverNumber = Math.round(arr.length * crossingOverRatio)

    if (crossingOverNumber % 2 == 1) {
        crossingOverNumber += 1
    }

    arr.forEach((element) => {
        arrSum += parseInt(element, 2)
    })

    let rouletteRatio = 100 / arrSum

    for (let i = 0; i < arr.length; i++) {
        let memberChance = parseInt(parseInt(arr[i], 2) * rouletteRatio)
        if (memberChance == 0) {
            memberChance = 1
        }
        arrRouletteRatio.push(arrRouletteRatioSum + memberChance)
        arrRouletteRatioSum += memberChance
    }

    for (let i = 0; i < crossingOverNumber; i++) {
        let randomNumber = Math.floor(Math.random() * 101)
        for (let j = 0; j < arr.length; j++) {
            if (
                (randomNumber < arrRouletteRatio[j + 1] &&
                    randomNumber > arrRouletteRatio[j] &&
                    j < arr.length - 1) ||
                randomNumber == arrRouletteRatio[j]
            ) {
                randomMembers.push(j)
                break
            } else if (
                j == arr.length - 1 &&
                randomNumber >= arrRouletteRatio[arr.length - 1]
            ) {
                randomMembers.push(arr.length - 1)
                break
            } else if (
                j == arr.length - 1 &&
                randomNumber < arrRouletteRatio[0]
            ) {
                randomMembers.push(0)
                break
            }
        }
    }

    for (let i = 0; i < randomMembers.length / 2; i++) {
        let temp = arr[randomMembers[i]].substring(randomCrossPoint);
        let temp2 = arr[randomMembers[randomMembers-i-1]].substring(randomCrossPoint)
        console.log(temp);
        console.log(temp2);
    }
}

function main() {
    let bestFit = {
        bestFitnessScore: 0,
        bestFitnessArray: [],
        bestFitnessScoredNumber: 0,
        bestFitNumber: 0,
    }

    let arr = randomizeArrays(populationNumber)
    console.log(arr)
    bestFit = calculateFitnessScores(arr, populationNumber, bestFit)
    //console.log(bestFit)
    crossingOver(arr, crossingOverRatio, bitSize)
}

main()
