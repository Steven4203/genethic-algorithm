var randomstring = require('random-string-gen')

const iterationNumber = 50
const populationNumber = 10
const crossingOverRatio = 0.7
const mutationRatio = 0.01
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

    if (randomCrossPoint == 0 || randomCrossPoint == bitSize) {
        randomCrossPoint = bitSize / 2
    }

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
    //console.log(randomMembers)

    for (let i = 0; i < randomMembers.length / 2; i++) {
        //TR: Stringleri
        let temp = arr[randomMembers[i]].substring(randomCrossPoint)
        let temp2 =
            arr[randomMembers[randomMembers.length - i - 1]].substring(
                randomCrossPoint
            )

        //console.log(i + '.eleman => ' + temp)
        //console.log(randomMembers.length - i - 1 + '.eleman => ' + temp2)

        let tempBeginning = arr[randomMembers[i]].substring(0, randomCrossPoint)
        let temp2Beginning = arr[
            randomMembers[randomMembers.length - i - 1]
        ].substring(0, randomCrossPoint)

        arr[randomMembers[i]] = tempBeginning + temp2
        arr[randomMembers[randomMembers.length - i - 1]] = temp2Beginning + temp
    }
    return arr
}

function mutation(arr, mutationRatio, bitSize) {
    let mutationSize = Math.round(bitSize * mutationRatio * arr.length)

    if (mutationSize == 0) {
        mutationRatio += 1
    }

    let mutatedMember = Math.floor(Math.random() * arr.length)

    let randomBitNumber = Math.floor(Math.random() * bitSize)

    if (arr[mutatedMember].charAt(randomBitNumber) == '0') {
        arr[mutatedMember] =
            arr[mutatedMember].substring(0, randomBitNumber) +
            '1' +
            arr[mutatedMember].substring(randomBitNumber + 1)
    } else {
        arr[mutatedMember] =
            arr[mutatedMember].substring(0, randomBitNumber) +
            '0' +
            arr[mutatedMember].substring(randomBitNumber + 1)
    }

    return arr
}

function main() {
    let bestFit = {
        bestFitnessScore: 0,
        bestFitnessArray: [],
        bestFitnessScoredNumber: 0,
        bestFitNumber: 0,
    }

    let arr = randomizeArrays(populationNumber)
    bestFit = calculateFitnessScores(arr, populationNumber, bestFit)
    console.log('1. Fitness Sonucu\n' + '----------------------------------')
    console.log(bestFit)
    console.log('\n\n')

    for (let i = 0; i < iterationNumber - 1; i++) {
        arr = crossingOver(arr, crossingOverRatio, bitSize)
        arr = mutation(arr, mutationRatio, bitSize)
        bestFit = calculateFitnessScores(arr, populationNumber, bestFit)
        console.log(
            (i+2) + '. Fitness Sonucu\n' + '----------------------------------'
        )
        console.log(bestFit)
        console.log('\n\n')
    }
}

main()
